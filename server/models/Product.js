import mongoose from "mongoose";

// Review sub-schema
const reviewSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now },
});

const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        description: { type: String, default: "" },
        price: { type: Number, required: true },
        image: { type: String, required: true },
        stockQuantity: { type: Number, required: true, default: 0 },
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        ratings: [reviewSchema],
        averageRating: { type: Number, default: 0 },
    },
    { timestamps: true }
);

// helpful index query “my products”
productSchema.index({ createdBy: 1, createdAt: -1 });

export default mongoose.model("Product", productSchema);
