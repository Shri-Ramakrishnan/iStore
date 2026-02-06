import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import Loader from "../components/Loader";

export default function Profile() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const { data } = await api.get("/orders/my");
      setOrders(data);
      setLoading(false);
    };
    fetchOrders();
  }, []);

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
              <div className="font-semibold">Total: ${order.totalPrice}</div>
              <div className="text-sm text-neutral-600">Status: {order.status}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
