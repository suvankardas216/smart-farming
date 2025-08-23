import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import cropAdvisoryRoutes from "./routes/cropAdvisoryRoutes.js";
import weatherRoutes from "./routes/weatherRoutes.js";
import pestDiseaseRoutes from "./routes/pestDiseaseRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import detectionRoutes from "./routes/detectionRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import forumRoutes from "./routes/forumRoutes.js";
import resourceRoutes from "./routes/resourceRoutes.js";
import { apiLimiter, authLimiter } from "./middlewares/rateLimiter.js";
import { languageMiddleware } from "./middlewares/languageMiddleware.js";
import soilTestRoutes from "./routes/soilTestRoutes.js";
import schemeRoutes from "./routes/schemeRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import cropRoutes from "./routes/cropRoutes.js";
import labRoutes from "./routes/labRoutes.js";
import farmAnalyticsRoutes from "./routes/FarmAnalyticsRoutes.js";

import fs from "fs";
import path from "path";

connectDB();

const app = express();
const port=3000;

app.set("trust proxy", 1);

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));


app.use(languageMiddleware);

const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Serve /uploads as static
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Routes
app.use("/api", apiLimiter);

// app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/crop-advisory", cropAdvisoryRoutes);
app.use("/api/weather", weatherRoutes);
app.use("/api/pest-disease", pestDiseaseRoutes);
app.use("/api", uploadRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/detection", detectionRoutes);
app.use("/api/cart", cartRoutes);

// Forum routes
app.use("/api/forum", forumRoutes);

// Resource Library routes
app.use("/api/resources", resourceRoutes);

// Soil Health Monitoring routes
app.use("/api/soil-tests", soilTestRoutes);

// Loan & Subsidy Guidance routes
app.use("/api/schemes", schemeRoutes);

// Use the route
app.use("/api/crop", cropRoutes);

// Crop Advisory routes (Farmer & Admin)
app.use("/api/crop-advisory", cropAdvisoryRoutes);

// Lab Routes
app.use("/api/labs", labRoutes);

// Farm Analytics
app.use("/api/analytics", farmAnalyticsRoutes);

// Admin routes
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
    res.send(req.lang.welcome);
});


app.listen(port, () => console.log(`Server running on port ${port}`));
