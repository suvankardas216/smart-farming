import express from "express";
import upload from "../config/upload.js";

const router = express.Router();

router.post("/upload", upload.single("image"), (req, res) => {
    res.json({
        message: "File uploaded successfully",
        filePath: `/uploads/${req.file.filename}`
    });
});

export default router;
