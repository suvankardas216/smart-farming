import express from "express";
import { protect, admin } from "../middlewares/authMiddleware.js";
import User from "../models/User.js";
import Product from "../models/Product.js";
import Order from "../models/orderModel.js";
import Advisory from "../models/CropAdvisory.js";


const router = express.Router();

// Dashboard stats
router.get("/stats", protect, admin, async (req, res) => {
    try {
        const users = await User.countDocuments();
        const products = await Product.countDocuments();
        const orders = await Order.countDocuments();
        const advisories = await Advisory.countDocuments();

        res.json({ users, products, orders, advisories });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get all users
router.get("/users", protect, admin, async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Ban a user
router.put("/user/:id/ban", protect, admin, async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { isBanned: true },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "User banned successfully", user });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Unban a user
router.put("/user/:id/unban", protect, admin, async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { isBanned: false },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "User unbanned successfully", user });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


export default router;
