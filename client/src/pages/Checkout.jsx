import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (paymentMethod === "upi") {
        setStatus("Online payments coming soon.");
        setLoading(false);
        return;
      }

      await api.post("/orders", {
        products: items.map((i) => ({
          product: i.product._id,
          qty: i.qty,
          price: i.product.price
        })),
        totalPrice: subtotal,
        paymentMethod
      });

      clearCart();
      setStatus("Order placed successfully (Cash on Delivery).");
    } catch (err) {
      setStatus("Checkout failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-page py-10">
      <h2 className="text-2xl font-semibold">Checkout</h2>

      <div className="grid lg:grid-cols-2 gap-8 mt-6">
        <form onSubmit={handleSubmit} className="card p-6 space-y-4">
          <div>
            <label className="text-sm text-neutral-600">Full name</label>
            <input
              className="mt-2 w-full border border-neutral-300 rounded-xl px-4 py-2"
              defaultValue={user?.name || ""}
              required
            />
          </div>

          <div>
            <label className="text-sm text-neutral-600">Email</label>
            <input
              type="email"
              className="mt-2 w-full border border-neutral-300 rounded-xl px-4 py-2"
              defaultValue={user?.email || ""}
              required
            />
          </div>

          <div>
            <label className="text-sm text-neutral-600">Shipping Address</label>
            <input
              className="mt-2 w-full border border-neutral-300 rounded-xl px-4 py-2"
              required
            />
          </div>

          {/* ✅ PAYMENT DROPDOWN */}
          <div>
            <label className="text-sm text-neutral-600">Payment Method</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="mt-2 w-full border border-neutral-300 rounded-xl px-4 py-2"
            >
              <option value="cod">Cash on Delivery</option>
              <option value="upi">UPI / Card</option>
            </select>

            {paymentMethod === "cod" && (
              <p className="text-xs text-neutral-500 mt-2">
                Pay when your order is delivered.
              </p>
            )}

            {paymentMethod === "upi" && (
              <p className="text-xs text-neutral-500 mt-2">
                You’ll be redirected to secure payment (coming soon).
              </p>
            )}
          </div>

          <button
            disabled={loading || !items.length}
            className="w-full px-6 py-3 rounded-full bg-black text-white text-sm"
          >
            {loading
              ? "Processing..."
              : paymentMethod === "cod"
              ? "Place Order"
              : "Proceed to Payment"}
          </button>

          {status && (
            <div className="text-sm text-neutral-600">{status}</div>
          )}
        </form>

        <div className="card p-6 h-fit">
          <div className="font-semibold">Order summary</div>

          <div className="mt-4 space-y-2 text-sm">
            {items.map((item) => (
              <div key={item.product._id} className="flex justify-between">
                <span>
                  {item.product.model} × {item.qty}
                </span>
                <span>
                  ${(item.product.price * item.qty).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="flex justify-between font-semibold mt-4">
            <span>Total</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
