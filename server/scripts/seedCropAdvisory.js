import mongoose from "mongoose";
import dotenv from "dotenv";
import CropAdvisory from "../models/CropAdvisory.js";
import cropAdvisoryData from "../data/sampleCropAdvisory.js";

dotenv.config();

const seedCropAdvisory = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected");

        // Clear existing data
        await CropAdvisory.deleteMany();

        // Insert sample data
        await CropAdvisory.insertMany(cropAdvisoryData);
        console.log("Sample crop advisory data inserted");

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedCropAdvisory();
