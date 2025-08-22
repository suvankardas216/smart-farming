"use client"
import { useEffect, useState, useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import axiosInstance from "../utils/axiosInstance"
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Label,
} from "recharts"
import { Link } from "react-router-dom"

const computeDerived = (record) => {
    const yKg = record.yieldUnit === "tonnes" ? record.yieldAmount * 1000 : record.yieldAmount
    const totalExpenses = Object.values(record.expenses || {}).reduce((a, b) => a + Number(b || 0), 0)
    const revenue = yKg * record.pricePerUnit
    const net = revenue - totalExpenses
    const margin = totalExpenses > 0 ? (net / totalExpenses) * 100 : 0
    return { yKg, revenue, totalExpenses, net, margin }
}

const Home = () => {
    const { user: contextUser, loading: userLoading } = useContext(AuthContext)

    const [user, setUser] = useState(null)
    const [analytics, setAnalytics] = useState([])
    const [weather, setWeather] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await axiosInstance.get("/user/profile")
                const profile = response.data.user
                setUser(profile)

                if (profile.location) {
                    const weatherRes = await axiosInstance.get(
                        `/weather?location=${encodeURIComponent(profile.location)}`
                    )
                    setWeather(weatherRes.data)
                }

                const analyticsRes = await axiosInstance.get("/analytics")
                // Ensure it's always an array
                setAnalytics(Array.isArray(analyticsRes.data) ? analyticsRes.data : [])
            } catch (error) {
                console.error("Error fetching dashboard data:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchUserProfile()
    }, [])

    if (userLoading || loading)
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                    <p className="text-lg font-medium text-slate-600">Loading your dashboard...</p>
                </div>
            </div>
        )

    if (!user)
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center">
                <div className="text-center bg-white p-8 rounded-2xl shadow-lg border border-slate-200">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                            />
                        </svg>
                    </div>
                    <p className="text-lg font-medium text-slate-800">Please login to access your dashboard</p>
                </div>
            </div>
        )

    // Prepare chart data safely using computeDerived
    const chartData = analytics.map((r) => {
        const d = computeDerived(r)
        return {
            crop: r.cropName,
            year: new Date(r.date).getFullYear(),
            yield: d.yKg,
            revenue: d.revenue,
            expenses: d.totalExpenses,
            net: d.net,
            margin: d.margin,
        }
    })

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
            <div className="p-6 space-y-8 mt-15 max-w-7xl mx-auto">
                {/* Welcome card */}
                <div className="bg-gradient-to-r from-green-600 to-blue-600 p-8 rounded-3xl shadow-xl text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-bold mb-2">Welcome back, {user.name}! 👋</h1>
                            <p className="text-green-100 text-lg">Here's your farm dashboard overview</p>
                        </div>
                    </div>
                </div>

                {/* Crops */}
                {(user?.farmDetails?.cropTypes || []).length > 0 && (
                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200">
                        <h2 className="text-xl font-semibold text-slate-800 mb-3">Your Crops</h2>
                        <div className="flex flex-wrap gap-3">
                            {(user?.farmDetails?.cropTypes || []).map((crop, idx) => (
                                <span
                                    key={idx}
                                    className="px-4 py-2 bg-gradient-to-r from-green-100 to-green-200 text-green-800 rounded-full font-medium text-sm border border-green-300 shadow-sm hover:shadow-md transition-shadow"
                                >
                                    🌱 {crop}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Weather */}
                {weather && (
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-2xl shadow-lg text-white">
                        
                        <h2 className="text-lg font-semibold mb-1">Weather in {user.location}</h2>
                        <p className="text-2xl font-bold">{weather.temperature}°C</p>
                        <p className="capitalize">{weather.description}</p>
                        <Link
                            to="/weather"
                            className="mt-3 inline-flex items-center px-6 py-3  text-white font-semibold rounded-xl hover:from-green-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                            More Details
                            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </Link>
                    </div>
                )}
                <Link
                    to="/farm-analytics"
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                    More Details
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                </Link>

                {/* Charts */}
                {chartData.length > 0 ? (
                    <div className="grid bg-gray-300 w-full p-2 rounded-xl grid-cols-1 lg:grid-cols-2 gap-6 max-w-4xl">
                        {/* Yield Chart */}
                        <div className="flex flex-col items-center justify-center bg-white p-6 rounded-2xl shadow-lg border border-slate-200">

                            <h2 className="text-xl font-semibold mb-4 text-slate-800">Yield Trends</h2>
                            <ResponsiveContainer width="60%" height={200}>
                                <LineChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="year">
                                        <Label
                                            value="Year"
                                            offset={0}
                                            position="insideBottom"
                                            style={{ textAnchor: "middle", fontWeight: "bold" }}
                                        />
                                    </XAxis>
                                    <YAxis>
                                        <Label
                                            value="Yield (kg)"
                                            angle={-90}
                                            position="insideLeft"
                                            style={{ textAnchor: "middle", fontWeight: "bold" }}
                                        />
                                    </YAxis>
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="yield" stroke="#4CAF50" strokeWidth={2} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Profit Chart */}
                        <div className="flex flex-col items-center justify-center  bg-white p-6 rounded-2xl shadow-lg border border-slate-200 ">
                            <h2 className="text-xl font-semibold mb-4 text-slate-800">Profit Analysis</h2>
                            <ResponsiveContainer width="60%" height={200}>
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="crop">
                                        <Label
                                            value="Crop"
                                            offset={0}
                                            position="insideBottom"
                                            style={{ textAnchor: "middle", fontWeight: "bold" }}
                                        />
                                    </XAxis>
                                    <YAxis>
                                        <Label
                                            value="Profit Margin (%)"
                                            angle={-90}
                                            position="insideLeft"
                                            style={{ textAnchor: "middle", fontWeight: "bold" }}
                                        />
                                    </YAxis>
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="margin" fill="#FF9800" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white p-12 rounded-2xl shadow-lg border border-slate-200 text-center">
                        <h3 className="text-xl font-semibold text-slate-800 mb-2">No Analytics Data Yet</h3>
                        <p className="text-slate-600">
                            Start adding your farm records to see insightful charts and analytics here.
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Home
