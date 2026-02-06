import express from "express";
import { createOrder, verifyPayment } from "../controllers/paymentsController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/create-order", protect, createOrder);
router.post("/verify", protect, verifyPayment);

export default router;
