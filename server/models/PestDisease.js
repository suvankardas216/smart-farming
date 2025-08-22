import mongoose from "mongoose";

const pestDiseaseSchema = mongoose.Schema(
    {
        cropType: { type: String, required: true },
        name: { type: String, required: true },
        symptoms: { type: String, required: true },
        treatment: { type: String, required: true },
        prevention: { type: String, required: true },
    },
    { timestamps: true }
);

export default mongoose.model("PestDisease", pestDiseaseSchema);
