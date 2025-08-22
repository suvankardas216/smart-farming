import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { addSoilTest, getMySoilTests, getSoilTestById } from "../controllers/soilTestController.js";

const router = express.Router();

// Add new soil test
router.post("/", protect, addSoilTest);

// Get all my soil tests
router.get("/", protect, getMySoilTests);

// Get soil test by ID
router.get("/:id", protect, getSoilTestById);

export default router;
