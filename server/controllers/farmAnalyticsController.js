import FarmAnalytics from "../models/FarmAnalyticsModel.js"

export const addFarmAnalytics = async (req, res) => {
    try {
        const { cropName, season, date, area, areaUnit, yieldAmount, yieldUnit, pricePerUnit, expenses, notes } = req.body

        if (
            !cropName ||
            !season ||
            !date ||
            !area ||
            !areaUnit ||
            !yieldAmount ||
            !yieldUnit ||
            !pricePerUnit ||
            !expenses
        ) {
            return res.status(400).json({ message: "All required fields must be filled" })
        }

        if (
            !expenses.seeds ||
            !expenses.fertilizers ||
            !expenses.pesticides ||
            !expenses.irrigation ||
            !expenses.labor ||
            !expenses.others
        ) {
            return res.status(400).json({ message: "All expense categories must be provided" })
        }

        const entry = new FarmAnalytics({
            user: req.user._id,
            cropName,
            season,
            date,
            area,
            areaUnit,
            yieldAmount,
            yieldUnit,
            pricePerUnit,
            expenses,
            notes,
        })

        const savedEntry = await entry.save()
        res.status(201).json(savedEntry)
    } catch (error) {
        res.status(500).json({ message: "Error adding farm analytics", error: error.message })
    }
}

export const getFarmAnalytics = async (req, res) => {
    try {
        const entries = await FarmAnalytics.find({ user: req.user._id }).sort({ createdAt: -1 })
        res.json(entries)
    } catch (error) {
        res.status(500).json({ message: "Error fetching analytics", error: error.message })
    }
}

export const updateFarmAnalytics = async (req, res) => {
    try {
        const entry = await FarmAnalytics.findOne({ _id: req.params.id, user: req.user._id })

        if (!entry) {
            return res.status(404).json({ message: "Entry not found" })
        }

        Object.assign(entry, req.body)

        const updatedEntry = await entry.save()
        res.json(updatedEntry)
    } catch (error) {
        res.status(500).json({ message: "Error updating entry", error: error.message })
    }
}

export const deleteFarmAnalytics = async (req, res) => {
    try {
        const entry = await FarmAnalytics.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id,
        })

        if (!entry) {
            return res.status(404).json({ message: "Entry not found" })
        }

        res.json({ message: "Entry deleted successfully" })
    } catch (error) {
        res.status(500).json({ message: "Error deleting entry", error: error.message })
    }
}
