import Order from "../models/Order.js";

export const createOrder = async (req, res) => {
  const { products, totalPrice } = req.body;
  if (!products || products.length === 0) {
    return res.status(400).json({ message: "No order items" });
  }

  const order = await Order.create({
    user: req.user._id,
    products,
    totalPrice,
    status: "Processing"
  });

  res.status(201).json(order);
};

export const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
};
