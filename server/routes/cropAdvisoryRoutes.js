import express from "express";
import { 
    createAdvisory, 
    getAdvisory, 
    createAdvisoryRequest, 
    getAdvisoryRequests, 
    resolveAdvisoryRequest 
} from "../controllers/cropAdvisoryController.js";
import { verifyToken, verifyRole } from "../middlewares/authMiddleware.js";

const router = express.Router();


// Get advisory for a crop (auto-submits request if not found)
router.get("/", verifyToken, getAdvisory);

// Manually submit advisory request
router.post("/request", verifyToken, createAdvisoryRequest);


// Create advisory manually
router.post("/", verifyToken, verifyRole(["admin", "expert"]), createAdvisory);

// Get all pending advisory requests
router.get("/admin/requests", verifyToken, verifyRole(["admin", "expert"]), getAdvisoryRequests);

// Resolve a request by creating advisory
router.patch("/admin/requests/:requestId/resolve", verifyToken, verifyRole(["admin", "expert"]), resolveAdvisoryRequest);

export default router;
