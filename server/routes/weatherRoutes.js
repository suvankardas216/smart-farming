import express from "express";
import { getWeatherWithAlerts } from "../controllers/weatherController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Farmers can get weather info
router.get("/", verifyToken, getWeatherWithAlerts);

export default router;
