"use client"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axiosInstance from "../utils/axiosInstance"

const CartPage = () => {
    const [cart, setCart] = useState({ items: [] })
    const [loading, setLoading] = useState(true)
    const [quantities, setQuantities] = useState({})

    const navigate = useNavigate()

    // Fetch cart and update state
    const fetchCart = async () => {
        try {
            const res = await axiosInstance.get("/cart")
            const data = res.data || { items: [] }

            // Update quantities map
            const qtyObj = {}
            data.items.forEach((item) => {
                const productId = item.product?._id || item.product
                qtyObj[productId] = item.quantity
            })

            setQuantities(qtyObj)
            setCart(data)

            // Notify navbar about updated cart
            window.dispatchEvent(new CustomEvent("cartUpdated", { detail: data }))

            return data
        } catch (err) {
            console.error("Failed to fetch cart", err)
            return { items: [] }
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchCart()
    }, [])

    const handleIncrease = async (item) => {
        const productId = item.product?._id || item.product
        const newQty = (quantities[productId] || item.quantity) + 1

        try {
            await axiosInstance.post("/cart/update", { productId, quantity: newQty })
            setQuantities((prev) => ({ ...prev, [productId]: newQty }))

            // fetch fresh cart and notify navbar
            await fetchCart()
        } catch (err) {
            console.error("Failed to increase quantity", err)
        }
    }

    const handleDecrease = async (item) => {
        const productId = item.product?._id || item.product
        const currentQty = quantities[productId] || item.quantity
        if (currentQty <= 1) return

        try {
            await axiosInstance.post("/cart/update", { productId, quantity: currentQty - 1 })
            setQuantities((prev) => ({ ...prev, [productId]: currentQty - 1 }))

            await fetchCart()
        } catch (err) {
            console.error("Failed to decrease quantity", err)
        }
    }

    const handleRemove = async (item) => {
        const productId = item.product?._id || item.product
        try {
            await axiosInstance.post("/cart/remove", { productId })
            await fetchCart()
        } catch (err) {
            console.error("Failed to remove item", err)
        }
    }

    const handleCheckout = () => {
        navigate("/checkout", { state: { cartItems: cart.items } })
    }

    if (loading)
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900">
                <div className="text-center">
                    <div className="relative">
                        <div className="animate-spin rounded-full h-20 w-20 border-4 border-emerald-200 border-t-emerald-500 mx-auto mb-6"></div>
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-400/20 to-green-400/20 blur-xl"></div>
                    </div>
                    <p className="text-xl font-semibold text-white/90">Loading your cart...</p>
                    <p className="text-emerald-400 text-sm mt-2">Preparing your farming essentials</p>
                </div>
            </div>
        )

    const totalPrice = cart.items.reduce((acc, item) => {
        const product = item.product || {}
        const productId = product._id || item.product
        const price = product.price || 0
        const qty = quantities[productId] || item.quantity
        return acc + price * qty
    }, 0)

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 pt-20">
            <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-400 via-green-300 to-emerald-400 bg-clip-text text-transparent mb-4 leading-tight">
                        Shopping Cart
                    </h1>
                    <p className="text-white/70 text-lg">Your selected farming products</p>
                </div>

                {cart.items.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="bg-gradient-to-br from-slate-800/80 to-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl p-12 border border-emerald-500/20 max-w-md mx-auto">
                            <div className="w-24 h-24 bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/30">
                                <svg className="w-12 h-12 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h8"
                                    ></path>
                                </svg>
                            </div>
                            <p className="text-xl font-semibold text-white mb-2">Your cart is empty</p>
                            <p className="text-white/60 mb-6">Add some farming products to get started!</p>
                            <div className="w-16 h-1 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full mx-auto"></div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-8">
                        <div className="bg-gradient-to-br from-slate-800/80 to-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-emerald-500/20">
                            <div className="space-y-6">
                                {cart.items.map((item, index) => {
                                    const product = item.product || {}
                                    const productId = product._id || item.product
                                    const qty = quantities[productId] || item.quantity
                                    const price = product.price || 0

                                    return (
                                        <div
                                            key={productId || index}
                                            className="group p-6 bg-gradient-to-r from-slate-700/50 to-gray-700/50 rounded-2xl border border-emerald-500/10 hover:border-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300 backdrop-blur-sm"
                                        >
                                            <div className="flex flex-col lg:flex-row items-center gap-6">
                                                <div className="relative">
                                                    <div className="absolute -inset-2 bg-gradient-to-r from-emerald-500/30 to-green-500/30 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
                                                    <img
                                                        src={product.image || "/placeholder.png"}
                                                        alt={product.name || "Product"}
                                                        className="relative w-24 h-24 object-cover rounded-xl shadow-lg border border-emerald-500/20"
                                                    />
                                                </div>

                                                <div className="flex-1 text-center lg:text-left">
                                                    <h2 className="text-xl font-bold text-white mb-3">{product.name || "Unknown"}</h2>
                                                    <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-emerald-500/20 to-green-500/20 rounded-full border border-emerald-500/30">
                                                        <span className="text-lg font-semibold text-emerald-300">₹{price}</span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-4">
                                                    <div className="flex items-center bg-slate-700/50 rounded-2xl p-1 border border-emerald-500/20">
                                                        <button
                                                            onClick={() => handleDecrease(item)}
                                                            className="w-10 h-10 flex items-center justify-center bg-slate-600/50 rounded-xl shadow-sm hover:shadow-md hover:bg-red-500/20 hover:text-red-400 hover:border-red-400/30 transition-all duration-200 border border-transparent"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4"></path>
                                                            </svg>
                                                        </button>
                                                        <span className="w-12 text-center font-bold text-lg text-white">{qty}</span>
                                                        <button
                                                            onClick={() => handleIncrease(item)}
                                                            className="w-10 h-10 flex items-center justify-center bg-slate-600/50 rounded-xl shadow-sm hover:shadow-md hover:bg-emerald-500/20 hover:text-emerald-400 hover:border-emerald-400/30 transition-all duration-200 border border-transparent"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth="2"
                                                                    d="M12 4v16m8-8H4"
                                                                ></path>
                                                            </svg>
                                                        </button>
                                                    </div>

                                                    <button
                                                        onClick={() => handleRemove(item)}
                                                        className="px-4 py-2 bg-gradient-to-r from-red-500/80 to-red-600/80 hover:from-red-500 hover:to-red-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg hover:shadow-red-500/20 transform hover:scale-105 transition-all duration-200 border border-red-400/30"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth="2"
                                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                            ></path>
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-slate-800/90 to-blue-900/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-emerald-500/20">
                            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                                {/* Total Amount Card */}
                                <div className="flex-shrink-0">
                                    <div className="bg-gradient-to-br from-slate-700/80 to-teal-800/80 backdrop-blur-sm rounded-2xl p-8 border border-emerald-500/30 shadow-xl">
                                        <p className="text-emerald-300 font-medium text-lg mb-3">Total Amount</p>
                                        <div className="space-y-3">
                                            <p className="text-5xl font-bold text-emerald-400">₹{totalPrice}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Checkout Button */}
                                <div className="flex-1 lg:max-w-md">
                                    <button
                                        onClick={handleCheckout}
                                        className="w-full px-8 py-6 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold text-xl rounded-2xl shadow-lg hover:shadow-xl hover:shadow-emerald-500/20 transform hover:scale-105 transition-all duration-300 border border-emerald-400/30"
                                    >
                                        <div className="flex items-center justify-center space-x-4">
                                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                                                ></path>
                                            </svg>
                                            <span>Proceed to Checkout</span>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default CartPage
