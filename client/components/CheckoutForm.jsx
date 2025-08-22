"use client"
import { useState } from "react"
import { useLocation, useNavigate, Link } from "react-router-dom"
import axiosInstance from "../utils/axiosInstance"
import { loadStripe } from "@stripe/stripe-js"
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { clearCart } from "../services/cartService"

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)

const CheckoutForm = ({ cartItems, setCartItems }) => {
    const stripe = useStripe()
    const elements = useElements()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [paymentMethod, setPaymentMethod] = useState("card")


    const subtotal = cartItems.reduce((sum, item) => {
        const price = item.price || item.product?.price || 0
        const quantity = item.quantity || 1
        return sum + price * quantity
    }, 0)
    const tax = subtotal * 0.08
    const shipping = subtotal > 50 ? 0 : 9.99
    const total = subtotal + tax + shipping

    const handleCheckout = async (e) => {
        e.preventDefault()
        if (!stripe && paymentMethod === "card") return

        try {
            setLoading(true)
            setError("")

            let paymentStatus = "pending"

            if (paymentMethod === "card") {
                const { data } = await axiosInstance.post("/orders/create-payment-intent", { items: cartItems })
                const clientSecret = data.clientSecret

                const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                    payment_method: { card: elements.getElement(CardElement) },
                })

                if (stripeError) {
                    setError(stripeError.message)
                    setLoading(false)
                    return
                }

                if (paymentIntent.status === "succeeded") {
                    paymentStatus = "paid"
                }
            }

            await axiosInstance.post("/orders", {
                items: cartItems,
                paymentMethod,
                paymentStatus,
            })

            await clearCart()


            const event = new CustomEvent("cartUpdated", { detail: { items: [] } })
            window.dispatchEvent(event)

            navigate("/my-orders", { state: { orderSuccess: true } })

        } catch (err) {
            console.error(err)
            setError("Checkout failed! Please try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="h-screen mt-15 bg-gradient-to-br from-green-50 via-white to-blue-50 py-8">

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Link
                    to="/cart"
                    className="inline-flex mb-3 items-center px-3 py-1.5 text-sm font-medium text-black bg-white rounded-md shadow hover:bg-gray-100 transition"
                >
                    ← Back
                </Link>
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Secure Checkout</h1>
                    <p className="text-gray-600">Complete your order with confidence</p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
                            <div className="bg-gradient-to-r from-green-600 to-green-700 px-8 py-6">
                                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                                        />
                                    </svg>
                                    Payment Method
                                </h2>
                                <p className="text-green-100 mt-1">Choose your preferred payment option</p>
                            </div>

                            <div className="p-8">
                                <div className="grid grid-cols-2 gap-4 mb-8">
                                    <label
                                        className={`relative cursor-pointer rounded-xl border-2 p-6 transition-all duration-200 ${paymentMethod === "card"
                                            ? "border-green-500 bg-green-50 shadow-lg"
                                            : "border-gray-200 hover:border-gray-300"
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            value="card"
                                            checked={paymentMethod === "card"}
                                            onChange={() => setPaymentMethod("card")}
                                            className="sr-only"
                                        />
                                        <div className="flex flex-col items-center text-center">
                                            <svg className="w-8 h-8 mb-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                                                />
                                            </svg>
                                            <span className="font-semibold text-gray-900">Credit/Debit Card</span>
                                            <span className="text-sm text-gray-500 mt-1">Secure online payment</span>
                                        </div>
                                        {paymentMethod === "card" && (
                                            <div className="absolute top-3 right-3">
                                                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </div>
                                            </div>
                                        )}
                                    </label>

                                    <label
                                        className={`relative cursor-pointer rounded-xl border-2 p-6 transition-all duration-200 ${paymentMethod === "cod"
                                            ? "border-green-500 bg-green-50 shadow-lg"
                                            : "border-gray-200 hover:border-gray-300"
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            value="cod"
                                            checked={paymentMethod === "cod"}
                                            onChange={() => setPaymentMethod("cod")}
                                            className="sr-only"
                                        />
                                        <div className="flex flex-col items-center text-center">
                                            <svg
                                                className="w-8 h-8 mb-3 text-green-600"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                                                />
                                            </svg>
                                            <span className="font-semibold text-gray-900">Cash on Delivery</span>
                                            <span className="text-sm text-gray-500 mt-1">Pay when you receive</span>
                                        </div>
                                        {paymentMethod === "cod" && (
                                            <div className="absolute top-3 right-3">
                                                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </div>
                                            </div>
                                        )}
                                    </label>
                                </div>

                                <form onSubmit={handleCheckout} className="space-y-6">
                                    {paymentMethod === "card" && (
                                        <div className="space-y-4">
                                            <div className="relative">
                                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur opacity-20"></div>
                                                <div className="relative bg-white p-6 border-2 border-gray-200 rounded-xl focus-within:border-green-500 transition-colors shadow-lg">
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Card Information</label>
                                                    <CardElement
                                                        options={{
                                                            style: {
                                                                base: {
                                                                    fontSize: "16px",
                                                                    color: "#374151",
                                                                    fontFamily: "system-ui, sans-serif",
                                                                    "::placeholder": { color: "#9CA3AF" },
                                                                },
                                                            },
                                                        }}
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-center space-x-4 py-4">
                                                <div className="flex items-center space-x-2 text-sm text-gray-600">
                                                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                                        />
                                                    </svg>
                                                    <span>SSL Secured</span>
                                                </div>
                                                <div className="flex items-center space-x-2 text-sm text-gray-600">
                                                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                                        />
                                                    </svg>
                                                    <span>256-bit Encryption</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {paymentMethod === "cod" && (
                                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                                            <div className="flex items-start space-x-3">
                                                <svg
                                                    className="w-6 h-6 text-amber-600 mt-0.5"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                    />
                                                </svg>
                                                <div>
                                                    <h4 className="font-semibold text-amber-800 mb-2">Cash on Delivery Instructions</h4>
                                                    <ul className="text-sm text-amber-700 space-y-1">
                                                        <li>• Payment will be collected upon delivery</li>
                                                        <li>• Please keep exact change ready</li>
                                                        <li>• Delivery within 3-5 business days</li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {error && (
                                        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                                            <div className="flex items-center space-x-3">
                                                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                    />
                                                </svg>
                                                <p className="text-red-700 font-medium">{error}</p>
                                            </div>
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={loading || (paymentMethod === "card" && !stripe)}
                                        className="w-full relative overflow-hidden bg-gradient-to-r from-green-600 to-green-700 text-white py-4 px-6 rounded-xl font-semibold text-lg shadow-lg hover:from-green-700 hover:to-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                                    >
                                        {loading ? (
                                            <div className="flex items-center justify-center space-x-2">
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                <span>Processing...</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-center space-x-2">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                                    />
                                                </svg>
                                                <span>{paymentMethod === "cod" ? "Place Order" : `Pay $${total.toFixed(2)}`}</span>
                                            </div>
                                        )}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden sticky top-8">
                            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-6">
                                <h2 className="text-xl font-bold text-white flex items-center gap-3">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                        />
                                    </svg>
                                    Order Summary
                                </h2>
                                <p className="text-blue-100 text-sm mt-1">{cartItems.length} items in your cart</p>
                            </div>

                            <div className="p-6">
                                <div className="space-y-4 mb-6">
                                    {cartItems.map((item, index) => {
                                        const product = item.product || {}
                                        const name = product.name || item.name || "Unknown Product"
                                        const price = product.price || item.price || 0
                                        const quantity = item.quantity || 1

                                        return (
                                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                <div className="flex-1">
                                                    <h4 className="font-medium text-gray-900 text-sm">{name}</h4>
                                                    <p className="text-gray-500 text-xs">Qty: {quantity}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-semibold text-gray-900">${(price * quantity).toFixed(2)}</p>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>

                                <div className="space-y-3 border-t border-gray-200 pt-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Subtotal</span>
                                        <span className="font-medium">${subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Tax (8%)</span>
                                        <span className="font-medium">${tax.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Shipping</span>
                                        <span className="font-medium">
                                            {shipping === 0 ? <span className="text-green-600">Free</span> : `$${shipping.toFixed(2)}`}
                                        </span>
                                    </div>
                                    <div className="border-t border-gray-200 pt-3">
                                        <div className="flex justify-between">
                                            <span className="text-lg font-bold text-gray-900">Total</span>
                                            <span className="text-lg font-bold text-green-600">${total.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 pt-4 border-t border-gray-200">
                                    <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
                                        <div className="flex items-center space-x-1">
                                            <svg className="w-3 h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                                />
                                            </svg>
                                            <span>Secure</span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <svg className="w-3 h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                                />
                                            </svg>
                                            <span>Encrypted</span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <svg className="w-3 h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M13 10V3L4 14h7v7l9-11h-7z"
                                                />
                                            </svg>
                                            <span>Fast</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CheckoutForm
