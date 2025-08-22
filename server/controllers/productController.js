import Product from "../models/Product.js";
// CREATE - Add new product
export const createProduct = async (req, res) => {
    try {
        const { name, description, price, stockQuantity } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: "Image is required" });
        }

        const product = new Product({
            name,
            description,
            price,
            stockQuantity: stockQuantity || 0,
            image: req.file.path,
            createdBy: req.user._id,
        });

        await product.save();

        res.status(201).json({
            message: "Product created successfully",
            product
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}

// READ (mine)
export const getMyProducts = async (req, res) => {
    try {
        const products = await Product.find({ createdBy: req.user._id }).sort({ createdAt: -1 });
        res.json(products);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

// GET all products
export const getProducts = async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 }).populate("createdBy", "name email role"); // newest first
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: "Error fetching products", error: error.message });
    }
};

//Update product
export const updateProduct = async (req, res) => {
    try {
        const { name, description, price, stockQuantity } = req.body;

        const updatedData = { name, description, price };

        if (stockQuantity !== undefined) updatedData.stockQuantity = stockQuantity;

        if (req.file) {
            updatedData.image = req.file.path;
        }

        const product = await Product.findByIdAndUpdate(req.params.id, updatedData, { new: true });

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json({ message: "Product updated successfully", product });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

//Delete product
export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json({ message: "Product deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

// Add a review to a product
export const addReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;

        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });

        // Check if user already reviewed
        const alreadyReviewed = product.ratings.find(r => r.user.toString() === req.user._id.toString());
        if (alreadyReviewed) {
            return res.status(400).json({ message: "You have already reviewed this product" });
        }

        const review = {
            user: req.user._id,
            rating,
            comment: comment || "",
            createdAt: new Date()
        };

        product.ratings.push(review);

        // Update average rating
        product.averageRating = product.ratings.reduce((acc, r) => acc + r.rating, 0) / product.ratings.length;

        await product.save();

        res.status(201).json({ message: "Review added", product });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

// Get all reviews of a product
export const getReviews = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate("ratings.user", "name email");
        if (!product) return res.status(404).json({ message: "Product not found" });

        res.json(product.ratings);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

// Get single product by ID
export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate("createdBy", "name email role");
        if (!product) return res.status(404).json({ message: "Product not found" });
        res.status(200).json(product);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};
