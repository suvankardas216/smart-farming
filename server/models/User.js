import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["farmer", "admin", "expert"], default: "farmer" },
    location: { type: String, },
    language: { type: String, default: "en" },
    farmDetails: {
        cropTypes: [String],
        soilType: String
    },
    isBanned: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model("User", userSchema);
