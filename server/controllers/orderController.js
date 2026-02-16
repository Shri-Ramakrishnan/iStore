import Product from "../models/Product.js";
import Order from "../models/Order.js";

const isValidAddress = (address) => {
  if (!address) return false;

  const requiredFields = ["state", "district", "city", "pincode", "addressLine"];
  return requiredFields.every((field) => {
    const value = address[field];
    return typeof value === "string" && value.trim().length > 0;
  });
};

export const createOrder = async (req, res) => {
  try {
    const {
      products,
      totalPrice,
      paymentMethod = "cod",
      paymentStatus = "COD",
      paymentDetails = {},
      shippingAddress
    } = req.body;

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: "No order items" });
    }

    if (!isValidAddress(shippingAddress)) {
      return res.status(400).json({ message: "Shipping address is incomplete" });
    }

    const normalizedItems = products.map((item) => ({
      product: item.product,
      qty: Number(item.qty),
      price: Number(item.price),
      selectedColor: typeof item.selectedColor === "string" ? item.selectedColor.trim() : ""
    }));

    if (normalizedItems.some((item) => !item.product || Number.isNaN(item.qty) || item.qty <= 0)) {
      return res.status(400).json({ message: "Invalid order items" });
    }

    const productIds = normalizedItems.map((item) => item.product);
    const dbProducts = await Product.find({ _id: { $in: productIds } });
    const productMap = new Map(dbProducts.map((product) => [String(product._id), product]));

    if (dbProducts.length !== new Set(productIds.map(String)).size) {
      return res.status(400).json({ message: "One or more products were not found" });
    }

    for (const item of normalizedItems) {
      const dbProduct = productMap.get(String(item.product));
      if (!dbProduct) {
        return res.status(400).json({ message: "Product not found" });
      }

      if (dbProduct.stock < item.qty) {
        return res
          .status(400)
          .json({ message: `${dbProduct.model} has only ${dbProduct.stock} left in stock` });
      }
    }

    const bulkUpdates = normalizedItems.map((item) => {
      const dbProduct = productMap.get(String(item.product));
      const newStock = dbProduct.stock - item.qty;

      return {
        updateOne: {
          filter: { _id: dbProduct._id },
          update: {
            $set: {
              stock: newStock,
              countInStock: newStock
            }
          }
        }
      };
    });

    await Product.bulkWrite(bulkUpdates);

    const status = paymentStatus === "Paid" ? "Paid" : "Processing";

    const order = await Order.create({
      user: req.user._id,
      products: normalizedItems,
      totalPrice: Number(totalPrice),
      shippingAddress: {
        state: shippingAddress.state.trim(),
        district: shippingAddress.district.trim(),
        city: shippingAddress.city.trim(),
        pincode: shippingAddress.pincode.trim(),
        addressLine: shippingAddress.addressLine.trim()
      },
      paymentMethod,
      paymentStatus,
      paymentDetails,
      status
    });

    res.status(201).json(order);
  } catch (err) {
    console.error("createOrder error", err);
    res.status(500).json({ message: "Failed to create order" });
  }
};

export const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .populate("products.product", "model name images image")
    .sort({ createdAt: -1 });
  res.json(orders);
};

export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const isOwner = String(order.user) === String(req.user._id);
    const isAdmin = req.user?.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Not authorized to cancel this order" });
    }

    if (order.status === "Cancelled") {
      return res.json({ message: "Order cancelled successfully", order });
    }

    if (order.status === "Refunded") {
      return res.json({ message: "Refund processed successfully", order });
    }

    const normalizedMethod = String(order.paymentMethod || "").toUpperCase();

    if (normalizedMethod === "COD") {
      order.status = "Cancelled";
      order.paymentStatus = "COD";
      await order.save();
      return res.json({ message: "Order cancelled successfully", order });
    }

    if (normalizedMethod === "RAZORPAY") {
      order.status = "Refunded";
      order.paymentStatus = "Refunded";
      await order.save();
      return res.json({ message: "Refund processed successfully", order });
    }

    order.status = "Cancelled";
    await order.save();
    return res.json({ message: "Order cancelled successfully", order });
  } catch (err) {
    console.error("cancelOrder error", err);
    return res.status(500).json({ message: "Failed to cancel order" });
  }
};
