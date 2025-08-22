"use client"

import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { loginUser } from "../services/authService"
import { setAuthToken } from "../services/api"
import { AuthContext } from "../context/AuthContext"
import { useContext } from "react"

const Login = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()
    const { login } = useContext(AuthContext)

    const handleLogin = async (e) => {
        e.preventDefault()
        setError("")
        setIsLoading(true)

        try {
            const data = await loginUser(email, password)

            // Attach token to all requests
            setAuthToken(data.token)

            // Use context login to update state & localStorage
            login(data)

            // Refresh page after login
            window.location.reload();

            // Navigate to home/profile
            navigate("/") 
        } catch (err) {
            console.error(err)
            setError(err.response?.data?.message || "Invalid credentials. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5 px-4">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <div className="mx-auto h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                        <svg className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                            />
                        </svg>
                    </div>
                    <h2 className="font-serif text-3xl font-bold text-foreground mb-2">Welcome back</h2>
                    <p className="text-muted-foreground">Sign in to your Smart Farming account</p>
                </div>

                <div className="bg-card rounded-xl shadow-lg border border-border p-8">
                    {error && (
                        <div className="mb-4 text-destructive-foreground text-sm font-medium bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                                Email address
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200 outline-none text-foreground placeholder:text-muted-foreground"
                                placeholder="Enter your email"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200 outline-none text-foreground placeholder:text-muted-foreground"
                                placeholder="Enter your password"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-primary-foreground font-semibold py-3 px-4 rounded-lg transition-all duration-200 focus:ring-2 focus:ring-ring focus:ring-offset-2 outline-none disabled:cursor-not-allowed"
                        >
                            {isLoading ? "Signing in..." : "Sign in"}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <a
                            href="#"
                            className="text-sm text-accent hover:text-accent/80 transition-colors duration-200 underline-offset-4 hover:underline"
                        >
                            Forgot your password?
                        </a>
                    </div>
                </div>

                <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                        Don't have an account?{" "}
                        <Link
                            to="/register"
                            className="text-blue-500 hover:text-accent/80 font-medium transition-colors duration-200 underline-offset-4 hover:underline"
                        >
                            Create account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Login
