"use client"

import { useParams } from "react-router-dom"
import { useState, useEffect } from "react"
import axiosInstance from "../utils/axiosInstance"

const ProductDetails = () => {
    const { id } = useParams()
    const [product, setProduct] = useState(null)
    const [quantity, setQuantity] = useState(1)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [adding, setAdding] = useState(false)

    // Fetch product data
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await axiosInstance.get(`/products/${id}`)
                setProduct(res.data)
            } catch (err) {
                console.error(err)
                setError(err.response?.data?.message || "Failed to fetch product")
            } finally {
                setLoading(false)
            }
        }
        fetchProduct()
    }, [id])

    // Add to cart handler
    const handleAddToCart = async () => {
        if (!product || quantity < 1) return

        setAdding(true)
        try {
            const res = await axiosInstance.post("/cart/add", { productId: product._id, quantity })

            const updatedCart = res.data.cart || res.data

            // Dispatch event so Navbar updates count
            window.dispatchEvent(new CustomEvent("cartUpdated", { detail: updatedCart }))

            alert(`Added ${quantity} x ${product.name} to cart!`)
        } catch (err) {
            console.error("Failed to add to cart", err)
            alert("Failed to add to cart")
        } finally {
            setAdding(false)
        }
    }

    if (loading)
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900">
                <div className="text-center p-8 bg-gradient-to-br from-slate-800/50 to-gray-800/50 backdrop-blur-xl rounded-3xl border border-emerald-500/20 shadow-2xl">
                    <div className="relative">
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-500/20 border-t-emerald-400 mx-auto mb-6"></div>
                        <div className="absolute inset-0 rounded-full bg-emerald-400/10 animate-pulse"></div>
                    </div>
                    <p className="text-xl font-medium text-emerald-100">Loading product...</p>
                    <div className="mt-4 flex justify-center space-x-1">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></div>
                        <div
                            className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                            className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                        ></div>
                    </div>
                </div>
            </div>
        )

    if (error)
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900">
                <div className="text-center p-8 bg-gradient-to-br from-red-900/20 to-red-800/20 backdrop-blur-xl rounded-3xl border border-red-500/30 shadow-2xl max-w-md">
                    <div className="w-20 h-20 bg-gradient-to-br from-red-500/20 to-red-600/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/30">
                        <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            ></path>
                        </svg>
                    </div>
                    <p className="text-xl font-semibold text-red-300 mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium rounded-xl transition-all duration-300 transform hover:scale-105"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        )

    if (!product)
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900">
                <div className="text-center p-8 bg-gradient-to-br from-slate-800/50 to-gray-800/50 backdrop-blur-xl rounded-3xl border border-gray-500/20 shadow-2xl max-w-md">
                    <div className="w-20 h-20 bg-gradient-to-br from-gray-500/20 to-gray-600/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-500/30">
                        <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33"
                            ></path>
                        </svg>
                    </div>
                    <p className="text-xl font-semibold text-gray-300">Product not found</p>
                </div>
            </div>
        )

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 pt-20">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="bg-gradient-to-br from-slate-800/40 to-gray-800/40 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-emerald-500/20">
                    <div className="flex flex-col lg:flex-row gap-12">
                        <div className="lg:w-1/2">
                            <div className="relative group">
                                <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
                                <div className="absolute -inset-2 bg-gradient-to-r from-emerald-400/10 to-green-400/10 rounded-2xl"></div>
                                <img
                                    src={product.image || "/placeholder.png"}
                                    alt={product.name}
                                    className="relative w-full h-96 lg:h-[500px] object-cover rounded-2xl shadow-2xl border border-emerald-500/20 group-hover:scale-[1.02] transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent rounded-2xl"></div>
                            </div>
                        </div>

                        <div className="lg:w-1/2 space-y-8">
                            <div className="space-y-6">
                                <div className="text-center">
                                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-400 via-green-300 to-emerald-400 bg-clip-text text-transparent mb-4 leading-tight">
                                        {product.name}
                                    </h1>
                                </div>

                                <div className="p-6 bg-gradient-to-br from-emerald-500/10 to-green-500/10 rounded-2xl border border-emerald-500/20 backdrop-blur-sm">
                                    <h3 className="text-lg font-semibold text-emerald-100 mb-3 flex items-center gap-2">
                                        <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
                                        Description
                                    </h3>
                                    <p className="text-gray-300 leading-relaxed">{product.description}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-6 bg-gradient-to-br from-emerald-500/15 to-green-500/15 rounded-2xl border border-emerald-500/30 text-center backdrop-blur-sm hover:border-emerald-400/50 transition-all duration-300">
                                        <div className="text-3xl font-bold text-emerald-300 mb-2">₹{product.price}</div>
                                        <div className="text-sm font-medium text-emerald-400">Price per unit</div>
                                    </div>
                                    <div className="p-6 bg-gradient-to-br from-orange-500/15 to-amber-500/15 rounded-2xl border border-orange-500/30 text-center backdrop-blur-sm hover:border-orange-400/50 transition-all duration-300">
                                        <div className="text-3xl font-bold text-orange-300 mb-2">{product.stockQuantity}</div>
                                        <div className="text-sm font-medium text-orange-400">Units available</div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 bg-gradient-to-br from-slate-700/30 to-gray-700/30 rounded-2xl border border-gray-500/20 backdrop-blur-sm">
                                <label className=" text-lg font-semibold text-gray-200 mb-4 flex items-center gap-2">
                                    <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                                    Select Quantity
                                </label>
                                <div className="flex items-center justify-center space-x-6">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        disabled={quantity <= 1}
                                        className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold text-xl rounded-xl shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center border border-red-400/30"
                                    >
                                        -
                                    </button>
                                    <div className="w-24 h-14 bg-gradient-to-br from-slate-600/50 to-gray-600/50 border-2 border-gray-400/30 rounded-xl flex items-center justify-center backdrop-blur-sm">
                                        <span className="text-2xl font-bold text-white">{quantity}</span>
                                    </div>
                                    <button
                                        onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                                        disabled={quantity >= product.stockQuantity}
                                        className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold text-xl rounded-xl shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center border border-emerald-400/30"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            <button
                                onClick={handleAddToCart}
                                disabled={product.stockQuantity === 0 || adding}
                                className="w-full py-5 px-8 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none border border-emerald-500/30 hover:border-emerald-400/50"
                            >
                                <div className="flex items-center justify-center space-x-3">
                                    {adding ? (
                                        <>
                                            <div className="animate-spin rounded-full h-6 w-6 border-2 border-white/30 border-t-white"></div>
                                            <span>Adding to Cart...</span>
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h8"
                                                ></path>
                                            </svg>
                                            <span>Add to Cart</span>
                                            <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse"></div>
                                        </>
                                    )}
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductDetails
