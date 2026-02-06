import { useEffect, useState } from "react";
import api from "../api/axios";

const emptyForm = {
  model: "",
  price: "",
  storage: "",
  color: "",
  images: "",
  description: "",
  stock: "",
  category: "iphone",
  series: "iphone-15"
};

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");

  const loadData = async () => {
    try {
      const [productsRes, ordersRes] = await Promise.all([
        api.get("/products"),
        api.get("/admin/orders")
      ]);
      setProducts(productsRes.data);
      setOrders(ordersRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const submitProduct = async (e) => {
    e.preventDefault();
    setMessage("");

    const imagesArray = form.images
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      name: form.model,
      model: form.model,
      category: form.category,
      series: form.series,
      price: Number(form.price),
      description: form.description,
      images: imagesArray,
      image: imagesArray[0],
      storage: form.storage,
      color: form.color,
      countInStock: Number(form.stock),
      stock: Number(form.stock)
    };

    try {
      if (editingId) {
        await api.put(`/admin/products/${editingId}`, payload);
        setMessage("✅ Product updated successfully");
      } else {
        await api.post("/admin/products", payload);
        setMessage("✅ Product created successfully");
      }

      setForm(emptyForm);
      setEditingId(null);
      loadData();
    } catch (err) {
      console.error(err);
      setMessage("❌ Operation failed. Check inputs.");
    }
  };

  const editProduct = (p) => {
    setEditingId(p._id);
    setForm({
      model: p.model,
      price: p.price,
      storage: p.storage || "",
      color: p.color || "",
      images: p.images?.join(", ") || "",
      description: p.description || "",
      stock: p.countInStock || "",
      category: p.category || "iphone",
      series: p.series || "iphone-15"
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteProduct = async (id) => {
    if (!confirm("Delete this product?")) return;
    try {
      await api.delete(`/admin/products/${id}`);
      setMessage("🗑️ Product deleted");
      loadData();
    } catch (err) {
      setMessage("❌ Delete failed");
    }
  };

  return (
    <div className="container-page py-10">
      <h2 className="text-2xl font-semibold">Admin Dashboard</h2>

      {message && (
        <div className="mt-4 text-sm text-green-600">{message}</div>
      )}

      <div className="grid lg:grid-cols-2 gap-8 mt-6">
        {/* FORM */}
        <form onSubmit={submitProduct} className="card p-6 space-y-3">
          <div className="font-semibold">
            {editingId ? "Edit Product" : "Add Product"}
          </div>

          <input
            placeholder="Model"
            value={form.model}
            onChange={(e) => setForm({ ...form, model: e.target.value })}
            className="border rounded px-3 py-2"
            required
          />

          <input
            placeholder="Price"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            className="border rounded px-3 py-2"
            required
          />

          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="border rounded px-3 py-2"
          >
            <option value="iphone">iPhone</option>
            <option value="macbook">MacBook</option>
            <option value="ipad">iPad</option>
            <option value="airpods">AirPods</option>
            <option value="watch">Watch</option>
          </select>

          <select
            value={form.series}
            onChange={(e) => setForm({ ...form, series: e.target.value })}
            className="border rounded px-3 py-2"
          >
            <option value="iphone-15">iPhone 15</option>
            <option value="iphone-14">iPhone 14</option>
            <option value="iphone-13">iPhone 13</option>
            <option value="iphone-se">iPhone SE</option>
            <option value="macbook-air">MacBook Air</option>
            <option value="macbook-pro">MacBook Pro</option>
            <option value="ipad-pro">iPad Pro</option>
            <option value="airpods">AirPods</option>
            <option value="watch-series">Apple Watch</option>
          </select>

          <input
            placeholder="Storage"
            value={form.storage}
            onChange={(e) => setForm({ ...form, storage: e.target.value })}
            className="border rounded px-3 py-2"
          />

          <input
            placeholder="Color"
            value={form.color}
            onChange={(e) => setForm({ ...form, color: e.target.value })}
            className="border rounded px-3 py-2"
          />

          <input
            placeholder="Images (comma separated URLs)"
            value={form.images}
            onChange={(e) => setForm({ ...form, images: e.target.value })}
            className="border rounded px-3 py-2"
            required
          />

          <input
            placeholder="Description"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            className="border rounded px-3 py-2"
          />

          <input
            placeholder="Stock"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
            className="border rounded px-3 py-2"
            required
          />

          <button className="bg-black text-white px-6 py-2 rounded-full">
            {editingId ? "Update" : "Create"}
          </button>
        </form>

        {/* PRODUCTS LIST */}
        <div className="card p-4">
          <div className="font-semibold">Products</div>
          <div className="mt-4 space-y-2 text-sm">
            {products.map((p) => (
              <div key={p._id} className="flex justify-between">
                <div>
                  <div className="font-medium">{p.model}</div>
                  <div className="text-neutral-500">${p.price}</div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => editProduct(p)}
                    className="underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteProduct(p._id)}
                    className="text-red-500"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ORDER HISTORY */}
      <div className="card p-6 mt-10">
        <div className="font-semibold text-lg">Order History</div>

        {orders.length === 0 ? (
          <div className="mt-4 text-sm text-neutral-500">
            No orders placed yet.
          </div>
        ) : (
          <div className="mt-4 space-y-4 text-sm">
            {orders.map((order) => (
              <div
                key={order._id}
                className="border border-neutral-200 rounded-lg p-4"
              >
                <div className="font-medium">
                  {order.user?.name}{" "}
                  <span className="text-neutral-500">
                    ({order.user?.email})
                  </span>
                </div>

                <ul className="mt-2 space-y-1">
                  {order.products.map((p, idx) => (
                    <li key={idx} className="text-neutral-600">
                      • {p.product?.model} × {p.qty} — ${p.price}
                    </li>
                  ))}
                </ul>

                <div className="mt-2 flex justify-between font-medium">
                  <span>Total: ${order.totalPrice}</span>
                  <span className="text-xs text-neutral-500">
                    {order.status}
                  </span>
                </div>

                <div className="mt-1 text-xs text-neutral-400">
                  {new Date(order.createdAt).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
