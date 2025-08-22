// models/AdvisoryRequest.js
import mongoose from "mongoose";

const advisoryRequestSchema = new mongoose.Schema({
    cropType: { type: String, required: true },
    location: { type: String, required: true },
    soilCondition: { type: String, required: true },
    status: { type: String, default: "pending" }, // pending, resolved
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("AdvisoryRequest", advisoryRequestSchema);
