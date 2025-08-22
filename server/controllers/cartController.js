import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

// Get current user's cart
export const getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");
        res.json(cart || { items: [] });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

// Add product to cart
export const addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        const product = await Product.findById(productId);
        
        if (!product) return res.status(404).json({ message: "Product not found" });

        let cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            cart = new Cart({ user: req.user._id, items: [] });
        }

        const existingItem = cart.items.find(item => item.product.toString() === productId);
        if (existingItem) {
            existingItem.quantity += quantity || 1;
        } else {
            cart.items.push({ product: productId, quantity: quantity || 1 });
        }

        await cart.save();
        res.json(cart);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

// Remove product from cart
export const removeFromCart = async (req, res) => {
    try {
        const { productId } = req.body;
        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        cart.items = cart.items.filter(item => item.product.toString() !== productId);
        await cart.save();
        res.json(cart);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

// Update quantity of a product in cart
export const updateCartItem = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        const item = cart.items.find(i => i.product.toString() === productId);
        if (item) {
            item.quantity = quantity;
            await cart.save();
            res.json(cart);
        } else {
            res.status(404).json({ message: "Item not found in cart" });
        }
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

// Clear all items from cart
export const clearCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        cart.items = [];
        await cart.save();
        res.json({ message: "Cart cleared" });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};
