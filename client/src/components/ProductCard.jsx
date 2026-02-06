import { Link } from "react-router-dom";
import { useState } from "react";

const FALLBACK_IMAGE =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='800' viewBox='0 0 800 800'><rect width='800' height='800' fill='%23f5f5f7'/><rect x='160' y='160' width='480' height='480' rx='60' fill='%23eeeeee'/></svg>";

export default function ProductCard({ product }) {
  const title = product.name || product.model;
  const image = product.images?.[0] || product.image;
  const storage = product.storageOptions?.[0] || product.storage;
  const [imgSrc, setImgSrc] = useState(image || FALLBACK_IMAGE);

  return (
    <div className="card overflow-hidden">
      <img
        src={imgSrc}
        alt={title}
        onError={() => setImgSrc(FALLBACK_IMAGE)}
        className="w-full h-56 object-cover bg-apple-gray"
      />
      <div className="p-4 flex flex-col gap-2">
        <div className="text-sm text-neutral-500">{storage}</div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <div className="text-neutral-800 font-medium">${product.price}</div>
        <Link
          to={`/products/${product._id}`}
          className="text-sm text-black underline underline-offset-4"
        >
          View details
        </Link>
      </div>
    </div>
  );
}