"use client"

import { useState } from "react"
import { AuthContext } from "../context/AuthContext"
import { useContext } from "react"
import axiosInstance from "../utils/axiosInstance"

const PestDetection = () => {
    const { user } = useContext(AuthContext)
    const [image, setImage] = useState(null)
    const [detection, setDetection] = useState(null)
    const [loading, setLoading] = useState(false)
    const [preview, setPreview] = useState(null)

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        setImage(file)
        if (file) setPreview(URL.createObjectURL(file))
        else setPreview(null)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!image) return alert("Please upload an image")
        if (!user?.token) return alert("Please login to detect")

        setLoading(true)

        try {
            const formData = new FormData()
            formData.append("image", image)

            const res = await axiosInstance.post("/detection", formData, {
                headers: { Authorization: `Bearer ${user.token}` },
            })

            setDetection(res.data.detection)
        } catch (err) {
            console.error(err)
            alert("Detection failed. Try again!")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex flex-col mt-15 bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900">
            <div className="container mx-auto my-10 px-4 py-8 flex-1 max-w-4xl">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-white mb-4">🌱 Pest & Disease Detection</h1>
                    <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                        Upload an image of your plant to get instant AI-powered diagnosis and treatment recommendations
                    </p>
                </div>

                <div className="bg-gradient-to-br from-slate-800/95 to-gray-900/95 backdrop-blur-xl rounded-2xl shadow-xl p-8 mb-8 border border-emerald-500/20">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-300 mb-3">Upload Plant Image</label>
                            <div className="relative">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="block w-full text-sm text-gray-300 file:mr-4 file:py-3 file:px-6 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-500/20 file:text-emerald-300 hover:file:bg-emerald-500/30 file:cursor-pointer cursor-pointer border-2 border-dashed border-emerald-500/30 rounded-xl p-6 hover:border-emerald-400/50 transition-colors bg-slate-800/50"
                                />
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    {!image && (
                                        <div className="text-center">
                                            <svg
                                                className="mx-auto h-12 w-12 text-green-400 mb-2"
                                                stroke="currentColor"
                                                fill="none"
                                                viewBox="0 0 48 48"
                                            >
                                                <path
                                                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                            <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                            {image && <p className="mt-2 text-sm text-emerald-400 font-medium">✓ {image.name} selected</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !image}
                            className="w-full bg-gradient-to-r from-emerald-500 to-green-600 text-white font-semibold py-4 px-8 rounded-xl hover:from-emerald-600 hover:to-green-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl border border-emerald-400/20"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center">
                                    <svg
                                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                    Analyzing Image...
                                </div>
                            ) : (
                                <div className="flex items-center justify-center">
                                    <svg className="w-5 h-5 mr-2 " fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M21 21l-6-6m2-5a7 7 0 11-18 0 7 7 0 0118 0z"
                                        ></path>
                                    </svg>
                                    Detect Pests & Diseases
                                </div>
                            )}
                        </button>
                    </form>
                </div>

                {detection && (
                    <div className="bg-gradient-to-br from-slate-800/95 to-gray-900/95 backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden border border-emerald-500/20">
                        <div className="bg-gradient-to-r from-emerald-500 to-green-600 px-8 py-6">
                            <h2 className="text-2xl font-bold text-white flex items-center">
                                <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                    ></path>
                                </svg>
                                Analysis Complete
                            </h2>
                        </div>

                        <div className="flex flex-col lg:flex-row min-h-[500px]">
                            {/* Left side - Image */}
                            <div className="lg:w-1/3 p-6 bg-slate-800/50 flex items-center justify-center">
                                {preview && (
                                    <div className="mt-4 flex justify-center">
                                        <img
                                            src={preview || "/placeholder.svg"}
                                            alt="Preview"
                                            className="w-64 h-auto rounded-lg shadow-md object-cover"
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Right side - Content */}
                            <div className="lg:w-2/3 flex flex-col">
                                {/* Main heading */}
                                <div className="px-8 py-6 border-b border-emerald-500/20">
                                    <h3 className="text-3xl font-bold text-white capitalize">{detection.diagnosis}</h3>
                                </div>

                                {/* Scrollable content */}
                                <div className="flex-1 p-8 overflow-y-auto max-h-96">
                                    <div className="prose prose-lg max-w-none">
                                        {detection.advice
                                            .split(/\n+/)
                                            .map((section, index) => {
                                                const trimmedSection = section.trim()
                                                if (!trimmedSection) return null

                                                // Handle markdown headers (## Header)
                                                if (trimmedSection.match(/^#{1,6}\s/)) {
                                                    const level = trimmedSection.match(/^#{1,6}/)[0].length
                                                    const text = trimmedSection.replace(/^#{1,6}\s/, "")
                                                    return (
                                                        <div
                                                            key={index}
                                                            className={`${level === 1 ? "text-xl" : level === 2 ? "text-xl" : "text-lg"} font-bold text-red-500 mt-6 mb-3 first:mt-0`}
                                                        >
                                                            {text}
                                                        </div>
                                                    )
                                                }

                                                // Handle bold text (**text**)
                                                if (trimmedSection.includes("**")) {
                                                    const parts = trimmedSection.split(/(\*\*.*?\*\*)/)
                                                    return (
                                                        <p key={index} className="text-gray-700 leading-relaxed mb-4">
                                                            {parts.map((part, partIndex) =>
                                                                part.startsWith("**") && part.endsWith("**") ? (
                                                                    <strong key={partIndex} className="font-semibold text-white">
                                                                        {part.replace(/\*\*/g, "")}
                                                                    </strong>
                                                                ) : (
                                                                    <span key={partIndex}>{part}</span>
                                                                ),
                                                            )}
                                                        </p>
                                                    )
                                                }

                                                // Handle bullet points (• or -)
                                                if (trimmedSection.match(/^[•\-*]\s/)) {
                                                    const items = trimmedSection.split(/\n[•\-*]\s/).filter((item) => item.trim())
                                                    const firstItem = items[0].replace(/^[•\-*]\s/, "")
                                                    const allItems = [firstItem, ...items.slice(1)]

                                                    return (
                                                        <ul key={index} className="list-disc list-inside space-y-2 mb-4 ml-4">
                                                            {allItems.map((item, itemIndex) => (
                                                                <li key={itemIndex} className="text-red-700 leading-relaxed">
                                                                    {item.trim()}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    )
                                                }

                                                // Regular paragraphs
                                                return (
                                                    <p key={index} className="text-white font-bold leading-relaxed mb-4">
                                                        {trimmedSection}
                                                    </p>
                                                )
                                            })
                                            .filter(Boolean)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default PestDetection
