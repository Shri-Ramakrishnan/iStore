import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    model: { type: String, required: true },
    category: {
      type: String,
      enum: ["iphone", "macbook", "ipad", "airpods", "watch"],
      required: true
    },
    series: { type: String, required: true },
    isFeatured: { type: Boolean, required: true, default: false },
    price: { type: Number, required: true },
    storageOptions: [{ type: String, required: true }],
    colorOptions: [{ type: String, required: true }],
    storage: { type: String, required: true },
    color: { type: String, required: true },
    image: { type: String, required: true },
    images: [{ type: String, required: true }],
    description: { type: String, required: true },
    stock: { type: Number, required: true }
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);