import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await register(form.name, form.email, form.password);
    if (result.ok) {
      navigate("/");
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="container-page py-10 max-w-lg">
      <h2 className="text-2xl font-semibold">Create account</h2>
      <form onSubmit={handleSubmit} className="card p-6 space-y-4 mt-6">
        <div>
          <label className="text-sm text-neutral-600">Name</label>
          <input
            className="mt-2 w-full border border-neutral-300 rounded-xl px-4 py-2"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="text-sm text-neutral-600">Email</label>
          <input
            type="email"
            className="mt-2 w-full border border-neutral-300 rounded-xl px-4 py-2"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="text-sm text-neutral-600">Password</label>
          <input
            type="password"
            className="mt-2 w-full border border-neutral-300 rounded-xl px-4 py-2"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
        </div>
        <button className="w-full px-6 py-3 rounded-full bg-black text-white text-sm">
          Create account
        </button>
        {error && <div className="text-sm text-red-500">{error}</div>}
      </form>
    </div>
  );
}