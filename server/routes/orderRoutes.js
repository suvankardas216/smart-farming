import express from "express";
import {
    placeOrder,
    getMyOrders,
    getAllOrders,
    updateOrderStatus,
    cancelOrder,
    createPaymentIntent
} from "../controllers/orderController.js";
import { protect, admin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Stripe payment route
router.post("/create-payment-intent", protect, createPaymentIntent);

// Place new order (COD or after Stripe payment)
router.post("/", protect, placeOrder);

// Get logged-in user's orders
router.get("/my-orders", protect, getMyOrders);

// Cancel an order
router.put("/cancel/:id", protect, cancelOrder);

// Admin-only routes
router.get("/", protect, admin, getAllOrders);
router.put("/:id", protect, admin, updateOrderStatus);

export default router;
