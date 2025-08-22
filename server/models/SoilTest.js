import mongoose from "mongoose";

const soilTestSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    crop: { type: String, required: true },
    pH: { type: Number, required: true },
    nitrogen: { type: Number, required: true },   // in mg/kg
    phosphorus: { type: Number, required: true }, // in mg/kg
    potassium: { type: Number, required: true },  // in mg/kg
    moisture: { type: Number, required: true },   // percentage
    recommendations: { type: String },           // auto-generated later
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("SoilTest", soilTestSchema);
