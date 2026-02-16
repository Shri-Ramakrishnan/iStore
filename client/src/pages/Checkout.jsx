import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

const RAZORPAY_SRC = "https://checkout.razorpay.com/v1/checkout.js";

function loadRazorpayScript() {
  return new Promise((resolve) => {
    const existing = document.querySelector(`script[src="${RAZORPAY_SRC}"]`);
    if (existing) return resolve(true);

    const script = document.createElement("script");
    script.src = RAZORPAY_SRC;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    state: "",
    district: "",
    city: "",
    pincode: "",
    addressLine: ""
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const createOrderPayload = (paymentStatus, paymentMethodValue, paymentDetails = {}) => ({
    products: items.map((item) => ({
      product: item.product._id,
      qty: item.qty,
      price: item.product.price,
      selectedColor: item.selectedColor || item.product.color || ""
    })),
    totalPrice: subtotal,
    paymentStatus,
    paymentMethod: paymentMethodValue,
    paymentDetails,
    shippingAddress: {
      state: formData.state,
      district: formData.district,
      city: formData.city,
      pincode: formData.pincode,
      addressLine: formData.addressLine
    }
  });

  const placeOrderCOD = async () => {
    await api.post("/orders", createOrderPayload("COD", "cod"));
    clearCart();
    setStatus("Order placed successfully (Cash on Delivery)");
  };

  const placeOrderRazorpay = async () => {
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      alert("Razorpay SDK failed to load. Please try again.");
      return;
    }

    const { data } = await api.post("/payments/create-order", {
      totalAmount: subtotal
    });

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: data.amount,
      currency: data.currency,
      order_id: data.order_id,
      name: "iStore",
      description: "Order Payment",
      handler: async (response) => {
        try {
          const verifyRes = await api.post("/payments/verify", {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature
          });

          if (!verifyRes.data?.success) {
            alert("Payment verification failed.");
            return;
          }

          await api.post(
            "/orders",
            createOrderPayload("Paid", "razorpay", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            })
          );

          clearCart();
          setStatus("Payment successful. Order placed.");
        } catch {
          alert("Payment verification failed.");
        }
      },
      prefill: {
        name: formData.fullName || user?.name || "",
        email: formData.email || user?.email || ""
      },
      theme: {
        color: "#111111"
      }
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      if (paymentMethod === "upi") {
        await placeOrderRazorpay();
      } else {
        await placeOrderCOD();
      }
    } catch (err) {
      setStatus(err?.response?.data?.message || "Checkout failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const helperText =
    paymentMethod === "upi"
      ? "You'll be redirected to secure payment (Razorpay)."
      : "Pay when your order is delivered.";

  const buttonText = paymentMethod === "upi" ? "Proceed to Payment" : "Place Order";

  return (
    <div className="container-page py-10">
      <h2 className="text-2xl font-semibold">Checkout</h2>

      <div className="grid lg:grid-cols-2 gap-8 mt-6">
        <form onSubmit={handleSubmit} className="card p-6 space-y-4">
          <div>
            <label className="text-sm text-neutral-600">Full name</label>
            <input
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="mt-2 w-full border border-neutral-300 rounded-xl px-4 py-2"
              required
            />
          </div>

          <div>
            <label className="text-sm text-neutral-600">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-2 w-full border border-neutral-300 rounded-xl px-4 py-2"
              required
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-neutral-600">State</label>
              <input
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="mt-2 w-full border border-neutral-300 rounded-xl px-4 py-2"
                required
              />
            </div>
            <div>
              <label className="text-sm text-neutral-600">District</label>
              <input
                name="district"
                value={formData.district}
                onChange={handleChange}
                className="mt-2 w-full border border-neutral-300 rounded-xl px-4 py-2"
                required
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-neutral-600">City/Town</label>
              <input
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="mt-2 w-full border border-neutral-300 rounded-xl px-4 py-2"
                required
              />
            </div>
            <div>
              <label className="text-sm text-neutral-600">Pincode</label>
              <input
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                className="mt-2 w-full border border-neutral-300 rounded-xl px-4 py-2"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-neutral-600">Detailed Address</label>
            <textarea
              name="addressLine"
              value={formData.addressLine}
              onChange={handleChange}
              className="mt-2 w-full border border-neutral-300 rounded-xl px-4 py-2 min-h-24"
              required
            />
          </div>

          <div>
            <label className="text-sm text-neutral-600">Payment Method</label>
            <select
              value={paymentMethod}
              onChange={(event) => setPaymentMethod(event.target.value)}
              className="mt-2 w-full border border-neutral-300 rounded-xl px-4 py-2 bg-white"
            >
              <option value="cod">Cash on Delivery</option>
              <option value="upi">UPI / Card</option>
            </select>
            <p className="text-xs text-neutral-500 mt-2">{helperText}</p>
          </div>

          <button
            disabled={loading || !items.length}
            className="w-full px-6 py-3 rounded-full bg-black text-white text-sm disabled:opacity-60"
          >
            {loading ? "Processing..." : buttonText}
          </button>

          {status && <div className="text-sm text-neutral-600">{status}</div>}
        </form>

        <div className="card p-6 h-fit">
          <div className="font-semibold">Order summary</div>

          <div className="mt-4 space-y-2 text-sm">
            {items.map((item) => (
              <div key={item.cartKey || item.product._id} className="flex justify-between gap-3">
                <span>
                  {(item.product.name || item.product.model)} × {item.qty}
                  {item.selectedColor ? ` (${item.selectedColor})` : ""}
                </span>
                <span>₹ {Number(item.product.price * item.qty).toLocaleString("en-IN")}</span>
              </div>
            ))}
          </div>

          <div className="flex justify-between font-semibold mt-4">
            <span>Total</span>
            <span>₹ {Number(subtotal).toLocaleString("en-IN")}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
