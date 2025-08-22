import Order from "../models/orderModel.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Place a new order (COD or Stripe)
export const placeOrder = async (req, res) => {
    try {
        const { items, paymentMethod } = req.body; // paymentMethod = 'cod' or 'card'

        if (!items || items.length === 0)
            return res.status(400).json({ message: "No items in order" });

        let totalPrice = 0;
        const orderItems = [];

        // Validate products and calculate total
        for (let item of items) {
            const product = await Product.findById(item.product);
            if (!product)
                return res.status(404).json({ message: `Product not found: ${item.product}` });

            if (product.stockQuantity < item.quantity) {
                return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
            }

            totalPrice += product.price * item.quantity;

            orderItems.push({
                product: product._id,
                quantity: item.quantity,
                price: product.price,
            });
        }

        // Decrement stock
        for (let item of items) {
            await Product.findByIdAndUpdate(item.product, { $inc: { stockQuantity: -item.quantity } });
        }

        // Create order
        const order = await Order.create({
            user: req.user._id,
            items: orderItems,
            totalPrice,
            paymentMethod,
            paymentStatus: paymentMethod === "cod" ? "pending" : "paid", // COD = pending, card = paid
            deliveryStatus: "pending",
        });

        // Clear user's cart
        await User.findByIdAndUpdate(req.user._id, { cart: [] });

        res.status(201).json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

// Get logged-in user's orders
export const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .populate("items.product", "name price stockQuantity")
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

// Get all orders (admin only)
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("user", "name email")
            .populate("items.product", "name price stockQuantity")
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

// Update order status (admin only)
export const updateOrderStatus = async (req, res) => {
    try {
        const { deliveryStatus, paymentStatus } = req.body;
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: "Order not found" });

        if (deliveryStatus) order.deliveryStatus = deliveryStatus;
        if (paymentStatus) order.paymentStatus = paymentStatus;

        await order.save();
        res.json({ message: "Order updated", order });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

// Cancel order
export const cancelOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: "Order not found" });

        if (req.user.role !== "admin" && order.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized to cancel this order" });
        }

        if (order.deliveryStatus === "delivered") {
            return res.status(400).json({ message: "Cannot cancel a delivered order" });
        }

        for (let item of order.items) {
            await Product.findByIdAndUpdate(item.product, { $inc: { stockQuantity: item.quantity } });
        }

        order.deliveryStatus = "cancelled";
        order.paymentStatus = "failed";
        await order.save();

        res.json({ message: "Order cancelled and stock restored", order });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

// Create Stripe payment intent
export const createPaymentIntent = async (req, res) => {
    try {
        const { items } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: "No items to purchase" });
        }

        let totalPrice = 0;

        for (let item of items) {
            const product = await Product.findById(item.product);
            if (!product) return res.status(404).json({ message: `Product not found: ${item.product}` });
            if (product.stockQuantity < item.quantity) {
                return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
            }
            totalPrice += product.price * item.quantity;
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(totalPrice * 100),
            currency: "usd",
            metadata: { integration_check: "accept_a_payment" },
        });

        res.status(200).json({ clientSecret: paymentIntent.client_secret, totalPrice });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};
