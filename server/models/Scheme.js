import mongoose from "mongoose";

const schemeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    link: { type: String, required: true },
    category: { type: String, required: true },
}, { timestamps: true });

const Scheme = mongoose.model("Scheme", schemeSchema);

export default Scheme; 
