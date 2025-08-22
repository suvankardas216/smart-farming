"use client"

import { useEffect, useState } from "react"
import axiosInstance from "../../utils/axiosInstance"
import toast from "react-hot-toast"
import { Link } from "react-router-dom"

const Advisories = () => {
    const [requests, setRequests] = useState([])
    const [filter, setFilter] = useState("all") // all | pending | resolved
    const [showModal, setShowModal] = useState(false)
    const [selectedRequest, setSelectedRequest] = useState(null)
    const [formData, setFormData] = useState({
        plantingSchedule: "",
        fertilizerAdvice: "",
        irrigationTips: "",
    })

    const fetchRequests = async () => {
        try {
            const { data } = await axiosInstance.get("/crop-advisory/admin/requests")
            setRequests(data)
        } catch (err) {
            console.error(err)
            toast.error("Failed to fetch advisory requests")
        }
    }

    useEffect(() => {
        fetchRequests()
    }, [])

    const openResolveForm = (req) => {
        setSelectedRequest(req)
        setShowModal(true)
    }

    const closeModal = () => {
        setShowModal(false)
        setSelectedRequest(null)
        setFormData({
            plantingSchedule: "",
            fertilizerAdvice: "",
            irrigationTips: "",
        })
    }

    const handleFormChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }

    const handleResolveSubmit = async (e) => {
        e.preventDefault()
        try {
            await axiosInstance.patch(`/crop-advisory/admin/requests/${selectedRequest._id}/resolve`, formData)
            toast.success("Request resolved successfully!")
            closeModal()
            fetchRequests()
        } catch (err) {
            console.error(err)
            toast.error("Failed to resolve request")
        }
    }

    // filter requests
    const filteredRequests = requests.filter((req) => {
        if (filter === "all") return true
        return req.status === filter
    })

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-6">
            <Link
                to="/admin"
                className="inline-flex mb-3 items-center px-3 py-1.5 text-sm font-medium text-black bg-white rounded-md shadow hover:bg-gray-100 transition"
            >
                ← Back
            </Link>
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">Crop Advisory Requests</h1>
                    <p className="text-gray-600">Manage and resolve farmer advisory requests</p>
                </div>

                <div className="flex gap-3 mb-6">
                    {["all", "pending", "resolved"].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${filter === f
                                ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg transform scale-105"
                                : "bg-white text-gray-700 hover:bg-gray-50 hover:shadow-md border border-gray-200"
                                }`}
                        >
                            {f.charAt(0).toUpperCase() + f.slice(1)}
                        </button>
                    ))}
                </div>

                <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[1000px]">
                            <thead className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
                                <tr>
                                    <th className="p-4 text-left font-semibold min-w-[200px]">Request ID</th>
                                    <th className="p-4 text-left font-semibold min-w-[150px]">Crop Type</th>
                                    <th className="p-4 text-left font-semibold min-w-[200px]">Location</th>
                                    <th className="p-4 text-left font-semibold min-w-[200px]">Soil Condition</th>
                                    <th className="p-4 text-left font-semibold min-w-[120px]">Status</th>
                                    <th className="p-4 text-left font-semibold min-w-[150px]">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredRequests.map((req, index) => (
                                    <tr
                                        key={req._id}
                                        className={`border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150 ${index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                                            }`}
                                    >
                                        <td className="p-4 font-mono text-sm text-gray-700 whitespace-nowrap">{req._id}</td>
                                        <td className="p-4 font-medium text-gray-800 whitespace-nowrap">{req.cropType}</td>
                                        <td className="p-4 text-gray-700 whitespace-nowrap">{req.location}</td>
                                        <td className="p-4 text-gray-700 whitespace-nowrap">{req.soilCondition}</td>
                                        <td className="p-4 whitespace-nowrap">
                                            {req.status === "resolved" ? (
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                                                    ✓ Resolved
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                                                    ⏳ Pending
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-4 whitespace-nowrap">
                                            {req.status === "pending" && (
                                                <button
                                                    className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                                                    onClick={() => openResolveForm(req)}
                                                >
                                                    Resolve
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {filteredRequests.length === 0 && (
                        <div className="text-center py-12">
                            <div className="text-gray-400 text-6xl mb-4">🌾</div>
                            <h3 className="text-lg font-medium text-gray-600 mb-2">No requests found</h3>
                            <p className="text-gray-500">No advisory requests match your current filter.</p>
                        </div>
                    )}
                </div>

                {showModal && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
                        <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md mx-4 border border-gray-100">
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-gray-800 mb-2">Resolve Request</h2>
                                <p className="text-gray-600">
                                    Crop Type: <span className="font-medium text-green-600">{selectedRequest?.cropType}</span>
                                </p>
                            </div>

                            <form onSubmit={handleResolveSubmit} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Planting Schedule</label>
                                    <input
                                        type="text"
                                        name="plantingSchedule"
                                        value={formData.plantingSchedule}
                                        onChange={handleFormChange}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
                                        placeholder="e.g., June to July"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Fertilizer Advice</label>
                                    <input
                                        type="text"
                                        name="fertilizerAdvice"
                                        value={formData.fertilizerAdvice}
                                        onChange={handleFormChange}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
                                        placeholder="e.g., Use compost + NPK"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Irrigation Tips</label>
                                    <input
                                        type="text"
                                        name="irrigationTips"
                                        value={formData.irrigationTips}
                                        onChange={handleFormChange}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
                                        placeholder="e.g., Water every 5–7 days"
                                        required
                                    />
                                </div>

                                <div className="flex justify-end gap-3 mt-8">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-md hover:shadow-lg"
                                    >
                                        Submit Resolution
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Advisories
