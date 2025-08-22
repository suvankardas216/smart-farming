import mongoose from "mongoose";

const detectionSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        image: { type: String, required: true },
        diagnosis: { type: String, default: "Pending" },
        advice: { type: String, default: "" },
    },
    { timestamps: true }
);

export default mongoose.model("Detection", detectionSchema);
