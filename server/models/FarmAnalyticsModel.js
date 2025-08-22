import mongoose from "mongoose"

const farmAnalyticsSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        cropName: { type: String, required: true },
        season: { type: String, required: true },
        date: { type: Date, required: true },

        area: { type: Number, default: 0 },
        areaUnit: { type: String, enum: ["acre", "hectare"], default: "acre" },

        yieldAmount: { type: Number, required: true },
        yieldUnit: { type: String, enum: ["kg", "tonnes"], default: "kg" },

        pricePerUnit: { type: Number, required: true },

        expenses: {
            seeds: { type: Number, default: 0 },
            fertilizers: { type: Number, default: 0 },
            pesticides: { type: Number, default: 0 },
            irrigation: { type: Number, default: 0 },
            labor: { type: Number, default: 0 },
            others: { type: Number, default: 0 },
        },

        revenue: { type: Number },
        totalExpenses: { type: Number },
        profitMargin: { type: Number },
        netProfit: { type: Number },

        notes: { type: String },
    },
    { timestamps: true },
)

farmAnalyticsSchema.pre("save", function (next) {
    // Convert yield to kg if in tonnes
    const yieldInKg = this.yieldUnit === "tonnes" ? this.yieldAmount * 1000 : this.yieldAmount

    // Calculate revenue (yield in kg * price per kg)
    this.revenue = yieldInKg * this.pricePerUnit

    // Calculate total expenses
    this.totalExpenses =
        (this.expenses?.seeds || 0) +
        (this.expenses?.fertilizers || 0) +
        (this.expenses?.pesticides || 0) +
        (this.expenses?.irrigation || 0) +
        (this.expenses?.labor || 0) +
        (this.expenses?.others || 0)

    // Calculate net profit
    this.netProfit = this.revenue - this.totalExpenses

    // Calculate profit margin percentage
    if (this.revenue && this.revenue > 0) {
        this.profitMargin = (this.netProfit / this.revenue) * 100
    } else {
        this.profitMargin = 0
    }

    next()
})

const FarmAnalytics = mongoose.model("FarmAnalytics", farmAnalyticsSchema)

export default FarmAnalytics
