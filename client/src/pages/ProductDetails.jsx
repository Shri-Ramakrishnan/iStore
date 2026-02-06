import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import Loader from "../components/Loader";
import { useCart } from "../context/CartContext";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [showAdded, setShowAdded] = useState(false);
  const timerRef = useRef(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      const { data } = await api.get(`/products/${id}`);
      setProduct(data);
      setLoading(false);
    };
    fetchProduct();
  }, [id]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleAddToCart = () => {
    addToCart(product, 1);
    setShowAdded(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setShowAdded(false), 2500);
  };

  if (loading) return <Loader />;
  if (!product) return null;

  const gallery = product.images?.length ? product.images : product.image ? [product.image] : [];
  const title = product.name || product.model;

  return (
    <div className="container-page py-10">
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <img
            src={gallery[activeImage]}
            alt={title}
            className="w-full rounded-2xl bg-apple-gray"
          />
          <div className="flex gap-3 mt-4">
            {gallery.map((img, idx) => (
              <button
                key={img}
                onClick={() => setActiveImage(idx)}
                className={`w-16 h-16 rounded-xl overflow-hidden border ${
                  idx === activeImage ? "border-black" : "border-neutral-200"
                }`}
              >
                <img src={img} alt={title} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-sm text-neutral-500">{product.storageOptions?.[0] || product.storage}</p>
          <h2 className="text-3xl font-semibold mt-2">{title}</h2>
          <p className="text-neutral-600 mt-4">{product.description}</p>
          <div className="mt-6 text-2xl font-semibold">${product.price}</div>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={handleAddToCart}
              className="px-6 py-3 rounded-full bg-black text-white text-sm"
            >
              Add to cart
            </button>
            <div className="px-4 py-3 rounded-full border border-neutral-300 text-sm">
              Stock: {product.stock}
            </div>
            {showAdded && (
              <div className="px-4 py-2 rounded-full border border-neutral-200 bg-white text-sm text-neutral-700 shadow-sm">
                Added to cart
              </div>
            )}
          </div>
          <div className="mt-6">
            <h4 className="font-semibold">Specs</h4>
            <ul className="mt-2 text-sm text-neutral-600 space-y-1">
              <li>Storage: {(product.storageOptions || [product.storage]).join(", ")}</li>
              <li>Colors: {(product.colorOptions || [product.color]).join(", ")}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}