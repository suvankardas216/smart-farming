import Scheme from "../models/Scheme.js";

// GET all schemes with search, filter, pagination

export const getSchemes = async (req, res) => {
    try {
        let { search, category, page, limit } = req.query;

        page = parseInt(page) || 1;
        limit = parseInt(limit) || 10;
        const skip = (page - 1) * limit;

        const query = {};

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } }
            ];
        }

        if (category) {
            query.category = category;
        }

        const total = await Scheme.countDocuments(query);
        const schemes = await Scheme.find(query)
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        res.status(200).json({
            page,
            totalPages: Math.ceil(total / limit),
            totalResults: total,
            results: schemes
        });

    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};



// Add new scheme
export const addScheme = async (req, res) => {
    try {
        const { name, description, link, category } = req.body;

        if (!name || !description || !link || !category) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newScheme = new Scheme({ name, description, link, category });
        await newScheme.save();

        res.status(201).json(newScheme);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// Get single scheme by ID
export const getSchemeById = async (req, res) => {
    try {
        const scheme = await Scheme.findById(req.params.id);
        if (!scheme) {
            return res.status(404).json({ message: "Scheme not found" });
        }
        res.status(200).json(scheme);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// Update a scheme
export const updateScheme = async (req, res) => {
    try {
        const { name, description, link } = req.body;
        const scheme = await Scheme.findByIdAndUpdate(
            req.params.id,
            { name, description, link },
            { new: true, runValidators: true }
        );

        if (!scheme) return res.status(404).json({ message: "Scheme not found" });

        res.status(200).json(scheme);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// Delete a scheme
export const deleteScheme = async (req, res) => {
    try {
        const scheme = await Scheme.findByIdAndDelete(req.params.id);
        if (!scheme) return res.status(404).json({ message: "Scheme not found" });
        res.status(200).json({ message: "Scheme deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

export const getCategories = async (req, res) => {
    try {
        const categories = await Scheme.distinct("category");
        res.json(categories);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch categories" });
    }
};