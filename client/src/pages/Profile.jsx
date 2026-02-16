import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import Loader from "../components/Loader";

export default function Profile() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    try {
      const { data } = await api.get("/orders/my");
      setOrders(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleCancel = async (orderId) => {
    try {
      const { data } = await api.put(`/orders/${orderId}/cancel`);

      if (data?.message === "Order cancelled successfully") {
        alert("Order Cancelled");
      } else if (data?.message === "Refund processed successfully") {
        alert("Refund Processed");
      }

      await fetchOrders();
    } catch (error) {
      alert(error?.response?.data?.message || "Failed to cancel order");
    }
  };

  return (
    <div className="container-page py-10">
      <h2 className="text-2xl font-semibold">Profile</h2>
      <div className="card p-6 mt-6">
        <div className="font-semibold">{user?.name}</div>
        <div className="text-sm text-neutral-600">{user?.email}</div>
      </div>

      <h3 className="text-xl font-semibold mt-8">Order history</h3>
      {loading ? (
        <Loader />
      ) : (
        <div className="space-y-4 mt-4">
          {orders.map((order) => (
            <div key={order._id} className="card p-4">
              <div className="text-sm text-neutral-500">{new Date(order.createdAt).toLocaleDateString()}</div>
              <div className="font-semibold">Total: ₹ {Number(order.totalPrice).toLocaleString("en-IN")}</div>
              <div className="text-sm text-neutral-600">Status: {order.status}</div>
              {order.shippingAddress && (
                <div className="text-xs text-neutral-500 mt-2">
                  {order.shippingAddress.addressLine}, {order.shippingAddress.city}, {order.shippingAddress.district}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                </div>
              )}
              {order.status === "Processing" && order.status !== "Cancelled" && order.status !== "Refunded" && (
                <button
                  onClick={() => handleCancel(order._id)}
                  className="mt-3 text-xs px-3 py-1 rounded-full border border-neutral-300 hover:border-black"
                >
                  Cancel Order
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
