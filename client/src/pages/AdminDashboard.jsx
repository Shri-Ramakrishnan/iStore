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
  series: "iphone-15",
  isFeatured: false
};

const toINR = (value) => `₹ ${Number(value || 0).toLocaleString("en-IN")}`;

const getErrorMessage = (err, fallback) => err?.response?.data?.message || fallback;

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");

  const loadData = async () => {
    try {
      const [productsRes, ordersRes] = await Promise.all([api.get("/products"), api.get("/admin/orders")]);
      setProducts(productsRes.data);
      setOrders(ordersRes.data);
    } catch (err) {
      setMessage(getErrorMessage(err, "Failed to load admin data"));
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const submitProduct = async (event) => {
    event.preventDefault();

    const imagesArray = form.images
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    const storageOptions = form.storage
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    const colorOptions = form.color
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    const payload = {
      name: form.model.trim(),
      model: form.model.trim(),
      category: form.category,
      series: form.series,
      isFeatured: form.isFeatured,
      price: Number(form.price),
      description: form.description.trim(),
      images: imagesArray,
      image: imagesArray[0],
      storageOptions: storageOptions.length ? storageOptions : [form.storage.trim()],
      colorOptions: colorOptions.length ? colorOptions : [form.color.trim()],
      storage: storageOptions[0] || form.storage.trim(),
      color: colorOptions[0] || form.color.trim(),
      stock: Number(form.stock),
      countInStock: Number(form.stock)
    };

    try {
      if (editingId) {
        await api.put(`/admin/products/${editingId}`, payload);
        alert("Product updated successfully");
        setMessage("Product updated successfully");
      } else {
        await api.post("/admin/products", payload);
        alert("Product created successfully");
        setMessage("Product created successfully");
      }

      setForm(emptyForm);
      setEditingId(null);
      await loadData();
    } catch (err) {
      const error = getErrorMessage(err, "Operation failed");
      alert(error);
      setMessage(error);
    }
  };

  const editProduct = (product) => {
    setEditingId(product._id);
    setForm({
      model: product.model || product.name || "",
      price: product.price || "",
      storage: product.storageOptions?.join(", ") || product.storage || "",
      color: product.colorOptions?.join(", ") || product.color || "",
      images: product.images?.join(", ") || product.image || "",
      description: product.description || "",
      stock: product.stock ?? product.countInStock ?? "",
      category: product.category || "iphone",
      series: product.series || "iphone-15",
      isFeatured: Boolean(product.isFeatured)
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    try {
      await api.delete(`/admin/products/${id}`);
      alert("Product deleted successfully");
      setMessage("Product deleted successfully");
      await loadData();
    } catch (err) {
      const error = getErrorMessage(err, "Delete failed");
      alert(error);
      setMessage(error);
    }
  };

  const cancelOrder = async (orderId) => {
    if (!window.confirm("Cancel this order?")) return;

    try {
      const { data } = await api.put(`/orders/${orderId}/cancel`);
      alert(data?.message || "Order Cancelled");
      setMessage(data?.message || "Order Cancelled");
      await loadData();
    } catch (err) {
      const error = getErrorMessage(err, "Failed to cancel order");
      alert(error);
      setMessage(error);
    }
  };

  return (
    <div className="container-page py-10">
      <h2 className="text-2xl font-semibold">Admin Dashboard</h2>

      {message && <div className="mt-4 text-sm text-neutral-700">{message}</div>}

      <div className="grid lg:grid-cols-2 gap-8 mt-6">
        <form onSubmit={submitProduct} className="card p-6 space-y-3">
          <div className="font-semibold">{editingId ? "Edit Product" : "Add Product"}</div>

          <input
            placeholder="Model"
            value={form.model}
            onChange={(event) => setForm({ ...form, model: event.target.value })}
            className="border rounded px-3 py-2"
            required
          />

          <input
            placeholder="Price"
            type="number"
            min="0"
            value={form.price}
            onChange={(event) => setForm({ ...form, price: event.target.value })}
            className="border rounded px-3 py-2"
            required
          />

          <select
            value={form.category}
            onChange={(event) => setForm({ ...form, category: event.target.value })}
            className="border rounded px-3 py-2"
          >
            <option value="iphone">iPhone</option>
            <option value="macbook">MacBook</option>
            <option value="ipad">iPad</option>
            <option value="airpods">AirPods</option>
            <option value="watch">Watch</option>
          </select>

          <input
            placeholder="Series (e.g. iphone-15)"
            value={form.series}
            onChange={(event) => setForm({ ...form, series: event.target.value })}
            className="border rounded px-3 py-2"
            required
          />

          <input
            placeholder="Storage (comma separated)"
            value={form.storage}
            onChange={(event) => setForm({ ...form, storage: event.target.value })}
            className="border rounded px-3 py-2"
            required
          />

          <input
            placeholder="Color (comma separated)"
            value={form.color}
            onChange={(event) => setForm({ ...form, color: event.target.value })}
            className="border rounded px-3 py-2"
            required
          />

          <input
            placeholder="Images (comma separated URLs)"
            value={form.images}
            onChange={(event) => setForm({ ...form, images: event.target.value })}
            className="border rounded px-3 py-2"
            required
          />

          <input
            placeholder="Description"
            value={form.description}
            onChange={(event) => setForm({ ...form, description: event.target.value })}
            className="border rounded px-3 py-2"
            required
          />

          <input
            placeholder="Stock"
            type="number"
            min="0"
            value={form.stock}
            onChange={(event) => setForm({ ...form, stock: event.target.value })}
            className="border rounded px-3 py-2"
            required
          />

          <label className="flex items-center gap-2 text-sm text-neutral-700">
            <input
              type="checkbox"
              checked={form.isFeatured}
              onChange={(event) => setForm({ ...form, isFeatured: event.target.checked })}
            />
            Featured Product
          </label>

          <button className="bg-black text-white px-6 py-2 rounded-full">
            {editingId ? "Update" : "Create"}
          </button>
        </form>

        <div className="card p-4">
          <div className="font-semibold">Products</div>
          <div className="mt-4 space-y-2 text-sm">
            {products.map((product) => (
              <div key={product._id} className="flex justify-between gap-3">
                <div>
                  <div className="font-medium">{product.model || product.name}</div>
                  <div className="text-neutral-500">{toINR(product.price)}</div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => editProduct(product)} className="underline">
                    Edit
                  </button>
                  <button onClick={() => deleteProduct(product._id)} className="text-red-500">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card p-6 mt-10">
        <div className="font-semibold text-lg">Order History</div>

        {orders.length === 0 ? (
          <div className="mt-4 text-sm text-neutral-500">No orders placed yet.</div>
        ) : (
          <div className="mt-4 space-y-4 text-sm">
            {orders.map((order) => (
              <div key={order._id} className="border border-neutral-200 rounded-lg p-4">
                <div className="font-medium">
                  {order.user?.name}{" "}
                  <span className="text-neutral-500">({order.user?.email})</span>
                </div>

                <ul className="mt-2 space-y-1">
                  {order.products.map((item, idx) => (
                    <li key={idx} className="text-neutral-600">
                      • {(item.product?.name || item.product?.model || "Product removed")} × {item.qty}
                      {item.selectedColor ? ` (${item.selectedColor})` : ""} — {toINR(item.price)}
                    </li>
                  ))}
                </ul>

                <div className="mt-2 flex justify-between font-medium items-center">
                  <span>Total: {toINR(order.totalPrice)}</span>
                  <span className="text-xs text-neutral-500">{order.status}</span>
                </div>

                <div className="mt-1 text-xs text-neutral-400">{new Date(order.createdAt).toLocaleString()}</div>

                {(order.status === "Processing" || order.status === "Paid") && (
                  <button
                    onClick={() => cancelOrder(order._id)}
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
    </div>
  );
}
