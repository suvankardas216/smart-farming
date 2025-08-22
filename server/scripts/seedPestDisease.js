import mongoose from "mongoose";
import dotenv from "dotenv";
import PestDisease from "../models/PestDisease.js";
import pestDiseaseData from "../data/samplePestDisease.js";

dotenv.config();

const seedPestDisease = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        await PestDisease.deleteMany();
        await PestDisease.insertMany(pestDiseaseData);
        console.log("Sample Pest & Disease data inserted");
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedPestDisease();
