import express from "express";
import { cancelOrder, createOrder, getMyOrders } from "../controllers/orderController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/", protect, createOrder);
router.get("/my", protect, getMyOrders);
router.put("/:id/cancel", protect, cancelOrder);

export default router;
