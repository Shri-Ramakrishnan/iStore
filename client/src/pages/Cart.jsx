import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import QuantitySelector from "../components/QuantitySelector";
import EmptyState from "../components/EmptyState";

const FALLBACK_IMAGE =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'><rect width='400' height='400' fill='%23f5f5f7'/><rect x='90' y='90' width='220' height='220' rx='30' fill='%23e5e5e5'/></svg>";

export default function Cart() {
  const { items, removeFromCart, updateQty, subtotal } = useCart();

  if (!items.length) {
    return (
      <div className="container-page py-10">
        <EmptyState title="Your cart is empty" subtitle="Browse iPhones and add items." />
        <Link to="/products?category=iphone" className="underline">
          Go to products
        </Link>
      </div>
    );
  }

  return (
    <div className="container-page py-10">
      <h2 className="text-2xl font-semibold">Your Cart</h2>
      <div className="grid lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.cartKey} className="card p-4 flex gap-4 items-center">
              <img
                src={item.product.images?.[0] || item.product.image || FALLBACK_IMAGE}
                alt={item.product.name || item.product.model}
                onError={(event) => {
                  event.currentTarget.onerror = null;
                  event.currentTarget.src = FALLBACK_IMAGE;
                }}
                className="w-20 h-20 rounded-xl object-cover bg-apple-gray"
              />
              <div className="flex-1">
                <div className="font-semibold">{item.product.name || item.product.model}</div>
                <div className="text-sm text-neutral-500">{item.product.storage}</div>
                {item.selectedColor && <div className="text-sm text-neutral-500">Color: {item.selectedColor}</div>}
                <div className="text-sm text-neutral-700">₹ {Number(item.product.price).toLocaleString("en-IN")}</div>
              </div>
              <QuantitySelector value={item.qty} onChange={(qty) => updateQty(item.cartKey, qty)} />
              <button
                onClick={() => removeFromCart(item.cartKey)}
                className="text-sm text-neutral-500 hover:text-black"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <div className="card p-6 h-fit">
          <div className="flex justify-between text-sm text-neutral-600">
            <span>Subtotal</span>
            <span>₹ {Number(subtotal).toLocaleString("en-IN")}</span>
          </div>
          <div className="flex justify-between text-sm text-neutral-600 mt-2">
            <span>Shipping</span>
            <span>Free</span>
          </div>
          <div className="flex justify-between font-semibold text-lg mt-4">
            <span>Total</span>
            <span>₹ {Number(subtotal).toLocaleString("en-IN")}</span>
          </div>
          <Link
            to="/checkout"
            className="mt-6 block text-center px-6 py-3 rounded-full bg-black text-white text-sm"
          >
            Proceed to checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
