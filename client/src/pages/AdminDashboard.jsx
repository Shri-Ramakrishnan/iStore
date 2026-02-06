import { useEffect, useState } from "react";
import api from "../api/axios";

const emptyForm = {
  model: "",
  price: "",
  storage: "",
  color: "",
  images: "",
  description: "",
  stock: ""
};

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const loadData = async () => {
    const [productsRes, ordersRes] = await Promise.all([
      api.get("/products"),
      api.get("/admin/orders")
    ]);
    setProducts(productsRes.data);
    setOrders(ordersRes.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const submitProduct = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
      images: form.images.split(",").map((s) => s.trim())
    };

    if (editingId) {
      await api.put(`/admin/products/${editingId}`, payload);
    } else {
      await api.post("/admin/products", payload);
    }

    setForm(emptyForm);
    setEditingId(null);
    loadData();
  };

  const editProduct = (p) => {
    setEditingId(p._id);
    setForm({
      model: p.model,
      price: p.price,
      storage: p.storage,
      color: p.color,
      images: p.images.join(", "),
      description: p.description,
      stock: p.stock
    });
  };

  const deleteProduct = async (id) => {
    await api.delete(`/admin/products/${id}`);
    loadData();
  };

  return (
    <div className="container-page py-10">
      <h2 className="text-2xl font-semibold">Admin Dashboard</h2>

      <div className="grid lg:grid-cols-2 gap-8 mt-6">
        <form onSubmit={submitProduct} className="card p-6 space-y-3">
          <div className="font-semibold">{editingId ? "Edit Product" : "Add Product"}</div>
          <input
            className="w-full border border-neutral-300 rounded-xl px-4 py-2"
            placeholder="Model"
            value={form.model}
            onChange={(e) => setForm({ ...form, model: e.target.value })}
            required
          />
          <input
            className="w-full border border-neutral-300 rounded-xl px-4 py-2"
            placeholder="Price"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            required
          />
          <input
            className="w-full border border-neutral-300 rounded-xl px-4 py-2"
            placeholder="Storage"
            value={form.storage}
            onChange={(e) => setForm({ ...form, storage: e.target.value })}
            required
          />
          <input
            className="w-full border border-neutral-300 rounded-xl px-4 py-2"
            placeholder="Color"
            value={form.color}
            onChange={(e) => setForm({ ...form, color: e.target.value })}
            required
          />
          <input
            className="w-full border border-neutral-300 rounded-xl px-4 py-2"
            placeholder="Images (comma separated URLs)"
            value={form.images}
            onChange={(e) => setForm({ ...form, images: e.target.value })}
            required
          />
          <input
            className="w-full border border-neutral-300 rounded-xl px-4 py-2"
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
          />
          <input
            className="w-full border border-neutral-300 rounded-xl px-4 py-2"
            placeholder="Stock"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
            required
          />
          <button className="px-6 py-3 rounded-full bg-black text-white text-sm">
            {editingId ? "Update" : "Create"}
          </button>
        </form>

        <div className="space-y-4">
          <div className="card p-4">
            <div className="font-semibold">Products</div>
            <div className="mt-4 space-y-2 text-sm">
              {products.map((p) => (
                <div key={p._id} className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">{p.model}</div>
                    <div className="text-neutral-500">${p.price}</div>
                  </div>
                  <div className="flex gap-2">
                    <button className="text-sm underline" onClick={() => editProduct(p)}>
                      Edit
                    </button>
                    <button className="text-sm text-red-500" onClick={() => deleteProduct(p._id)}>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-4">
            <div className="font-semibold">Orders</div>
            <div className="mt-4 space-y-2 text-sm">
              {orders.map((o) => (
                <div key={o._id} className="flex justify-between">
                  <span>{o.user?.name || "User"}</span>
                  <span>${o.totalPrice}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
