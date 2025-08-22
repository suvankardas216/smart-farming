"use client"
import { useState } from "react"
import { useLocation, Link } from "react-router-dom"
import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import CheckoutForm from "../components/CheckoutForm"

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)

const CheckoutPage = () => {
    const location = useLocation()

    // Ensure cartItems is always an array
    const [cartItems, setCartItems] = useState(Array.isArray(location.state?.cartItems) ? location.state.cartItems : []);

    if (cartItems.length === 0) {
        return (
            <div className="h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center">
                
                <div className="text-center p-8 bg-pink-700 rounded-3xl shadow-2xl border border-gray-100 max-w-md mx-4">
                    <div className="relative mb-6">
                        <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-500 rounded-full blur opacity-20"></div>
                        <div className="relative bg-gray-100 rounded-full p-6 w-24 h-24 mx-auto flex items-center justify-center">
                            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                                />
                            </svg>
                        </div>
                    </div>

                    <h2 className="text-3xl font-bold text-gray-900 mb-3">Your cart is empty</h2>
                    <p className="text-gray-600 mb-8 leading-relaxed">
                        Discover our premium farming supplies and equipment to boost your agricultural success
                    </p>

                    <Link
                        to="/marketplace"
                        className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-semibold shadow-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 transform hover:scale-105 active:scale-95"
                    >
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                            />
                        </svg>
                        Start Shopping
                    </Link>

                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
                            <div className="flex items-center space-x-2">
                                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span>Quality Products</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                <span>Fast Delivery</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <Elements stripe={stripePromise}>
            <CheckoutForm cartItems={cartItems} setCartItems={setCartItems} />
        </Elements>
    )
}

export default CheckoutPage
