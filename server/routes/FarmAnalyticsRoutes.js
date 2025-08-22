import express from "express"
import {
    addFarmAnalytics,
    getFarmAnalytics,
    updateFarmAnalytics,
    deleteFarmAnalytics,
} from "../controllers/farmAnalyticsController.js"
import { protect } from "../middlewares/authMiddleware.js"

const router = express.Router()


router
    .route("/")
    .post(protect, addFarmAnalytics) // Add new entry
    .get(protect, getFarmAnalytics) // Get all entries


router
    .route("/:id")
    .put(protect, updateFarmAnalytics) // Update entry
    .delete(protect, deleteFarmAnalytics) // Delete entry

export default router
