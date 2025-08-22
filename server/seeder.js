import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import Scheme from "./models/Scheme.js";

dotenv.config();

const seedSchemes = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        // Clear existing data
        await Scheme.deleteMany();

        // Read JSON file
        const filePath = path.join(process.cwd(), "data", "schemes.json");
        const data = fs.readFileSync(filePath, "utf-8");
        const schemesData = JSON.parse(data);

        // Insert dataset
        await Scheme.insertMany(schemesData);

        console.log("Database seeded successfully!");
        process.exit();
    } catch (error) {
        console.error("Error seeding database:", error);
        process.exit(1);
    }
};

seedSchemes();
