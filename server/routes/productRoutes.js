import express from "express";
import upload from "../config/upload.js";
import Product from "../models/Product.js";
import { createProduct, getProducts, updateProduct, deleteProduct, getMyProducts, addReview, getReviews, getProductById } from "../controllers/productController.js";
import { protect, admin } from "../middlewares/authMiddleware.js";
import { ownerOrAdmin } from "../middlewares/ownership.js";

const router = express.Router();



// Get all products
router.get("/", getProducts);

// Get single product by ID
router.get("/:id", getProductById);

// READ MINE – only my products
router.get("/mine", protect, getMyProducts);

// Add new product with image
router.post("/create", protect, admin, upload.single("image"), createProduct);

// UPDATE – only owner or admin
router.put(
    "/update/:id",
    protect,
    ownerOrAdmin({ model: Product, ownerField: "createdBy", idParam: "id" }),
    upload.single("image"),
    updateProduct
);

// DELETE – only owner or admin
router.delete(
    "/delete/:id",
    protect,
    ownerOrAdmin({ model: Product, ownerField: "createdBy", idParam: "id" }),
    deleteProduct
);

router.post("/:id/review", protect, addReview); // Add review
router.get("/:id/review", getReviews);          // Get all reviews

export default router;
