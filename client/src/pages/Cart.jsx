import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import QuantitySelector from "../components/QuantitySelector";
import EmptyState from "../components/EmptyState";

export default function Cart() {
  const { items, removeFromCart, updateQty, subtotal } = useCart();

  if (!items.length) {
    return (
      <div className="container-page py-10">
        <EmptyState title="Your cart is empty" subtitle="Browse iPhones and add items." />
        <Link to="/products" className="underline">Go to products</Link>
      </div>
    );
  }

  return (
    <div className="container-page py-10">
      <h2 className="text-2xl font-semibold">Your Cart</h2>
      <div className="grid lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.product._id} className="card p-4 flex gap-4 items-center">
              <img
                src={item.product.images?.[0]}
                alt={item.product.model}
                className="w-20 h-20 rounded-xl object-cover bg-apple-gray"
              />
              <div className="flex-1">
                <div className="font-semibold">{item.product.model}</div>
                <div className="text-sm text-neutral-500">{item.product.storage}</div>
                <div className="text-sm text-neutral-700">${item.product.price}</div>
              </div>
              <QuantitySelector value={item.qty} onChange={(q) => updateQty(item.product._id, q)} />
              <button
                onClick={() => removeFromCart(item.product._id)}
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
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm text-neutral-600 mt-2">
            <span>Shipping</span>
            <span>Free</span>
          </div>
          <div className="flex justify-between font-semibold text-lg mt-4">
            <span>Total</span>
            <span>${subtotal.toFixed(2)}</span>
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
