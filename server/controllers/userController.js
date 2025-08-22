import User from "../models/User.js";
import bcrypt from "bcryptjs";


// GET /user/profile
export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user); // return user object directly
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};


export const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update only provided basic info
        if (req.body.name) user.name = req.body.name;
        if (req.body.email) user.email = req.body.email;
        if (req.body.language) user.language = req.body.language;
        if (req.body.location) user.location = req.body.location;

        // Update farmDetails only if provided
        if (req.body.farmDetails) {
            user.farmDetails = {
                cropTypes: req.body.farmDetails.cropTypes ?? user.farmDetails?.cropTypes ?? [],
                soilType: req.body.farmDetails.soilType ?? user.farmDetails?.soilType ?? ""
            };
        }

        // Update password if both currentPassword & newPassword are provided
        if (req.body.currentPassword && req.body.newPassword) {
            const isMatch = await bcrypt.compare(req.body.currentPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: "Current password is incorrect" });
            }
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(req.body.newPassword, salt);
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role, // never editable
            language: updatedUser.language,
            location: updatedUser.location,
            farmDetails: updatedUser.farmDetails,
            message: "Profile updated successfully",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// @access  Private/Admin
export const getAllUsers = async (req, res) => {
    const users = await User.find({});
    res.json(users);
};

// @access  Private/Admin
export const deleteUser = async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        await user.deleteOne();
        res.json({ message: "User removed" });
    } else {
        res.status(404).json({ message: "User not found" });
    }
};

// @access  Private/Admin
export const updateUserRole = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update allowed fields
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;

        // Update role only if provided
        if (req.body.role) {
            user.role = req.body.role; // e.g., "farmer", "admin", "expert"
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};