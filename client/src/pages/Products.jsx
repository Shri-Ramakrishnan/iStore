import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";

const CATEGORY_TITLES = {
  iphone: "All iPhones",
  macbook: "Mac",
  ipad: "iPad",
  airpods: "AirPods",
  watch: "Apple Watch",
  accessories: "Accessories"
};

export default function Products() {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const category = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get("category") || "iphone";
  }, [location.search]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const query = category === "accessories" ? "airpods,watch" : category;
      const { data } = await api.get(`/products?category=${encodeURIComponent(query)}`);
      setProducts(data);
      setLoading(false);
    };
    fetchProducts();
  }, [category]);

  const title = CATEGORY_TITLES[category] || "Products";

  return (
    <div className="container-page py-10">
      <h2 className="text-2xl font-semibold">{title}</h2>
      {loading ? (
        <Loader />
      ) : products.length ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      ) : (
        <EmptyState title="No products found" subtitle="Try a different category." />
      )}
    </div>
  );
}