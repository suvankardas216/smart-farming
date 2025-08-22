"use client"
import { Link, useNavigate } from "react-router-dom"
import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../context/AuthContext"
import { setAuthToken } from "../services/api"
import axiosInstance from "../utils/axiosInstance"

import cart from "../src/assets/shopping-cart.svg"
import home from "../src/assets/home.svg"
import gov from "../src/assets/government.svg"
import market from "../src/assets/market.svg"
import weather from "../src/assets/atmospheric-conditions.svg"
import forums from "../src/assets/group.svg"
import resources from "../src/assets/resources.svg"
import profile from "../src/assets/farmer.svg"
import more from "../src/assets/add-item.svg"
import ai from "../src/assets/agriculture.svg"
import advice from "../src/assets/advice.svg"
import plant from "../src/assets/plant.svg"
import icon from "../src/assets/icon.svg"
import orders from "../src/assets/orders.svg"
import laboratory from "../src/assets/laboratory.svg"
import analytics from "../src/assets/analytics.svg"


const Navbar = () => {
    const { user, logout } = useContext(AuthContext)
    const [username, setUsername] = useState("")
    const [cartCount, setCartCount] = useState(0)
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const navigate = useNavigate()

    const handleLogout = () => {
        setAuthToken(null)
        localStorage.removeItem("user")
        logout?.()
        navigate("/logout-home")
        window.location.reload();
    }

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axiosInstance.get("/user/profile")
                setUsername(res.data.user.name)
            } catch (err) {
                console.error("Failed to fetch user:", err)
            }
        }

        fetchUser()
    }, [])

    useEffect(() => {
        const fetchCart = async () => {
            if (!user) {
                setCartCount(0)
                return
            }
            try {
                const res = await axiosInstance.get("/cart")
                const count = res.data.items.reduce((acc, item) => acc + item.quantity, 0)
                setCartCount(count)
            } catch (err) {
                console.error(err)
            }
        }

        fetchCart()

        const handleCartUpdate = (e) => {
            const updatedCart = e.detail
            const count = updatedCart.items.reduce((acc, item) => acc + item.quantity, 0)
            setCartCount(count)
        }

        window.addEventListener("cartUpdated", handleCartUpdate)

        return () => {
            window.removeEventListener("cartUpdated", handleCartUpdate)
        }
    }, [user])

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest(".dropdown-container")) {
                setIsDropdownOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    return (
        <nav className="fixed top-0 w-full z-50 bg-gradient-to-r from-slate-900 via-gray-900 to-slate-900 backdrop-blur-xl bg-opacity-95 text-white shadow-2xl border-b border-emerald-500/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-18">
                    {/* Logo Section */}
                    <div className="flex items-center">
                        <Link
                            to="/"
                            className="text-2xl flex items-center justify-center gap-3 font-bold bg-gradient-to-r from-emerald-400 via-green-300 to-emerald-400 bg-clip-text text-transparent hover:from-green-300 hover:via-emerald-400 hover:to-green-300 transition-all duration-500 transform hover:scale-105"
                        >
                            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                                <img src={icon} alt="" />
                            </div>
                            Smart Farming
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-2">
                        <Link
                            to="/"
                            className="px-4 py-2.5 flex items-center gap-2 rounded-xl text-white/90 hover:text-white hover:bg-gradient-to-r hover:from-emerald-500/20 hover:to-green-500/20 transition-all duration-300 font-medium border border-transparent hover:border-emerald-500/30 backdrop-blur-sm"
                        >
                            <img src={home || "/placeholder.svg"} alt="home" className="h-5 w-5 opacity-80" />
                            Home
                        </Link>
                        <Link
                            to="/marketplace"
                            className="px-4 py-2.5 flex items-center gap-2 rounded-xl text-white/90 hover:text-white hover:bg-gradient-to-r hover:from-emerald-500/20 hover:to-green-500/20 transition-all duration-300 font-medium border border-transparent hover:border-emerald-500/30 backdrop-blur-sm"
                        >
                            <img src={market || "/placeholder.svg"} alt="market" className="h-5 w-5 opacity-80" />
                            Marketplace
                        </Link>
                        <Link
                            to="/weather"
                            className="px-4 py-2.5 flex items-center gap-2 rounded-xl text-white/90 hover:text-white hover:bg-gradient-to-r hover:from-emerald-500/20 hover:to-green-500/20 transition-all duration-300 font-medium border border-transparent hover:border-emerald-500/30 backdrop-blur-sm"
                        >
                            <img src={weather || "/placeholder.svg"} alt="weather" className="h-5 w-5 opacity-80" />
                            Weather
                        </Link>

                        {/* Enhanced Dropdown */}
                        <div className="relative dropdown-container">
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="px-4 py-2.5 flex items-center gap-2 rounded-xl text-white/90 hover:text-white hover:bg-gradient-to-r hover:from-emerald-500/20 hover:to-green-500/20 transition-all duration-300 font-medium border border-transparent hover:border-emerald-500/30 backdrop-blur-sm"
                            >
                                <img src={more || "/placeholder.svg"} alt="more" className="h-5 w-5 opacity-80" />
                                More Options
                                <svg
                                    className={`h-4 w-4 transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : ""}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {isDropdownOpen && (
                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-3 bg-gradient-to-br from-slate-800/95 to-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-emerald-500/20 p-2 z-50 min-w-max">
                                    <div className="grid grid-cols-2 gap-1">
                                        <Link
                                            to="/schemes"
                                            className="px-4 py-3 flex items-center gap-3 text-white/90 hover:text-white hover:bg-gradient-to-r hover:from-emerald-500/20 hover:to-green-500/20 transition-all duration-300 font-medium rounded-xl border border-transparent hover:border-emerald-500/30"
                                            onClick={() => setIsDropdownOpen(false)}
                                        >
                                            <img src={gov || "/placeholder.svg"} alt="gov" className="h-5 w-5 opacity-80" />
                                            Schemes
                                        </Link>
                                        <Link
                                            to="/forum"
                                            className="px-4 py-3 flex items-center gap-3 text-white/90 hover:text-white hover:bg-gradient-to-r hover:from-emerald-500/20 hover:to-green-500/20 transition-all duration-300 font-medium rounded-xl border border-transparent hover:border-emerald-500/30"
                                            onClick={() => setIsDropdownOpen(false)}
                                        >
                                            <img src={forums || "/placeholder.svg"} alt="forums" className="h-5 w-5 opacity-80" />
                                            Forum
                                        </Link>
                                        <Link
                                            to="/resources"
                                            className="px-4 py-3 flex items-center gap-3 text-white/90 hover:text-white hover:bg-gradient-to-r hover:from-emerald-500/20 hover:to-green-500/20 transition-all duration-300 font-medium rounded-xl border border-transparent hover:border-emerald-500/30"
                                            onClick={() => setIsDropdownOpen(false)}
                                        >
                                            <img src={resources || "/placeholder.svg"} alt="resources" className="h-5 w-5 opacity-80" />
                                            Resources
                                        </Link>
                                        <Link
                                            to="/profile"
                                            className="px-4 py-3 flex items-center gap-3 text-white/90 hover:text-white hover:bg-gradient-to-r hover:from-emerald-500/20 hover:to-green-500/20 transition-all duration-300 font-medium rounded-xl border border-transparent hover:border-emerald-500/30"
                                            onClick={() => setIsDropdownOpen(false)}
                                        >
                                            <img src={profile || "/placeholder.svg"} alt="profile" className="h-5 w-5 opacity-80" />
                                            Profile
                                        </Link>
                                        <Link
                                            to="/pest-detection"
                                            className="px-4 py-3 flex items-center justify-center gap-3 text-white/90 hover:text-white hover:bg-gradient-to-r hover:from-emerald-500/20 hover:to-green-500/20 transition-all duration-300 font-medium rounded-xl border border-transparent hover:border-emerald-500/30 whitespace-nowrap col-span-2"
                                            onClick={() => setIsDropdownOpen(false)}
                                        >
                                            <img src={ai || "/placeholder.svg"} alt="ai" className="h-5 w-5 opacity-80" />
                                            AI Disease Detection
                                        </Link>
                                        <Link
                                            to="/advisory"
                                            className="px-4 py-3 flex items-center gap-3 text-white/90 hover:text-white hover:bg-gradient-to-r hover:from-emerald-500/20 hover:to-green-500/20 transition-all duration-300 font-medium rounded-xl border border-transparent hover:border-emerald-500/30 whitespace-nowrap"
                                            onClick={() => setIsDropdownOpen(false)}
                                        >
                                            <img src={advice || "/placeholder.svg"} alt="advice" className="h-5 w-5 opacity-80" />
                                            Expert Advisory
                                        </Link>
                                        <Link
                                            to="/soil-tests"
                                            className="px-4 py-3 flex items-center gap-3 text-white/90 hover:text-white hover:bg-gradient-to-r hover:from-emerald-500/20 hover:to-green-500/20 transition-all duration-300 font-medium rounded-xl border border-transparent hover:border-emerald-500/30 whitespace-nowrap"
                                            onClick={() => setIsDropdownOpen(false)}
                                        >
                                            <img src={plant || "/placeholder.svg"} alt="soil-test" className="h-5 w-5 opacity-80" />
                                            Soil Test
                                        </Link>
                                        <Link
                                            to="/location"
                                            className="px-4 py-3 flex items-center justify-center gap-3 text-white/90 hover:text-white hover:bg-gradient-to-r hover:from-emerald-500/20 hover:to-green-500/20 transition-all duration-300 font-medium rounded-xl border border-transparent hover:border-emerald-500/30 whitespace-nowrap col-span-2"
                                            onClick={() => setIsDropdownOpen(false)}
                                        >
                                            <img src={laboratory || "/placeholder.svg"} alt="laboratory" className="h-5 w-5 opacity-80" />
                                            Lab Test Locations (Soil & Water)
                                        </Link>

                                        <Link
                                            to="/farm-analytics"
                                            className="px-4 py-3 flex items-center gap-3 text-white/90 hover:text-white hover:bg-gradient-to-r hover:from-emerald-500/20 hover:to-green-500/20 transition-all duration-300 font-medium rounded-xl border border-transparent hover:border-emerald-500/30 whitespace-nowrap"
                                            onClick={() => setIsDropdownOpen(false)}
                                        >
                                            <img src={analytics || "/placeholder.svg"} alt="analytics" className="h-5 w-5 opacity-80" />
                                            Farm Analytics
                                        </Link>
                                        <Link
                                            to="/my-orders"
                                            className="px-4 py-3 flex items-center gap-3 text-white/90 hover:text-white hover:bg-gradient-to-r hover:from-emerald-500/20 hover:to-green-500/20 transition-all duration-300 font-medium rounded-xl border border-transparent hover:border-emerald-500/30 whitespace-nowrap"
                                            onClick={() => setIsDropdownOpen(false)}
                                        >
                                            <img src={orders || "/placeholder.svg"} alt="orders" className="h-5 w-5 opacity-80" />
                                            Your Orders
                                        </Link>
                                    </div>
                                </div>

                            )}
                        </div>
                    </div>

                    {/* Right Side Actions */}
                    <div className="flex items-center space-x-4">
                        {/* Enhanced Cart */}
                        <Link
                            to="/cart"
                            className="relative p-3 rounded-xl bg-gradient-to-br from-emerald-500/20 to-green-500/20 hover:from-emerald-500/30 hover:to-green-500/30 transition-all duration-300 group border border-emerald-500/30 hover:border-emerald-400/50 backdrop-blur-sm"
                            title="Shopping Cart"
                        >
                            <img src={cart || "/placeholder.svg"} alt="cart" className="h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
                            {cartCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold shadow-lg border-2 border-white">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        {/* Enhanced Auth Section */}
                        {user ? (
                            <div className="flex items-center space-x-4">
                                <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500/10 to-green-500/10 rounded-xl border border-emerald-500/20">
                                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                                    <span className="text-white/90 font-medium">Welcome {username}</span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 px-6 py-2.5 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border border-red-400/20 hover:border-red-300/40"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <Link
                                to="/login"
                                className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 px-6 py-2.5 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border border-emerald-400/20 hover:border-emerald-300/40"
                            >
                                Login
                            </Link>
                        )}
                    </div>
                </div>

                {/* Enhanced Mobile Navigation */}
                <div className="md:hidden pb-4">
                    <div className="flex flex-wrap gap-2 mt-4 p-4 bg-gradient-to-r from-slate-800/50 to-gray-800/50 rounded-2xl border border-emerald-500/20 backdrop-blur-sm">
                        <Link
                            to="/"
                            className="px-3 py-2 rounded-lg text-white/90 hover:text-white hover:bg-gradient-to-r hover:from-emerald-500/20 hover:to-green-500/20 transition-all duration-300 text-sm font-medium border border-transparent hover:border-emerald-500/30"
                        >
                            Home
                        </Link>
                        <Link
                            to="/marketplace"
                            className="px-3 py-2 rounded-lg text-white/90 hover:text-white hover:bg-gradient-to-r hover:from-emerald-500/20 hover:to-green-500/20 transition-all duration-300 text-sm font-medium border border-transparent hover:border-emerald-500/30"
                        >
                            Marketplace
                        </Link>
                        <Link
                            to="/weather"
                            className="px-3 py-2 rounded-lg text-white/90 hover:text-white hover:bg-gradient-to-r hover:from-emerald-500/20 hover:to-green-500/20 transition-all duration-300 text-sm font-medium border border-transparent hover:border-emerald-500/30"
                        >
                            Weather
                        </Link>
                        <Link
                            to="/schemes"
                            className="px-3 py-2 rounded-lg text-white/90 hover:text-white hover:bg-gradient-to-r hover:from-emerald-500/20 hover:to-green-500/20 transition-all duration-300 text-sm font-medium border border-transparent hover:border-emerald-500/30"
                        >
                            Schemes
                        </Link>
                        <Link
                            to="/forum"
                            className="px-3 py-2 rounded-lg text-white/90 hover:text-white hover:bg-gradient-to-r hover:from-emerald-500/20 hover:to-green-500/20 transition-all duration-300 text-sm font-medium border border-transparent hover:border-emerald-500/30"
                        >
                            Forum
                        </Link>
                        <Link
                            to="/resources"
                            className="px-3 py-2 rounded-lg text-white/90 hover:text-white hover:bg-gradient-to-r hover:from-emerald-500/20 hover:to-green-500/20 transition-all duration-300 text-sm font-medium border border-transparent hover:border-emerald-500/30"
                        >
                            Resources
                        </Link>
                        <Link
                            to="/profile"
                            className="px-3 py-2 rounded-lg text-white/90 hover:text-white hover:bg-gradient-to-r hover:from-emerald-500/20 hover:to-green-500/20 transition-all duration-300 text-sm font-medium border border-transparent hover:border-emerald-500/30"
                        >
                            Profile
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar