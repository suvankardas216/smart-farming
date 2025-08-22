import mongoose from "mongoose"

const labSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        city: { type: String, required: true },
        address: { type: String, required: true },
        type: {
            type: String,
            enum: ["soil", "water"], // Only soil/water labs
            required: true,
        },
        location: {
            lat: Number,
            lng: Number,
        },
        rating: Number, // optional from Google Places
    },
    { timestamps: true }
)

export default mongoose.model("Lab", labSchema)
