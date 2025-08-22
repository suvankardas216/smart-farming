import mongoose from "mongoose";

const cropAdvisorySchema = new mongoose.Schema({
    cropType: { type: String, required: true },
    location: { type: String, required: true },
    soilCondition: { type: String, required: true },
    plantingSchedule: { type: String },
    fertilizerAdvice: { type: String },
    irrigationTips: { type: String },
}, { timestamps: true });

const CropAdvisory = mongoose.model("CropAdvisory", cropAdvisorySchema);

export default CropAdvisory;
