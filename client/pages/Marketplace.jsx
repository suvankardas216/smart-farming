"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axiosInstance from "../utils/axiosInstance"
import ProductCard from "../components/ProductCard"
import commodity from "../src/assets/commodity.svg"

const Marketplace = () => {
    const navigate = useNavigate()
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    // Fetch all products
    const fetchProducts = async () => {
        try {
            const res = await axiosInstance.get("/products") // GET /products
            setProducts(res.data || [])
        } catch (err) {
            console.error(err)
            setError(err.response?.data?.message || "Failed to fetch products")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchProducts()
    }, [])

    const handleProductClick = (id) => {
        navigate(`/marketplace/${id}`) // navigate to product detail page
    }

    return (
        <div className="bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 py-12 px-4 min-h-screen">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl" />
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-green-500/20 rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl" />
            </div>

            <main className="max-w-7xl mx-auto my-10 relative z-10">
                <div className="text-center mb-16">
                    <h1 className="flex items-center justify-center gap-3 bg-gradient-to-r from-emerald-400 via-green-300 to-emerald-400 bg-clip-text text-transparent text-6xl font-bold  mb-6 leading-relaxed">
                        <img src={commodity} alt="market" className="h-12 w-12" /> Marketplace
                    </h1>
                    <p className="text-gray-300 text-xl max-w-3xl mx-auto leading-relaxed">
                        Discover premium farming products and equipment from trusted sellers in our agricultural community
                    </p>
                </div>

                {loading && (
                    <div className="flex flex-col items-center justify-center py-24">
                        <div className="relative">
                            <div className="w-16 h-16 border-4 border-emerald-500/30 border-t-emerald-400 rounded-full animate-spin mb-6" />
                            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-b-green-400 rounded-full animate-spin animation-delay-150" />
                        </div>
                        <p className="text-gray-300 text-xl font-medium">Loading premium farming products...</p>
                        <p className="text-gray-400 text-sm mt-2">Finding the best deals for you</p>
                    </div>
                )}

                {error && (
                    <div className="bg-gradient-to-r from-red-500/20 to-red-600/20 border border-red-400/30 rounded-3xl p-10 text-center backdrop-blur-sm">
                        <div className="w-20 h-20 bg-red-400/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <span className="text-red-400 text-4xl">⚠️</span>
                        </div>
                        <p className="text-red-300 text-xl font-semibold">{error}</p>
                        <p className="text-red-200/80 mt-2">Please try again or contact support</p>
                    </div>
                )}

                {!loading && products.length === 0 && (
                    <div className="bg-gradient-to-br from-slate-800/80 to-gray-800/80 backdrop-blur-xl border border-emerald-500/20 rounded-3xl p-16 text-center">
                        <div className="w-24 h-24 bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-full flex items-center justify-center mx-auto mb-8 border border-emerald-400/30">
                            <span className="text-emerald-400 text-4xl">🌱</span>
                        </div>
                        <h3 className="text-2xl font-semibold text-white mb-4">No Products Available</h3>
                        <p className="text-gray-300 text-lg">
                            Our farmers are preparing amazing products for you. Check back soon!
                        </p>
                        <div className="mt-6 flex justify-center">
                            <button
                                onClick={() => window.location.reload()}
                                className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl hover:from-emerald-600 hover:to-green-700 transition-all duration-300 font-medium"
                            >
                                Refresh Products
                            </button>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {products.map((product) => (
                        <div key={product._id} className="transform hover:scale-105 transition-all duration-300">
                            <ProductCard product={product} onClick={() => handleProductClick(product._id)} />
                        </div>
                    ))}
                </div>
            </main>
        </div>
    )
}

export default Marketplace
