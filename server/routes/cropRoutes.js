import express from "express";
import multer from "multer";
import axios from "axios";
import FormData from "form-data";
import fs from "fs";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// POST /api/crop/health
router.post("/health", upload.single("image"), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No image uploaded" });
    }

    try {
        const formData = new FormData();
        formData.append("images[]", fs.createReadStream(req.file.path));
        

        const response = await axios.post(
            process.env.CROP_HEALTH_ENDPOINT,
            formData,
            {
                headers: {
                    "api-key": process.env.CROP_HEALTH_API_KEY,
                    ...formData.getHeaders(),
                },
                maxContentLength: Infinity,
                maxBodyLength: Infinity,
            }
        );


        // Clean up uploaded file
        fs.unlinkSync(req.file.path);

        // Send the full Kindwise response
        res.json(response.data);
    } catch (error) {
        if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);

        console.error("Crop health API error:", error.response?.data || error.message);
        res.status(500).json({
            error: "Failed to analyze crop health",
            details: error.response?.data || error.message,
        });
    }
});

export default router;
