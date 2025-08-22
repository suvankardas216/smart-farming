"use client"

import { useEffect, useState } from "react"
import ProtectedRoute from "../components/ProtectedRoute"
import axiosInstance from "../utils/axiosInstance"
import { Link } from "react-router-dom"

const MyOrdersPage = () => {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const { data } = await axiosInstance.get("/orders/my-orders")
                setOrders(data)
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        fetchOrders()
    }, [])

    const handleCancel = async (orderId) => {
        try {
            const confirmCancel = window.confirm("Are you sure you want to cancel this order?")
            if (!confirmCancel) return

            const { data } = await axiosInstance.put(`/orders/cancel/${orderId}`)
            alert("Order cancelled successfully!")
            // Update local state to reflect cancellation
            setOrders((prev) => prev.map((o) => (o._id === orderId ? data.order : o)))
        } catch (err) {
            console.error(err)
            alert("Failed to cancel the order. Please try again.")
        }
    }

    if (loading)
        return (
            <div className="min-h-screen  bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                    <p className="text-lg text-gray-600">Loading your orders...</p>
                </div>
            </div>
        )

    if (orders.length === 0)
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
                <div className="max-w-4xl mx-auto p-6">
                    <div className="text-center py-16">
                        <div className="w-24 h-24 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
                            <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                                />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">No Orders Yet</h2>
                        <p className="text-gray-600 mb-8 max-w-md mx-auto">
                            You haven't placed any orders yet. Start shopping for farming supplies and equipment!
                        </p>
                        <Link
                            to="/marketplace"
                            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
                        >
                            Start Shopping
                        </Link>
                    </div>
                </div>
            </div>
        )

    const getStatusInfo = (status) => {
        switch (status?.toLowerCase()) {
            case "pending":
                return { color: "bg-yellow-100 text-yellow-800", icon: "⏳", label: "Pending" }
            case "processing":
                return { color: "bg-blue-100 text-blue-800", icon: "⚙️", label: "Processing" }
            case "shipped":
                return { color: "bg-purple-100 text-purple-800", icon: "🚚", label: "Shipped" }
            case "delivered":
                return { color: "bg-green-100 text-green-800", icon: "✅", label: "Delivered" }
            case "cancelled":
                return { color: "bg-red-100 text-red-800", icon: "❌", label: "Cancelled" }
            default:
                return { color: "bg-gray-100 text-gray-800", icon: "📦", label: status || "Unknown" }
        }
    }

    const formatDate = (dateString) => {
        if (!dateString) return "N/A"
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        })
    }

    return (
        <div className="min-h-screen mt-15 bg-gradient-to-br from-green-50 to-blue-50">
            <div className="max-w-6xl mx-auto p-6">
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-800 mb-2">My Orders</h1>
                            <p className="text-gray-600">Track and manage your farming supply orders</p>
                        </div>
                        <div className="bg-white rounded-lg p-4 shadow-sm border">
                            <div className="text-2xl font-bold text-green-600">{orders.length}</div>
                            <div className="text-sm text-gray-500">Total Orders</div>
                        </div>
                    </div>
                </div>

                <div className="grid gap-6">
                    {orders.map((order) => {
                        const statusInfo = getStatusInfo(order.deliveryStatus)
                        return (
                            <div key={order._id} className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow">
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                                                    />
                                                </svg>
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-800">Order #{order._id?.slice(-8) || "N/A"}</h3>
                                                <p className="text-sm text-gray-500">Placed on {formatDate(order.createdAt)}</p>
                                            </div>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}>
                                            {statusInfo.icon} {statusInfo.label}
                                        </span>
                                    </div>

                                    <div className="grid md:grid-cols-3 gap-4 mb-4">
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <div className="text-sm text-gray-500 mb-1">Total Amount</div>
                                            <div className="text-xl font-bold text-gray-800">₹{order.totalPrice || "0"}</div>
                                        </div>
                                        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                                            <div className="text-sm text-blue-600 mb-1 font-medium">Total Items</div>
                                            <div className="text-xl font-bold text-blue-800">{order.items?.length || 0} Items</div>
                                        </div>
                                        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                                            <div className="text-sm text-green-600 mb-1 font-medium">Payment Method</div>
                                            <div className="text-lg font-semibold text-green-800 capitalize">
                                                {order.paymentMethod === "cod" ? "Cash on Delivery" : order.paymentMethod || "Online Payment"}
                                            </div>
                                        </div>
                                    </div>

                                    {order.items && order.items.length > 0 && (
                                        <div className="mb-4">
                                            <div className="flex items-center justify-between mb-3">
                                                <h4 className="font-semibold text-gray-800">Order Items ({order.items.length})</h4>
                                                <span className="text-sm text-gray-500">
                                                    Showing {Math.min(order.items.length, 3)} of {order.items.length}
                                                </span>
                                            </div>
                                            <div className="space-y-2">
                                                {order.items.slice(0, 3).map((item, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg border"
                                                    >
                                                        <div className="flex items-center space-x-3">
                                                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                                                <span className="text-sm">📦</span>
                                                            </div>
                                                            <div>
                                                                <span className="font-medium text-gray-800">
                                                                    {item.product?.name || `Item ${index + 1}`}
                                                                </span>
                                                                <div className="text-xs text-gray-500">
                                                                    Product ID: {item.product?._id?.slice(-6) || "N/A"}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <div className="text-sm font-medium text-gray-800">₹{item.price || "0"}</div>
                                                            <div className="text-xs text-gray-500">Qty: {item.quantity || 1}</div>
                                                        </div>
                                                    </div>
                                                ))}
                                                {order.items.length > 3 && (
                                                    <div className="text-center py-3 bg-gray-50 rounded-lg border border-dashed">
                                                        <span className="text-sm text-gray-600 font-medium">
                                                            +{order.items.length - 3} more items
                                                        </span>
                                                        <button className="ml-2 text-green-600 hover:text-green-700 text-sm font-medium">
                                                            View All
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between pt-4 border-t">
                                        <div className="flex space-x-3">
                                            <button className="text-green-600 hover:text-green-700 text-sm font-medium">View Details</button>
                                            {order.deliveryStatus?.toLowerCase() === "delivered" && (
                                                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">Reorder</button>
                                            )}
                                        </div>
                                        <div className="flex space-x-2">
                                            {order.deliveryStatus?.toLowerCase() === "shipped" && (
                                                <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
                                                    Track Order
                                                </button>
                                            )}
                                            {["pending", "processing", "shipped"].includes(order.deliveryStatus?.toLowerCase()) && (
                                                <button
                                                    onClick={() => handleCancel(order._id)}
                                                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                                                >
                                                    Cancel Order
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default () => (
    <ProtectedRoute>
        <MyOrdersPage />
    </ProtectedRoute>
)
