import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    products: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        qty: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true, min: 0 },
        selectedColor: { type: String, trim: true, default: "" }
      }
    ],
    shippingAddress: {
      state: { type: String, required: true, trim: true },
      district: { type: String, required: true, trim: true },
      city: { type: String, required: true, trim: true },
      pincode: { type: String, required: true, trim: true },
      addressLine: { type: String, required: true, trim: true }
    },
    paymentMethod: {
      type: String,
      enum: ["cod", "razorpay"],
      default: "cod"
    },
    paymentStatus: {
      type: String,
      enum: ["COD", "Paid", "Pending", "Failed", "Refunded"],
      default: "COD"
    },
    paymentDetails: {
      razorpay_order_id: { type: String, default: "" },
      razorpay_payment_id: { type: String, default: "" },
      razorpay_signature: { type: String, default: "" }
    },
    totalPrice: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["Processing", "Paid", "Cancelled", "Refunded"],
      default: "Processing"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);

