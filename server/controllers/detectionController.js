import axios from "axios";
// import fs from "fs";
import FormData from "form-data";
import fetch from "node-fetch";
import Detection from "../models/Detection.js";

/**
 * Clean Qwen advice (remove ** and extra \n)
 */
function cleanAdvice(rawAdvice) {
    return rawAdvice
        .replace(/##/g, "")        // remove heading markdown
        .replace(/\*\*/g, "")      // remove bold markdown
        .replace(/\\n/g, "\n")     // convert escaped newlines
        .split("\n")
        .map(line => line.trim())
        .filter(line => line !== "")
        .join("\n");
}


/**
 * Generate advice using Qwen chat model via Hugging Face API
 */
async function generateAdvice(diagnosis) {
    try {
        const payload = {
            model: "Qwen/Qwen3-Coder-30B-A3B-Instruct:fireworks-ai",
            messages: [
                {
                    role: "user",
                    content: `A farmer has a crop with the following issue: ${diagnosis}.
Format the advice as a systematic, numbered list or structured paragraphs.`,
                },
            ],
        };

        const response = await fetch(
            "https://router.huggingface.co/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${process.env.HF_TOKEN}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            }
        );

        if (!response.ok) {
            const text = await response.text();
            throw new Error(`HF API error: ${response.status} ${text}`);
        }

        const data = await response.json();
        const rawAdvice = data.choices[0]?.message?.content ||
            "Follow standard crop treatment procedures.";

        return cleanAdvice(rawAdvice);

    } catch (err) {
        console.error("Advice generation failed:", err.message);
        return "Follow standard crop treatment procedures.";
    }
}

/**
 * Detect pest/disease using Kindwise and generate advice
 */
// export const detectPestDisease = async (req, res) => {
//     try {
//         if (!req.file)
//             return res.status(400).json({ message: "Image file is required" });

//         const imagePath = `/uploads/${req.file.filename}`;
//         const formData = new FormData();
//         formData.append("images[]", fs.createReadStream(req.file.path));

//         // Kindwise API detection
//         const kindwiseRes = await axios.post(
//             process.env.CROP_HEALTH_ENDPOINT,
//             formData,
//             {
//                 headers: {
//                     "api-key": process.env.CROP_HEALTH_API_KEY,
//                     ...formData.getHeaders(),
//                 },
//                 maxContentLength: Infinity,
//                 maxBodyLength: Infinity,
//             }
//         );

//         fs.unlinkSync(req.file.path); // clean uploaded file

//         const kindwiseData = kindwiseRes.data;

//         // Parse top crop
//         const topCrop = kindwiseData.result.crop.suggestions[0];
//         const cropName = topCrop?.name || "Unknown crop";

//         // Parse top disease
//         const topDisease = kindwiseData.result.disease.suggestions[0];
//         const diseaseName = topDisease?.name || "Healthy";

//         // Generate advice using Qwen AI
//         const advice = await generateAdvice(`${cropName}: ${diseaseName}`);

//         // Save detection to DB
//         const detection = await Detection.create({
//             user: req.user._id,
//             image: imagePath,
//             diagnosis: `${cropName}: ${diseaseName}`,
//             advice,
//         });

//         res.status(200).json({ message: "Detection complete", detection });

//     } catch (err) {
//         console.error("Detection failed:", err);
//         if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
//         res.status(500).json({ message: "Detection failed", error: err.message });
//     }
// };


export const detectPestDisease = async (fileBuffer, res, userId) => {
    try {
        if (!fileBuffer) {
            return res.status(400).json({ message: "Image file is required" });
        }

        const formData = new FormData();
        formData.append("images[]", fileBuffer, {
            filename: "upload.jpg", // required for some APIs
            contentType: "image/jpeg",
        });

        // Kindwise API detection
        const kindwiseRes = await axios.post(
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

        const kindwiseData = kindwiseRes.data;

        // Parse top crop & disease
        const topCrop = kindwiseData.result.crop.suggestions[0];
        const cropName = topCrop?.name || "Unknown crop";

        const topDisease = kindwiseData.result.disease.suggestions[0];
        const diseaseName = topDisease?.name || "Healthy";

        // Generate advice
        const advice = await generateAdvice(`${cropName}: ${diseaseName}`);

        // Save detection to DB
        const detection = await Detection.create({
            user: userId,
            image: "memory_upload", // or a URL if you store in cloud storage
            diagnosis: `${cropName}: ${diseaseName}`,
            advice,
        });

        res.status(200).json({ message: "Detection complete", detection });

    } catch (err) {
        console.error("Detection failed:", err);
        res.status(500).json({ message: "Detection failed", error: err.message });
    }
};