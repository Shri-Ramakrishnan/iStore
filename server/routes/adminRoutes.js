import express from "express";
import { admin, protect } from "../middleware/auth.js";
import { createProduct, deleteProduct, getAllOrders, updateProduct } from "../controllers/adminController.js";

const router = express.Router();

router.post("/products", protect, admin, createProduct);
router.put("/products/:id", protect, admin, updateProduct);
router.delete("/products/:id", protect, admin, deleteProduct);
router.get("/orders", protect, admin, getAllOrders);

export default router;
