import CropAdvisory from "../models/CropAdvisory.js";
import AdvisoryRequest from "../models/AdvisoryRequest.js";

// Create advisory (admin/expert)
export const createAdvisory = async (req, res) => {
    try {
        const advisory = new CropAdvisory(req.body);
        await advisory.save();
        res.status(201).json(advisory);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get all pending requests (admin)
export const getAdvisoryRequests = async (req, res) => {
    try {
        const requests = await AdvisoryRequest.find().sort({ createdAt: -1 });
        res.status(200).json(requests);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};



// Get advisory (farmer)
export const getAdvisory = async (req, res) => {
    try {
        const { cropType, location, soilCondition } = req.query;

        const advisory = await CropAdvisory.findOne({
            cropType: { $regex: new RegExp(`^${cropType}$`, "i") },
            location: { $regex: new RegExp(`^${location}$`, "i") },
            soilCondition: { $regex: new RegExp(`^${soilCondition}$`, "i") },
        });

        if (!advisory) {
            // Check if request already exists
            const existingRequest = await AdvisoryRequest.findOne({
                cropType, location, soilCondition, status: "pending"
            });

            if (!existingRequest) {
                const request = new AdvisoryRequest({ cropType, location, soilCondition, status: "pending" });
                await request.save();
            }

            return res.status(404).json({ message: "No advisory found. Request submitted for expert review." });
        }

        res.status(200).json(advisory);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Admin resolves request by adding advisory
export const resolveAdvisoryRequest = async (req, res) => {
    try {
        const { requestId } = req.params;
        const { plantingSchedule, fertilizerAdvice, irrigationTips } = req.body;

        // Find request
        const request = await AdvisoryRequest.findById(requestId);
        if (!request) return res.status(404).json({ message: "Request not found" });

        // Create advisory from request + admin input
        const advisory = new CropAdvisory({
            cropType: request.cropType,
            location: request.location,
            soilCondition: request.soilCondition,
            plantingSchedule,
            fertilizerAdvice,
            irrigationTips,
        });
        await advisory.save();

        // Mark request as resolved
        request.status = "resolved";
        await request.save();

        res.status(201).json({ message: "Advisory created and request resolved", advisory });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Farmer manually submits advisory request
export const createAdvisoryRequest = async (req, res) => {
    try {
        const { cropType, location, soilCondition } = req.body;

        // Check duplicate pending request
        const existing = await AdvisoryRequest.findOne({ cropType, location, soilCondition, status: "pending" });
        if (existing) return res.status(400).json({ message: "Request already submitted." });

        const request = new AdvisoryRequest({ cropType, location, soilCondition, status: "pending" });
        await request.save();

        res.status(201).json({ message: "Request submitted successfully", request });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


