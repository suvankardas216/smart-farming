import express from "express";
import { createResource, getAllResources, getResource, updateResource, deleteResource } from "../controllers/resourceController.js";
import { protect, admin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public endpoints
router.get("/",protect, getAllResources);
router.get("/:id",protect, getResource);

// Admin protected endpoints
router.post("/", protect, admin, createResource);
router.put("/:id", protect, admin, updateResource);
router.delete("/:id", protect, admin, deleteResource);

export default router;
