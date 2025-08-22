"use client"

import { useState, useEffect, useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import axiosInstance from "../utils/axiosInstance"

const SoilTestForm = () => {
    const { user } = useContext(AuthContext)
    const [crop, setCrop] = useState("")
    const [pH, setPH] = useState("")
    const [nitrogen, setNitrogen] = useState("")
    const [phosphorus, setPhosphorus] = useState("")
    const [potassium, setPotassium] = useState("")
    const [moisture, setMoisture] = useState("")
    const [recommendations, setRecommendations] = useState("")
    const [tests, setTests] = useState([])
    const [error, setError] = useState("")

    // Fetch user's soil tests
    useEffect(() => {
        const fetchTests = async () => {
            if (!user) return // wait for user to be loaded
            try {
                const res = await axiosInstance.get("/soil-tests")
                setTests(Array.isArray(res.data) ? res.data : [res.data])
            } catch (err) {
                console.error(err)
                setError("Failed to fetch soil tests.")
            }
        }
        fetchTests()
    }, [user])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")

        try {
            const res = await axiosInstance.post("/soil-tests", {
                crop,
                pH,
                nitrogen,
                phosphorus,
                potassium,
                moisture,
            })

            // Update the list and reset form
            setTests([res.data.soilTest, ...tests])
            setCrop("")
            setPH("")
            setNitrogen("")
            setPhosphorus("")
            setPotassium("")
            setMoisture("")
            setRecommendations(res.data.soilTest.recommendations)
        } catch (err) {
            console.error(err)
            setError(err.response?.data?.message || "Failed to add soil test")
        }
    }

    return (
        <div className="min-h-screen mt-15 bg-gradient-to-br from-green-50 to-emerald-100 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-full mb-4">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                            />
                        </svg>
                    </div>
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">Soil Analysis Center</h1>
                    <p className="text-gray-600 text-lg">Monitor and optimize your soil health for better crop yields</p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    <div className="bg-white rounded-2xl shadow-xl p-8">
                        <div className="flex items-center mb-6">
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800">New Soil Test</h2>
                        </div>

                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded-r-lg">
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path
                                            fillRule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 001.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    <span className="text-red-700 font-medium">{error}</span>
                                </div>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Crop Type</label>
                                    <div className="relative">
                                        <svg
                                            className="absolute left-3 top-3 w-5 h-5 text-gray-400"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                            />
                                        </svg>
                                        <input
                                            placeholder="e.g., Wheat, Corn, Rice"
                                            value={crop}
                                            onChange={(e) => setCrop(e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">pH Level</label>
                                    <div className="relative">
                                        <svg
                                            className="absolute left-3 top-3 w-5 h-5 text-gray-400"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                            />
                                        </svg>
                                        <input
                                            type="number"
                                            step="0.1"
                                            placeholder="6.5"
                                            value={pH}
                                            onChange={(e) => setPH(e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Nitrogen (N)</label>
                                    <input
                                        type="number"
                                        placeholder="mg/kg"
                                        value={nitrogen}
                                        onChange={(e) => setNitrogen(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Phosphorus (P)</label>
                                    <input
                                        type="number"
                                        placeholder="mg/kg"
                                        value={phosphorus}
                                        onChange={(e) => setPhosphorus(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Potassium (K)</label>
                                    <input
                                        type="number"
                                        placeholder="mg/kg"
                                        value={potassium}
                                        onChange={(e) => setPotassium(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Moisture Content</label>
                                <div className="relative">
                                    <svg
                                        className="absolute left-3 top-3 w-5 h-5 text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                                        />
                                    </svg>
                                    <input
                                        type="number"
                                        placeholder="Moisture percentage"
                                        value={moisture}
                                        onChange={(e) => setMoisture(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold py-4 px-6 rounded-lg hover:from-green-700 hover:to-emerald-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
                            >
                                <div className="flex items-center justify-center">
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    Analyze Soil Sample
                                </div>
                            </button>
                        </form>

                        {recommendations && (
                            <div className="mt-6 bg-gradient-to-r from-amber-50 to-yellow-50 border-l-4 border-amber-400 rounded-r-lg p-6">
                                <div className="flex items-start">
                                    <svg
                                        className="w-6 h-6 text-amber-500 mr-3 mt-1 flex-shrink-0"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                                        />
                                    </svg>
                                    <div>
                                        <h4 className="font-bold text-amber-800 mb-2"> Recommendations</h4>
                                        <p className="text-amber-700 leading-relaxed">{recommendations}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="bg-white rounded-2xl shadow-xl p-8">
                        <div className="flex items-center mb-6">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800">Test History </h3>
                        </div>

                        <div className="space-y-4 max-h-96 overflow-y-auto">
                            {tests.length === 0 ? (
                                <div className="text-center py-8">
                                    <svg
                                        className="w-16 h-16 text-gray-300 mx-auto mb-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                        />
                                    </svg>
                                    <p className="text-gray-500">No soil tests recorded yet</p>
                                </div>
                            ) : (
                                tests.map((test) => (
                                    <div
                                        key={test._id}
                                        className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow duration-200"
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center">
                                                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                                                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                                        />
                                                    </svg>
                                                </div>
                                                <h4 className="font-bold text-gray-800 text-lg">{test.crop}</h4>
                                            </div>
                                            <span className="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
                                                pH {test.pH}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                            <div className="text-center">
                                                <div className="text-2xl font-bold text-blue-600">{test.nitrogen}</div>
                                                <div className="text-xs text-gray-500">N (mg/kg)</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-2xl font-bold text-purple-600">{test.phosphorus}</div>
                                                <div className="text-xs text-gray-500">P (mg/kg)</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-2xl font-bold text-orange-600">{test.potassium}</div>
                                                <div className="text-xs text-gray-500">K (mg/kg)</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-2xl font-bold text-cyan-600">{test.moisture}%</div>
                                                <div className="text-xs text-gray-500">Moisture</div>
                                            </div>
                                        </div>

                                        <div className="bg-white rounded-lg p-4 border-l-4 border-amber-400">
                                            <div className="flex items-start">
                                                <svg
                                                    className="w-4 h-4 text-amber-500 mr-2 mt-0.5 flex-shrink-0"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                                                    />
                                                </svg>
                                                <div>
                                                    <div className="font-semibold text-amber-800 text-sm mb-1">Recommendations</div>
                                                    <p className="text-amber-700 text-sm leading-relaxed">{test.recommendations}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SoilTestForm
