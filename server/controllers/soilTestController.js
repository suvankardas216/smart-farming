import SoilTest from "../models/SoilTest.js";

// Add new soil test
export const addSoilTest = async (req, res) => {
    try {
        const { crop, pH, nitrogen, phosphorus, potassium, moisture } = req.body;

        let recommendations = "";

        // pH advice
        if (pH < 5.5) recommendations += "Soil is strongly acidic, consider applying lime + organic compost. ";
        else if (pH < 6.5) recommendations += "Soil is slightly acidic, apply lime moderately. ";
        else if (pH > 7.5 && pH <= 8.0) recommendations += "Soil is moderately alkaline, consider sulfur or gypsum treatment. ";
        else if (pH > 8.0) recommendations += "Soil is strongly alkaline, apply sulfur and organic matter to reduce alkalinity. ";
        else recommendations += "pH is optimal. ";

        // Nitrogen advice
        if (nitrogen < 20) recommendations += "Nitrogen is very low, apply high-dose nitrogen fertilizer. ";
        else if (nitrogen < 50) recommendations += "Nitrogen is low, apply moderate nitrogen fertilizer. ";
        else if (nitrogen > 150) recommendations += "Nitrogen is high, avoid further nitrogen fertilization. ";
        else recommendations += "Nitrogen level is good. ";

        // Phosphorus advice
        if (phosphorus < 10) recommendations += "Phosphorus is very low, apply phosphate-rich fertilizer. ";
        else if (phosphorus < 20) recommendations += "Phosphorus is low, consider applying P fertilizer. ";
        else recommendations += "Phosphorus level is adequate. ";

        // Potassium advice
        if (potassium < 50) recommendations += "Potassium is very low, apply potassium fertilizer. ";
        else if (potassium < 100) recommendations += "Potassium is low, consider potassium supplementation. ";
        else recommendations += "Potassium level is sufficient. ";

        // Moisture advice
        if (moisture < 20) recommendations += "Soil is dry, consider irrigation. ";
        else if (moisture > 80) recommendations += "Soil is too wet, improve drainage. ";
        else recommendations += "Soil moisture is optimal. ";


        const soilTest = await SoilTest.create({
            user: req.user._id,
            crop,
            pH,
            nitrogen,
            phosphorus,
            potassium,
            moisture,
            recommendations,
        });

        res.status(201).json({ message: "Soil test added", soilTest });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

// Get all soil tests of logged-in user
export const getMySoilTests = async (req, res) => {
    try {
        const tests = await SoilTest.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(tests);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

// Get single soil test by ID
export const getSoilTestById = async (req, res) => {
    try {
        const test = await SoilTest.findById(req.params.id);
        if (!test) return res.status(404).json({ message: "Soil test not found" });
        res.json(test);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};
