import { useEffect, useState } from "react";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";

export default function Home() {
  const [featuredIphones, setFeaturedIphones] = useState([]);
  const [macProducts, setMacProducts] = useState([]);
  const [ipadProducts, setIpadProducts] = useState([]);
  const [accessories, setAccessories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const [iphoneRes, macRes, ipadRes, accessoriesRes] = await Promise.all([
        api.get("/products?category=iphone"),
        api.get("/products?category=macbook"),
        api.get("/products?category=ipad"),
        api.get("/products?category=airpods,watch")
      ]);

      const featured = iphoneRes.data.filter((p) => p.isFeatured === true);
      setFeaturedIphones(featured.slice(0, 4));
      setMacProducts(macRes.data.slice(0, 4));
      setIpadProducts(ipadRes.data.slice(0, 4));
      setAccessories(accessoriesRes.data.slice(0, 4));
      setLoading(false);
    };
    fetchProducts();
  }, []);

  return (
    <div className="container-page">
      <section className="py-16">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-sm text-neutral-500">New season</p>
            <h1 className="text-4xl md:text-5xl font-semibold leading-tight mt-2">
              iPhones, refined.
            </h1>
            <p className="mt-4 text-neutral-600 max-w-md">
              A curated Apple storefront with clean design and a simple checkout flow.
            </p>
            <div className="mt-6 flex gap-4">
              <a
                href="/products?category=iphone"
                className="px-6 py-3 rounded-full bg-black text-white text-sm"
              >
                Shop iPhones
              </a>
              <a
                href="/products?category=iphone"
                className="px-6 py-3 rounded-full border border-neutral-300 text-sm"
              >
                View all
              </a>
            </div>
          </div>
          <div className="card p-8 bg-apple-gray">
            <div className="text-sm text-neutral-500">Featured lineup</div>
            <h3 className="text-2xl font-semibold mt-2">iPhone 15 Series</h3>
            <p className="text-neutral-600 mt-3">
              Lighter. Faster. Always iconic.
            </p>
            <div className="mt-6 h-48 rounded-xl bg-white border border-neutral-200"></div>
          </div>
        </div>
      </section>

      {featuredIphones.length > 0 && (
        <section className="py-10">
          <h2 className="text-2xl font-semibold">Featured iPhones</h2>
          {loading ? (
            <Loader />
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
              {featuredIphones.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          )}
        </section>
      )}

      <section className="py-10">
        <h2 className="text-2xl font-semibold">Mac</h2>
        {loading ? (
          <Loader />
        ) : macProducts.length ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
            {macProducts.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        ) : (
          <EmptyState title="No Mac products" subtitle="Check back soon." />
        )}
      </section>

      <section className="py-10">
        <h2 className="text-2xl font-semibold">iPad</h2>
        {loading ? (
          <Loader />
        ) : ipadProducts.length ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
            {ipadProducts.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        ) : (
          <EmptyState title="No iPad products" subtitle="Check back soon." />
        )}
      </section>

      <section className="py-10">
        <h2 className="text-2xl font-semibold">Accessories</h2>
        {loading ? (
          <Loader />
        ) : accessories.length ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
            {accessories.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        ) : (
          <EmptyState title="No accessories" subtitle="Check back soon." />
        )}
      </section>
    </div>
  );
}