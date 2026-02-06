import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import Product from "../models/Product.js";
import { products } from "../data/products.js";

dotenv.config();

const seed = async () => {
  await connectDB();
  await Product.deleteMany();
  await Product.insertMany(products);
  console.log("Seeded products");
  await mongoose.connection.close();
};

seed();
