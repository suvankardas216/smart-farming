import express from "express";
import {
    getSchemes,
    getCategories,
    addScheme as createScheme, // rename to match route usage
    updateScheme,
    deleteScheme
} from "../controllers/schemeController.js";
import { protect, admin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", getSchemes);
router.get("/categories", getCategories); // NEW route
router.post("/", protect, admin, createScheme);
router.put("/:id", protect, admin, updateScheme);
router.delete("/:id", protect, admin, deleteScheme);

export default router;
