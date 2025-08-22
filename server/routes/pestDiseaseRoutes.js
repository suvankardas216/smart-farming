import express from "express";
import { getDiseasesByCrop, detectDiseaseFromImage } from "../controllers/pestDiseaseController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/uploadMiddleware.js";

const router = express.Router();

// GET diseases by crop type
router.get("/", verifyToken, getDiseasesByCrop);

// POST image for disease detection
router.post("/upload", verifyToken, upload.single("image"), detectDiseaseFromImage);

export default router;
