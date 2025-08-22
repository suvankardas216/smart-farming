import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    type: { type: String, enum: ["article", "guide", "video"], required: true },
    contentUrl: { type: String }, // URL for video or external content
    tags: [String],
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Resource", resourceSchema);
