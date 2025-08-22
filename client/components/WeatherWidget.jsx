"use client"

import { useState, useEffect } from "react"
import axiosInstance from "../utils/axiosInstance"

const WeatherDashboard = () => {
    const [weatherData, setWeatherData] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [searchLocation, setSearchLocation] = useState("")
    const [showToast, setShowToast] = useState(false)
    const [toastMessage, setToastMessage] = useState("")
    const [user, setUser] = useState(null)

    const showToastAlert = (message) => {
        setToastMessage(message)
        setShowToast(true)
        setTimeout(() => setShowToast(false), 5000)
    }

    const fetchUserData = async () => {
        try {
            const response = await axiosInstance.get("/user/profile")
            setUser(response.data.user)
        } catch (err) {
            console.error("Failed to fetch user data:", err)
            setError("Failed to load user profile")
        }
    }

    const fetchWeather = async (location) => {
        setLoading(true)
        setError("")

        try {
            const response = await axiosInstance.get(`/weather?location=${encodeURIComponent(location)}`)
            const data = response.data
            setWeatherData(data)

            // Show toast alerts if any
            if (data.alerts && data.alerts.length > 0) {
                showToastAlert(data.alerts.join(" | "))
            }
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch weather data")
        } finally {
            setLoading(false)
        }
    }

    const handleSearch = (e) => {
        e.preventDefault()
        if (searchLocation.trim()) {
            fetchWeather(searchLocation.trim())
        }
    }

    useEffect(() => {
        const initializeData = async () => {
            await fetchUserData()
        }
        initializeData()
    }, [])

    useEffect(() => {
        if (user && user.location) {
            fetchWeather(user.location)
        }
    }, [user])

    const getWeatherIcon = (weather) => {
        if (!weather) return "🌤️" // fallback icon if undefined/null

        switch (weather.toLowerCase()) {
            case "clear":
                return "☀️"
            case "clouds":
                return "☁️"
            case "rain":
                return "🌧️"
            case "thunderstorm":
                return "⛈️"
            case "snow":
                return "❄️"
            case "mist":
            case "fog":
                return "🌫️"
            default:
                return "🌤️"
        }
    }

    return (
        <div className="w-full mx-auto mt-15 p-6 bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 min-h-screen">
            {showToast && (
                <div className="fixed top-4 right-4 bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-4 rounded-2xl shadow-2xl z-200 max-w-md border border-red-400/30 backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-red-400/20 rounded-full flex items-center justify-center">
                            <span className="text-xl">⚠️</span>
                        </div>
                        <div>
                            <p className="font-semibold">Weather Alert!</p>
                            <p className="text-sm text-red-100">{toastMessage}</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="text-center mb-12">
                <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-400 via-green-300 to-emerald-400 bg-clip-text text-transparent mb-4">
                    Weather Dashboard
                </h1>
                <p className="text-gray-300 text-lg">
                    Stay updated with real-time weather conditions for better farming decisions
                </p>
            </div>

            <form onSubmit={handleSearch} className="mb-12">
                <div className="flex gap-4 max-w-lg mx-auto">
                    <input
                        type="text"
                        value={searchLocation}
                        onChange={(e) => setSearchLocation(e.target.value)}
                        placeholder="Search location manually..."
                        className="flex-1 px-6 py-4 bg-slate-800/50 border border-emerald-500/30 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-400 outline-none text-white placeholder-gray-400 backdrop-blur-sm transition-all duration-300"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-2xl hover:from-emerald-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 border border-emerald-400/20"
                    >
                        {loading ? (
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                Searching...
                            </div>
                        ) : (
                            "Search"
                        )}
                    </button>
                </div>
            </form>

            {error && (
                <div className="bg-gradient-to-r from-red-500/20 to-red-600/20 border border-red-400/30 text-red-300 px-6 py-4 rounded-2xl mb-8 max-w-lg mx-auto backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-red-400/20 rounded-full flex items-center justify-center">
                            <span className="text-red-400">⚠️</span>
                        </div>
                        <p className="font-medium">Error: {error}</p>
                    </div>
                </div>
            )}

            {weatherData && (
                <div className="bg-gradient-to-br from-slate-800/80 to-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 mb-8 border border-emerald-500/20">
                    {/* Location Header */}
                    <div className="text-center mb-10">
                        <h2 className="text-4xl font-bold text-white mb-3 flex items-center justify-center gap-3">
                            <span className="text-emerald-400">📍</span>
                            {weatherData.location}
                        </h2>
                        <p className="text-gray-300 text-lg">Current Weather Conditions</p>
                    </div>

                    {/* Main Weather Info */}
                    <div className="grid md:grid-cols-2 gap-10 mb-10">
                        <div className="bg-gradient-to-br from-emerald-500/20 to-green-600/20 rounded-2xl p-8 text-center border border-emerald-500/30 backdrop-blur-sm">
                            <div className="text-8xl mb-6">{getWeatherIcon(weatherData.weather)}</div>
                            <div className="text-6xl font-bold text-white mb-3">{Math.round(weatherData.temperature)}°C</div>
                            <div className="text-2xl text-emerald-300 font-medium capitalize mb-2">{weatherData.description}</div>
                            <div className="text-lg text-gray-300">{weatherData.weather}</div>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl p-6 flex items-center justify-between border border-blue-400/30 backdrop-blur-sm">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-blue-400/20 rounded-xl flex items-center justify-center">
                                        <span className="text-3xl">💧</span>
                                    </div>
                                    <span className="font-medium text-white text-lg">Humidity</span>
                                </div>
                                <span className="text-2xl font-bold text-blue-300">{weatherData.humidity}%</span>
                            </div>

                            <div className="bg-gradient-to-r from-emerald-500/20 to-green-500/20 rounded-2xl p-6 flex items-center justify-between border border-emerald-400/30 backdrop-blur-sm">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-emerald-400/20 rounded-xl flex items-center justify-center">
                                        <span className="text-3xl">💨</span>
                                    </div>
                                    <span className="font-medium text-white text-lg">Wind Speed</span>
                                </div>
                                <span className="text-2xl font-bold text-emerald-300">{weatherData.windSpeed} m/s</span>
                            </div>

                            <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl p-6 flex items-center justify-between border border-purple-400/30 backdrop-blur-sm">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-purple-400/20 rounded-xl flex items-center justify-center">
                                        <span className="text-3xl">🌡️</span>
                                    </div>
                                    <span className="font-medium text-white text-lg">Feels Like</span>
                                </div>
                                <span className="text-2xl font-bold text-purple-300">{Math.round(weatherData.temperature)}°C</span>
                            </div>
                        </div>
                    </div>

                    {weatherData.alerts && weatherData.alerts.length > 0 && (
                        <div className="bg-gradient-to-r from-red-500/20 to-red-600/20 border border-red-400/30 rounded-2xl p-8 backdrop-blur-sm">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 bg-red-400/20 rounded-xl flex items-center justify-center">
                                    <span className="text-3xl">⚠️</span>
                                </div>
                                <h3 className="text-2xl font-bold text-red-300">Weather Alerts</h3>
                            </div>
                            <div className="space-y-4">
                                {weatherData.alerts.map((alert, index) => (
                                    <div key={index} className="bg-red-400/10 rounded-xl p-4 border border-red-400/20">
                                        <p className="text-red-200 font-medium">{alert}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {(!weatherData.alerts || weatherData.alerts.length === 0) && (
                        <div className="bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-400/30 rounded-2xl p-8 backdrop-blur-sm">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-emerald-400/20 rounded-xl flex items-center justify-center">
                                    <span className="text-3xl">✅</span>
                                </div>
                                <p className="text-emerald-200 font-medium text-lg">
                                    No weather alerts for your area. Conditions are favorable for farming!
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {user && (
                <div className="text-center text-gray-300">
                    <p className="text-lg">
                        Default location: <span className="font-medium text-emerald-300">{user.location}</span>
                    </p>
                    <p className="text-sm mt-2 text-gray-400">
                        Weather data updates automatically for your registered farming location
                    </p>
                </div>
            )}
        </div>
    )
}

export default WeatherDashboard
