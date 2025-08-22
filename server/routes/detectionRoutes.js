// server/routes/detectionRoutes.js
import express from "express";
import multer from "multer";
import fs from "fs";
import { detectPestDisease } from "../controllers/detectionController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Ensure uploads folder exists
if (!fs.existsSync("uploads")) {
    fs.mkdirSync("uploads");
}

// Configure multer for image uploads
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => cb(null, "uploads/"),
//     filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
// });

// // Accept only images
// const upload = multer({
//     storage,
//     fileFilter: (req, file, cb) => {
//         if (file.mimetype.startsWith("image/")) cb(null, true);
//         else cb(new Error("Only images are allowed"), false);
//     },
// });

// Use memory storage
const storage = multer.memoryStorage();

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image/")) cb(null, true);
        else cb(new Error("Only images are allowed"), false);
    },
});

// POST /api/detection -> Upload image & detect disease
// router.post("/", protect, upload.single("image"), async (req, res, next) => {
//     try {
//         if (!req.file)
//             return res.status(400).json({ message: "Image file is required" });

//         await detectPestDisease(req, res);
//     } catch (err) {
//         next(err);
//     }
// });


router.post("/", protect, upload.single("image"), async (req, res, next) => {
    try {
        if (!req.file)
            return res.status(400).json({ message: "Image file is required" });

        await detectPestDisease(req.file.buffer, res, req.user._id);
    } catch (err) {
        next(err);
    }
});


export default router;
