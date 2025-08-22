import PestDisease from "../models/PestDisease.js";
import path from "path";

// GET all diseases for a crop
export const getDiseasesByCrop = async (req, res) => {
    const { cropType } = req.query;

    if (!cropType) return res.status(400).json({ message: "cropType is required" });

    try {
        const diseases = await PestDisease.find({ cropType });
        if (diseases.length === 0) {
            return res.status(404).json({ message: "No diseases found for this crop" });
        }
        res.status(200).json(diseases);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch diseases", error: err.message });
    }
};


export const detectDiseaseFromImage = async (req, res) => {
    if (!req.file) return res.status(400).json({ message: "No image uploaded" });

    // Mock detection logic
    const detectedDisease = {
        cropType: "Wheat",
        name: "Rust",
        symptoms: "Orange-brown pustules on leaves",
        treatment: "Apply fungicides like propiconazole",
        prevention: "Use resistant varieties and crop rotation",
        imagePath: req.file.path
    };

    res.status(200).json({
        message: "Disease detected successfully",
        detectedDisease,
    });
};


export const uploadPestDiseaseImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        // Get file URL 
        const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

        // Mock detection logic
        const mockDetection = {
            disease: "Leaf Blight",
            severity: "Moderate",
            recommendation: "Use organic fungicide and ensure proper drainage."
        };

        res.status(200).json({
            message: "Image uploaded successfully",
            imageUrl: fileUrl,
            detection: mockDetection
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

