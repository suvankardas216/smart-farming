"use client"

import { useState, useEffect } from "react"
import axiosInstance from "../utils/axiosInstance"

const Profile = () => {
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState(null)
    const [editing, setEditing] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        location: "",
        cropTypes: [],
        soilType: "",
        language: "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    })

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await axiosInstance.get("/user/profile")
                setUser(response.data.user)
                setFormData({
                    name: response.data.name,
                    email: response.data.email,
                    location: response.data.location || "",
                    cropTypes: response.data.farmDetails?.cropTypes || [],
                    soilType: response.data.farmDetails?.soilType || "",
                    language: response.data.language || "English",
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                })
            } catch (error) {
                console.error("Error fetching user profile:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchUserProfile()
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }))
    }

    const handleCropTypesChange = (e) => {
        const cropTypes = e.target.value.split(",").map((crop) => crop.trim())
        setFormData((prevState) => ({
            ...prevState,
            cropTypes,
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await axiosInstance.put("/user/profile", formData)
            setUser(response.data)
            setEditing(false)
        } catch (error) {
            console.error("Error updating user profile:", error)
        }
    }

    if (loading)
        return (
            <div className="h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center p-4">
                <div className="bg-white/90 backdrop-blur-lg rounded-3xl p-12 shadow-2xl border border-white/30 max-w-md w-full">
                    <div className="flex flex-col items-center space-y-6">
                        <div className="relative">
                            <div className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-200"></div>
                            <div className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-600 border-t-transparent absolute top-0 left-0"></div>
                        </div>
                        <div className="text-center">
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">Loading Profile</h3>
                            <p className="text-gray-600 animate-pulse">Fetching your information...</p>
                        </div>
                    </div>
                </div>
            </div>
        )

    if (!user)
        return (
            <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center p-4">
                <div className="bg-white/90 backdrop-blur-lg rounded-3xl p-12 shadow-2xl border border-white/30 text-center max-w-md w-full">
                    <div className="w-20 h-20 bg-gradient-to-r from-red-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="text-4xl">⚠️</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-3">Profile Not Found</h2>
                    <p className="text-gray-600 leading-relaxed">
                        We couldn't load your profile information. Please try refreshing the page.
                    </p>
                </div>
            </div>
        )

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 mt-15 py-12 px-4">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-12">
                    <div className="inline-block p-4 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl mb-6 shadow-lg">
                        <span className="text-4xl">👤</span>
                    </div>
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 leading-relaxed bg-clip-text text-transparent mb-4">
                        My Profile
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        Manage your account information, farm details, and preferences all in one place
                    </p>
                </div>

                {!editing ? (
                    /* Enhanced view mode with better cards and animations */
                    <div className="space-y-8">
                        <div className="group bg-white/90 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/30 hover:shadow-3xl transition-all duration-300 hover:scale-[1.02]">
                            <div className="flex items-center mb-6">
                                <div className="w-14 h-14 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mr-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                                    <span className="text-white text-2xl">👤</span>
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-800">Personal Information</h3>
                                    <p className="text-gray-500">Your basic account details</p>
                                </div>
                            </div>
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100">
                                        <label className="text-sm font-semibold text-emerald-600 uppercase tracking-wider mb-2 block">
                                            Full Name
                                        </label>
                                        <p className="text-xl font-bold text-gray-800">{user.name}</p>
                                    </div>
                                    <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl border border-blue-100">
                                        <label className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-2 block">
                                            Email Address
                                        </label>
                                        <p className="text-xl font-bold text-gray-800 break-all">{user.email}</p>
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-100">
                                        <label className="text-sm font-semibold text-purple-600 uppercase tracking-wider mb-2 block">
                                            Account Role
                                        </label>
                                        <span className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl text-lg font-bold capitalize shadow-lg">
                                            <span className="mr-2">{user.role === "farmer" ? "🌾" : "🛒"}</span>
                                            {user.role}
                                        </span>
                                    </div>
                                    <div className="p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl border border-orange-100">
                                        <label className="text-sm font-semibold text-orange-600 uppercase tracking-wider mb-2 block">
                                            Location
                                        </label>
                                        <p className="text-xl font-bold text-gray-800">{user.location || "Not specified"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="group bg-white/90 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/30 hover:shadow-3xl transition-all duration-300 hover:scale-[1.02]">
                            <div className="flex items-center mb-6">
                                <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mr-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                                    <span className="text-white text-2xl">🌱</span>
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-800">Farm Details</h3>
                                    <p className="text-gray-500">Information about your farming operations</p>
                                </div>
                            </div>
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-100">
                                    <label className="text-sm font-semibold text-green-600 uppercase tracking-wider mb-4 block">
                                        Crop Types
                                    </label>
                                    <div className="flex flex-wrap gap-3">
                                        {user.farmDetails?.cropTypes?.length > 0 ? (
                                            user.farmDetails.cropTypes.map((crop, index) => (
                                                <span
                                                    key={index}
                                                    className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl text-sm font-bold shadow-lg hover:scale-105 transition-transform duration-200"
                                                >
                                                    🌾 {crop}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-gray-500 italic text-lg">No crops specified</span>
                                        )}
                                    </div>
                                </div>
                                <div className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-100">
                                    <label className="text-sm font-semibold text-amber-600 uppercase tracking-wider mb-4 block">
                                        Soil Type
                                    </label>
                                    <div className="flex items-center">
                                        <span className="text-2xl mr-3">🌍</span>
                                        <p className="text-xl font-bold text-gray-800">{user.farmDetails?.soilType || "Not specified"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="group bg-white/90 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/30 hover:shadow-3xl transition-all duration-300 hover:scale-[1.02]">
                            <div className="flex items-center mb-6">
                                <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mr-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                                    <span className="text-white text-2xl">⚙️</span>
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-800">Preferences</h3>
                                    <p className="text-gray-500">Your account settings and preferences</p>
                                </div>
                            </div>
                            <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border border-blue-100">
                                <label className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-4 block">
                                    Preferred Language
                                </label>
                                <div className="flex items-center">
                                    <span className="text-2xl mr-3">🌐</span>
                                    <p className="text-xl font-bold text-gray-800 capitalize">{user.language || "English"}</p>
                                </div>
                            </div>
                        </div>

                        <div className="text-center pt-8">
                            <button
                                className="group px-12 py-6 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white font-bold text-xl rounded-3xl shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 flex items-center mx-auto space-x-4 border-2 border-white/20"
                                onClick={() => setEditing(true)}
                            >
                                <span className="text-2xl group-hover:rotate-12 transition-transform duration-300">✏️</span>
                                <span>Update Profile</span>
                                <span className="text-2xl group-hover:translate-x-1 transition-transform duration-300">→</span>
                            </button>
                        </div>
                    </div>
                ) : (
                    /* Enhanced edit form with floating labels and better styling */
                    <div className="bg-white/90 backdrop-blur-lg rounded-3xl p-10 shadow-2xl border border-white/30">
                        <div className="flex items-center mb-8 pb-6 border-b border-gray-200">
                            <div className="w-14 h-14 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                                <span className="text-white text-2xl">✏️</span>
                            </div>
                            <div>
                                <h3 className="text-3xl font-bold text-gray-800">Edit Profile</h3>
                                <p className="text-gray-600">Update your information and preferences</p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-10">
                            <div className="p-6 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100">
                                <h4 className="text-xl font-bold text-gray-700 mb-6 flex items-center">
                                    <span className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center mr-3">
                                        <span className="text-white text-sm">👤</span>
                                    </span>
                                    Personal Information
                                </h4>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="Enter your full name"
                                            className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-emerald-200 focus:border-emerald-500 transition-all bg-white/80 backdrop-blur-sm text-lg font-medium placeholder-gray-400"
                                        />
                                        <label className="absolute -top-3 left-4 bg-white px-2 text-sm font-semibold text-emerald-600">
                                            Name
                                        </label>
                                    </div>
                                    <div className="relative">
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="Enter your email"
                                            className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-emerald-200 focus:border-emerald-500 transition-all bg-white/80 backdrop-blur-sm text-lg font-medium placeholder-gray-400"
                                        />
                                        <label className="absolute -top-3 left-4 bg-white px-2 text-sm font-semibold text-emerald-600">
                                            Email
                                        </label>
                                    </div>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            name="role"
                                            value={user.role}
                                            readOnly
                                            className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl bg-gray-100 cursor-not-allowed capitalize text-lg font-medium"
                                        />
                                        <label className="absolute -top-3 left-4 bg-white px-2 text-sm font-semibold text-gray-500">
                                            Role (Read-only)
                                        </label>
                                    </div>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            name="location"
                                            value={formData.location}
                                            onChange={handleChange}
                                            placeholder="Enter your location"
                                            className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-emerald-200 focus:border-emerald-500 transition-all bg-white/80 backdrop-blur-sm text-lg font-medium placeholder-gray-400"
                                        />
                                        <label className="absolute -top-3 left-4 bg-white px-2 text-sm font-semibold text-emerald-600">
                                            Location
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-100">
                                <h4 className="text-xl font-bold text-gray-700 mb-6 flex items-center">
                                    <span className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mr-3">
                                        <span className="text-white text-sm">🌱</span>
                                    </span>
                                    Farm Details
                                </h4>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            name="cropTypes"
                                            value={formData.cropTypes.join(", ")}
                                            onChange={handleCropTypesChange}
                                            placeholder="e.g., Rice, Wheat, Corn (comma separated)"
                                            className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-green-200 focus:border-green-500 transition-all bg-white/80 backdrop-blur-sm text-lg font-medium placeholder-gray-400"
                                        />
                                        <label className="absolute -top-3 left-4 bg-white px-2 text-sm font-semibold text-green-600">
                                            Crop Types
                                        </label>
                                    </div>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            name="soilType"
                                            value={formData.soilType}
                                            onChange={handleChange}
                                            placeholder="e.g., Clay, Sandy, Loamy"
                                            className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-green-200 focus:border-green-500 transition-all bg-white/80 backdrop-blur-sm text-lg font-medium placeholder-gray-400"
                                        />
                                        <label className="absolute -top-3 left-4 bg-white px-2 text-sm font-semibold text-green-600">
                                            Soil Type
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl border border-blue-100">
                                <h4 className="text-xl font-bold text-gray-700 mb-6 flex items-center">
                                    <span className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                                        <span className="text-white text-sm">⚙️</span>
                                    </span>
                                    Preferences
                                </h4>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            name="language"
                                            value={formData.language}
                                            onChange={handleChange}
                                            placeholder="e.g., English, Hindi, Spanish"
                                            className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all bg-white/80 backdrop-blur-sm text-lg font-medium placeholder-gray-400"
                                        />
                                        <label className="absolute -top-3 left-4 bg-white px-2 text-sm font-semibold text-blue-600">
                                            Language
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-100">
                                <h4 className="text-xl font-bold text-gray-700 mb-6 flex items-center">
                                    <span className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center mr-3">
                                        <span className="text-white text-sm">🔒</span>
                                    </span>
                                    Change Password (Optional)
                                </h4>
                                <div className="grid md:grid-cols-3 gap-6">
                                    <div className="relative">
                                        <input
                                            type="password"
                                            name="currentPassword"
                                            value={formData.currentPassword}
                                            onChange={handleChange}
                                            placeholder="Enter current password"
                                            className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all bg-white/80 backdrop-blur-sm text-lg font-medium placeholder-gray-400"
                                            required={formData.newPassword || formData.confirmPassword}
                                        />
                                        <label className="absolute -top-3 left-4 bg-white px-2 text-sm font-semibold text-purple-600">
                                            Current Password
                                        </label>
                                    </div>
                                    <div className="relative">
                                        <input
                                            type="password"
                                            name="newPassword"
                                            value={formData.newPassword}
                                            onChange={handleChange}
                                            placeholder="Enter new password"
                                            className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all bg-white/80 backdrop-blur-sm text-lg font-medium placeholder-gray-400"
                                        />
                                        <label className="absolute -top-3 left-4 bg-white px-2 text-sm font-semibold text-purple-600">
                                            New Password
                                        </label>
                                    </div>
                                    <div className="relative">
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            placeholder="Confirm new password"
                                            className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all bg-white/80 backdrop-blur-sm text-lg font-medium placeholder-gray-400"
                                        />
                                        <label className="absolute -top-3 left-4 bg-white px-2 text-sm font-semibold text-purple-600">
                                            Confirm Password
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-6 pt-8">
                                <button
                                    type="submit"
                                    className="group flex-1 px-8 py-5 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white font-bold text-xl rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-3 border-2 border-white/20"
                                >
                                    <span className="text-2xl group-hover:scale-110 transition-transform duration-300">💾</span>
                                    <span>Save Changes</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setEditing(false)}
                                    className="group flex-1 px-8 py-5 bg-gradient-to-r from-gray-500 to-gray-600 text-white font-bold text-xl rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-3 border-2 border-white/20"
                                >
                                    <span className="text-2xl group-hover:scale-110 transition-transform duration-300">❌</span>
                                    <span>Cancel</span>
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Profile
