import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    model: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ["iphone", "macbook", "ipad", "airpods", "watch"],
      required: true
    },
    series: { type: String, required: true, trim: true },
    isFeatured: { type: Boolean, required: true, default: false },
    price: { type: Number, required: true, min: 0 },
    storageOptions: {
      type: [String],
      default: [],
      validate: {
        validator: (value) => Array.isArray(value) && value.length > 0,
        message: "At least one storage option is required"
      }
    },
    colorOptions: {
      type: [String],
      default: [],
      validate: {
        validator: (value) => Array.isArray(value) && value.length > 0,
        message: "At least one color option is required"
      }
    },
    storage: { type: String, required: true, trim: true },
    color: { type: String, required: true, trim: true },
    image: { type: String, required: true, trim: true },
    images: {
      type: [String],
      required: true,
      validate: {
        validator: (value) => Array.isArray(value) && value.length > 0,
        message: "At least one product image is required"
      }
    },
    description: { type: String, required: true, trim: true },
    stock: { type: Number, required: true, min: 0 },
    countInStock: { type: Number, default: 0, min: 0 }
  },
  { timestamps: true }
);

productSchema.pre("validate", function syncStockFields(next) {
  if ((!this.images || this.images.length === 0) && this.image) {
    this.images = [this.image];
  }

  if (!this.image && this.images && this.images.length) {
    this.image = this.images[0];
  }

  if (typeof this.stock === "number" && Number.isFinite(this.stock)) {
    this.countInStock = this.stock;
  } else if (typeof this.countInStock === "number" && Number.isFinite(this.countInStock)) {
    this.stock = this.countInStock;
  }

  next();
});

export default mongoose.model("Product", productSchema);

