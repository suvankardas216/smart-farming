// Generic owner-or-admin guard
export const ownerOrAdmin = ({ model, ownerField = "createdBy", idParam = "id" }) => {
    return async (req, res, next) => {
        try {
            // admin shortcut
            if (req.user?.role === "admin") return next();

            const docId = req.params[idParam];
            const doc = await model.findById(docId).select(`${ownerField}`);

            if (!doc) return res.status(404).json({ message: "Resource not found" });

            if (doc[ownerField]?.toString() === req.user?._id?.toString()) {
                return next();
            }
            return res.status(403).json({ message: "Not authorized (owner/admin only)" });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: "Server error" });
        }
    };
};
