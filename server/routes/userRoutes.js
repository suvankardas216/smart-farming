import express from "express";
import { protect, admin } from "../middlewares/authMiddleware.js";
import { registerUser, loginUser } from "../controllers/authController.js";
import { updateUserProfile,  getUserProfile } from "../controllers/userController.js";
import {  getAllUsers, deleteUser, updateUserRole,  } from "../controllers/userController.js";

const router = express.Router();

// Public registration (role defaults to "farmer")
router.post("/register", registerUser);
router.post("/login", loginUser);

// Profile routes
router.get("/profile", protect, (req, res) => {
    res.json({
        message: "User profile fetched successfully",
        user: req.user
    });
});

router.put("/profile", protect, updateUserProfile);
router.get("/profile", protect, getUserProfile);

// Admin routes
router.get("/", protect, admin, getAllUsers);
router.delete("/:id", protect, admin, deleteUser);
router.put("/:id/role", protect, admin, updateUserRole);


export default router;
