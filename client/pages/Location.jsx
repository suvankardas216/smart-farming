// src/pages/Location.jsx
import { useEffect, useState } from "react"
import axiosInstance from "../utils/axiosInstance.js"
import soil from "../src/assets/soil.svg"
import water from "../src/assets/water.svg"
import loupe from "../src/assets/loupe.svg"
import placeholder from "../src/assets/placeholder.svg"
import star from "../src/assets/star.svg"

const Location = () => {
    const [city, setCity] = useState("")
    const [inputCity, setInputCity] = useState("")
    const [type, setType] = useState("soil")
    const [labs, setLabs] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    // 🔹 Fetch user profile to get city
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axiosInstance.get("/user/profile")
                setCity(res.data.user.location)
                setInputCity(res.data.user.location)
            } catch (err) {
                console.error("Profile fetch failed:", err)
                setCity("Delhi")
                setInputCity("Delhi")
            }
        }
        fetchProfile()
    }, [])

    // 🔹 Fetch labs whenever city/type changes
    useEffect(() => {
        if (!city) return

        const fetchLabs = async () => {
            setLoading(true)
            setError("")
            try {
                const res = await axiosInstance.get(`/labs?city=${city}&type=${type}`)
                setLabs(res.data)
            } catch (err) {
                setError("Failed to fetch labs")
            } finally {
                setLoading(false)
            }
        }

        fetchLabs()
    }, [city, type])

    const handleSearch = (e) => {
        e.preventDefault()
        if (inputCity.trim()) {
            setCity(inputCity.trim())
        }
    }
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-6 py-8">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                    Testing Labs in {city}
                </h1>
                <p className="text-gray-600 text-lg">Find certified soil and water testing laboratories near you</p>
                <div className="flex items-center justify-center ">
                    <img src={placeholder} alt="placeholder" className="w-6 h-6" />
                    <p className="text-gray-600 text-xl font-semibold"> Your Current Location: {city}</p>
                </div>
            </div>

            <form onSubmit={handleSearch} className="flex justify-center gap-3 mb-8">
                <div className="relative">
                    <input
                        type="text"
                        value={inputCity}
                        onChange={(e) => setInputCity(e.target.value)}
                        placeholder="Enter city (e.g. Delhi)"
                        className="px-6 py-3 rounded-xl border-2 border-gray-200 w-80 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 shadow-sm"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        
                        <img src={loupe} alt="loupe" className="w-6 h-6" />
                    </div>
                </div>
                <button
                    type="submit"
                    className="px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                    Search
                </button>
            </form>

            <div className="flex justify-center gap-4 mb-8">
                <button
                    onClick={() => setType("soil")}
                    className={`px-8 py-4 rounded-xl font-semibold flex items-center gap-3 transition-all duration-200 transform hover:scale-105 ${type === "soil"
                        ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg"
                        : "bg-white text-gray-700 border-2 border-gray-200 hover:border-green-300 shadow-sm"
                        }`}
                >

                    <img src={soil} alt="soil" className="h-6 w-6" />
                    Soil Testing Labs
                </button>
                <button
                    onClick={() => setType("water")}
                    className={`px-8 py-4 rounded-xl font-semibold flex items-center gap-3 transition-all duration-200 transform hover:scale-105 ${type === "water"
                        ? "bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-lg"
                        : "bg-white text-gray-700 border-2 border-gray-200 hover:border-blue-300 shadow-sm"
                        }`}
                >
                    <img src={water} alt="water" className="h-6 w-6" />
                    Water Testing Labs
                </button>
            </div>

            {loading && (
                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                    <p className="ml-4 text-lg text-gray-600">Loading labs...</p>
                </div>
            )}
            {error && (
                <div className="flex justify-center items-center py-8">
                    <div className="bg-red-50 border border-red-200 rounded-xl px-6 py-4 flex items-center gap-3">
                        <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        <p className="text-red-700 font-medium">{error}</p>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                {labs.map((lab, idx) => (
                    <div
                        key={idx}
                        className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className={`p-3  rounded-xl ${type === "soil" ? "bg-green-100" : "bg-blue-100"}`}>
                                    {type === "soil" ? (

                                        <img src={soil} alt="soil" className="h-6 w-6" />
                                    ) : (
                                        <img src={water} alt="water" className=" h-6 w-6" />
                                    )}
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-800">{lab.name}</h2>
                                    {lab.rating && (
                                        <div className="flex items-center gap-1 mt-1">
                                            
                                            <img src={star} alt="star" className="h-4 w-4" />
                                            <span className="text-yellow-600 font-semibold">{lab.rating}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-start gap-2 text-gray-600">
                            
                            <p className="text-sm leading-relaxed">{lab.address}</p>
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-100">
                            <span
                                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${type === "soil" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                                    }`}
                            >
                                {type === "soil" ? "Soil Testing" : "Water Testing"}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Location
