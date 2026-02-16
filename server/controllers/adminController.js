import Product from "../models/Product.js";
import Order from "../models/Order.js";

const parseCsv = (value) =>
  String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

const normalizeStringArray = (value, fallback = []) => {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }
  if (typeof value === "string") {
    return parseCsv(value);
  }
  return fallback;
};

const toNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const buildProductPayload = (body, existingProduct = null) => {
  const existing = existingProduct || {};

  const model = String(body.model || body.name || existing.model || existing.name || "").trim();
  const name = String(body.name || body.model || existing.name || existing.model || "").trim();

  const storageOptions = normalizeStringArray(
    body.storageOptions,
    normalizeStringArray(existing.storageOptions, parseCsv(body.storage || existing.storage || ""))
  );

  const colorOptions = normalizeStringArray(
    body.colorOptions,
    normalizeStringArray(existing.colorOptions, parseCsv(body.color || existing.color || ""))
  );

  const images = normalizeStringArray(body.images, normalizeStringArray(existing.images, []));

  const stock = toNumber(body.stock ?? body.countInStock, toNumber(existing.stock ?? existing.countInStock, 0));

  const payload = {
    name,
    model,
    category: String(body.category || existing.category || "iphone").trim(),
    series: String(body.series || existing.series || "iphone-15").trim(),
    isFeatured:
      typeof body.isFeatured === "boolean"
        ? body.isFeatured
        : String(body.isFeatured || "").toLowerCase() === "true"
        ? true
        : typeof existing.isFeatured === "boolean"
        ? existing.isFeatured
        : false,
    price: toNumber(body.price, toNumber(existing.price, 0)),
    description: String(body.description || existing.description || "").trim(),
    images,
    image: String(body.image || images[0] || existing.image || "").trim(),
    storage: String(body.storage || storageOptions[0] || existing.storage || "").trim(),
    color: String(body.color || colorOptions[0] || existing.color || "").trim(),
    storageOptions,
    colorOptions,
    stock,
    countInStock: stock
  };

  return payload;
};

export const createProduct = async (req, res) => {
  try {
    const payload = buildProductPayload(req.body);
    const product = await Product.create(payload);
    res.status(201).json(product);
  } catch (err) {
    console.error("createProduct error", err);
    res.status(400).json({ message: err.message || "Failed to create product" });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const existing = await Product.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ message: "Product not found" });
    }

    const payload = buildProductPayload(req.body, existing);

    const updated = await Product.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true
    });

    res.json(updated);
  } catch (err) {
    console.error("updateProduct error", err);
    res.status(400).json({ message: err.message || "Failed to update product" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await product.deleteOne();
    res.json({ message: "Product removed" });
  } catch (err) {
    console.error("deleteProduct error", err);
    res.status(400).json({ message: err.message || "Failed to delete product" });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("user", "name email")
      .populate("products.product", "model name price images image")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error("getAllOrders error", err);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

