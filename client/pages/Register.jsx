// "use client"

// import { useState } from "react"
// import { useNavigate } from "react-router-dom"
// import { registerUser } from "../services/authService.js"
// import { useAuth } from "../hooks/useAuth.js"

// const Register = () => {
//     const [name, setName] = useState("")
//     const [email, setEmail] = useState("")
//     const [password, setPassword] = useState("")
//     const [error, setError] = useState("")
//     const [isLoading, setIsLoading] = useState(false)
//     const { login } = useAuth()
//     const navigate = useNavigate()

//     const handleSubmit = async (e) => {
//         e.preventDefault()
//         setError("")
//         setIsLoading(true)

//         try {
//             const data = await registerUser(name, email, password)
//             login(data.user, data.token)
//             navigate("/") // redirect to home
//         } catch (err) {
//             setError(err.response?.data?.message || "Registration failed. Please try again.")
//         } finally {
//             setIsLoading(false)
//         }
//     }

//     return (
//         <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5 px-4">
//             <div className="max-w-md w-full space-y-8">
//                 <div className="text-center">
//                     <div className="mx-auto h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
//                         <svg className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                             <path
//                                 strokeLinecap="round"
//                                 strokeLinejoin="round"
//                                 strokeWidth={2}
//                                 d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
//                             />
//                         </svg>
//                     </div>
//                     <h2 className="font-serif text-3xl font-bold text-foreground mb-2">Create Account</h2>
//                     <p className="text-muted-foreground">Join Smart Farming today</p>
//                 </div>

//                 <div className="bg-card rounded-xl shadow-lg border border-border p-8">
//                     {error && (
//                         <div className="mb-4 text-destructive-foreground text-sm font-medium bg-destructive/10 border border-destructive/20 rounded-lg p-3">
//                             {error}
//                         </div>
//                     )}

//                     <form onSubmit={handleSubmit} className="space-y-6">
//                         <div>
//                             <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
//                                 Full Name
//                             </label>
//                             <input
//                                 id="name"
//                                 type="text"
//                                 value={name}
//                                 onChange={(e) => setName(e.target.value)}
//                                 className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200 outline-none text-foreground placeholder:text-muted-foreground"
//                                 placeholder="Enter your full name"
//                                 required
//                             />
//                         </div>

//                         <div>
//                             <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
//                                 Email address
//                             </label>
//                             <input
//                                 id="email"
//                                 type="email"
//                                 value={email}
//                                 onChange={(e) => setEmail(e.target.value)}
//                                 className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200 outline-none text-foreground placeholder:text-muted-foreground"
//                                 placeholder="Enter your email"
//                                 required
//                             />
//                         </div>

//                         <div>
//                             <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
//                                 Password
//                             </label>
//                             <input
//                                 id="password"
//                                 type="password"
//                                 value={password}
//                                 onChange={(e) => setPassword(e.target.value)}
//                                 className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200 outline-none text-foreground placeholder:text-muted-foreground"
//                                 placeholder="Create a password"
//                                 required
//                             />
//                         </div>

//                         <button
//                             type="submit"
//                             disabled={isLoading}
//                             className="w-full bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-primary-foreground font-semibold py-3 px-4 rounded-lg transition-all duration-200 focus:ring-2 focus:ring-ring focus:ring-offset-2 outline-none disabled:cursor-not-allowed"
//                         >
//                             {isLoading ? "Creating Account..." : "Create Account"}
//                         </button>
//                     </form>
//                 </div>

//                 <div className="text-center">
//                     <p className="text-sm text-muted-foreground">
//                         Already have an account?{" "}
//                         <a
//                             href="/login"
//                             className="text-blue-500 hover:text-accent/80 font-medium transition-colors duration-200 underline-offset-4 hover:underline"
//                         >
//                             Sign in
//                         </a>
//                     </p>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default Register
"use client"

import { useState } from "react"
import api from "../services/api"
import { useNavigate, Link } from "react-router-dom"

const Register = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        location: "",
        language: "en",
        farmDetails: {
            cropTypes: "",
            soilType: "",
        },
    })

    const navigate = useNavigate()

    const handleChange = (e) => {
        const { name, value } = e.target

        if (name.startsWith("farmDetails.")) {
            const field = name.split(".")[1]
            setFormData((prev) => ({
                ...prev,
                farmDetails: {
                    ...prev.farmDetails,
                    [field]: value,
                },
            }))
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }))
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const payload = {
                ...formData,
                farmDetails: {
                    cropTypes: formData.farmDetails.cropTypes.split(",").map((c) => c.trim()),
                    soilType: formData.farmDetails.soilType,
                },
            }

            const res = await api.post("/auth/register", payload)
            console.log("✅ Registered:", res.data)
            navigate("/login")
        } catch (error) {
            console.error("❌ Register error:", error.response?.data || error.message)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
            <div className="w-full max-w-lg">
                {/* Modern card design with gradient header */}
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                    {/* Header Section */}
                    <div className="bg-gradient-to-r from-green-600 to-blue-600 px-8 py-6 text-center">
                        <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
                        <p className="text-green-100">Join our farming community today</p>
                    </div>

                    {/* Form Section */}
                    <form onSubmit={handleSubmit} className="px-8 py-6 space-y-6">
                        {/* Personal Information */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                                Personal Information
                            </h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Enter your full name"
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Enter your email"
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                                    <input
                                        type="password"
                                        name="password"
                                        placeholder="Create a strong password"
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                                        <input
                                            type="text"
                                            name="location"
                                            placeholder="Your location"
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                                        <input
                                            type="text"
                                            name="language"
                                            placeholder="en"
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Farm Details */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">Farm Details</h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Crop Types</label>
                                    <input
                                        type="text"
                                        name="farmDetails.cropTypes"
                                        placeholder="e.g., wheat, rice, corn (comma separated)"
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                                        required
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Separate multiple crops with commas</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Soil Type</label>
                                    <input
                                        type="text"
                                        name="farmDetails.soilType"
                                        placeholder="e.g., clay, sandy, loam"
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
                        >
                            Create Account
                        </button>

                        <div className="text-center pt-4 border-t border-gray-200">
                            <p className="text-gray-600">
                                Already have an account?{" "}
                                <Link
                                    to="/login"
                                    className="text-green-600 hover:text-green-700 font-semibold transition-colors duration-200"
                                >
                                    Sign in here
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Register
