import Resource from "../models/Resource.js";

// Create a resource
export const createResource = async (req, res) => {
    try {
        const { title, description, type, contentUrl, tags } = req.body;
        const resource = await Resource.create({
            title,
            description,
            type,
            contentUrl,
            tags,
            uploadedBy: req.user._id,
        });
        res.status(201).json(resource);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get all resources with optional filters
export const getAllResources = async (req, res) => {
    try {
        const { type, tag } = req.query;
        let filter = {};
        if (type) filter.type = type;
        if (tag) filter.tags = tag;

        const resources = await Resource.find(filter)
            .populate("uploadedBy", "name role")
            .sort({ createdAt: -1 });
        res.json(resources);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update a resource (admin only)
export const updateResource = async (req, res) => {
    try {
        const resource = await Resource.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!resource) return res.status(404).json({ message: "Resource not found" });
        res.json(resource);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Delete a resource (admin only)
export const deleteResource = async (req, res) => {
    try {
        const resource = await Resource.findByIdAndDelete(req.params.id);
        if (!resource) return res.status(404).json({ message: "Resource not found" });
        res.json({ message: "Resource deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// In getResource
export const getResource = async (req, res) => {
    try {
        const resource = await Resource.findById(req.params.id).populate("uploadedBy", "name role");
        if (!resource) return res.status(404).json({ message: req.lang.resource_not_found });
        res.json(resource);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
