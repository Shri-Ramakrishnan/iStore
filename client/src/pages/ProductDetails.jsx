import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import Loader from "../components/Loader";
import { useCart } from "../context/CartContext";

const FALLBACK_IMAGE =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='900' viewBox='0 0 1200 900'><rect width='1200' height='900' fill='%23f5f5f7'/><rect x='300' y='160' width='600' height='580' rx='60' fill='%23e5e5e5'/></svg>";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(product?.images?.[0] || product?.image || "");
  const [selectedColor, setSelectedColor] = useState("");
  const [showAdded, setShowAdded] = useState(false);
  const timerRef = useRef(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/products/${id}`);
        setProduct(data);

        const gallery = (Array.isArray(data.images) && data.images.length ? data.images : [data.image]).filter(Boolean);
        setSelectedImage(gallery[0] || FALLBACK_IMAGE);

        const colors = data.colorOptions?.length ? data.colorOptions : [data.color].filter(Boolean);
        setSelectedColor(colors[0] || "");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleAddToCart = () => {
    if (!product || product.stock <= 0) return;
    addToCart(product, 1, selectedColor);
    setShowAdded(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setShowAdded(false), 2500);
  };

  if (loading) return <Loader />;
  if (!product) return null;

  const gallery = (Array.isArray(product.images) && product.images.length ? product.images : [product.image]).filter(Boolean);
  const title = product.name || product.model;
  const colors = product.colorOptions?.length ? product.colorOptions : [product.color].filter(Boolean);
  const storageOptions = product.storageOptions?.length ? product.storageOptions : [product.storage].filter(Boolean);
  const outOfStock = product.stock <= 0;

  return (
    <div className="container-page py-10">
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <img
            src={selectedImage || FALLBACK_IMAGE}
            alt={title}
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src = FALLBACK_IMAGE;
            }}
            className="w-full rounded-2xl bg-apple-gray"
          />

          {gallery.length > 0 && (
            <div className="flex gap-3 mt-4 flex-wrap">
              {gallery.map((img) => (
                <button
                  key={img}
                  onClick={() => setSelectedImage(img)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border ${
                    selectedImage === img ? "border-black" : "border-neutral-200"
                  }`}
                >
                  <img
                    src={img}
                    alt={title}
                    onError={(event) => {
                      event.currentTarget.onerror = null;
                      event.currentTarget.src = FALLBACK_IMAGE;
                    }}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <p className="text-sm text-neutral-500">{storageOptions[0]}</p>
          <h2 className="text-3xl font-semibold mt-2">{title}</h2>
          <p className="text-neutral-600 mt-4">{product.description}</p>
          <div className="mt-6 text-2xl font-semibold">₹ {Number(product.price || 0).toLocaleString("en-IN")}</div>

          {colors.length > 0 && (
            <div className="mt-6">
              <h4 className="text-sm text-neutral-600">Color</h4>
              <div className="mt-2 flex flex-wrap gap-2">
                {colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className={`px-3 py-2 rounded-full text-sm border ${
                      selectedColor === color
                        ? "border-black text-black"
                        : "border-neutral-300 text-neutral-600"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={handleAddToCart}
              disabled={outOfStock}
              className={`px-6 py-3 rounded-full text-sm ${
                outOfStock ? "bg-neutral-300 text-neutral-600 cursor-not-allowed" : "bg-black text-white"
              }`}
            >
              {outOfStock ? "Out of Stock" : "Add to cart"}
            </button>

            {showAdded && (
              <div className="px-4 py-2 rounded-full border border-neutral-200 bg-white text-sm text-neutral-700 shadow-sm">
                Added to cart
              </div>
            )}
          </div>

          <div className="mt-6">
            <h4 className="font-semibold">Specs</h4>
            <ul className="mt-2 text-sm text-neutral-600 space-y-1">
              <li>Storage: {storageOptions.join(", ")}</li>
              <li>Colors: {colors.join(", ")}</li>
              {selectedColor && <li>Selected: {selectedColor}</li>}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
