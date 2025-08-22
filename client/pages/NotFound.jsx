"use client"
import { Link } from "react-router-dom"
import notfound from "../src/assets/not-found.svg";

const NotFound = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
            <div className="max-w-md w-full text-center">
                {/* 404 Illustration */}
                <div className="mb-8">
                    <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center">
                        <img src={notfound} alt="not found" className="w-16 h-16"/>
                    </div>
                    <h1 className="text-6xl font-bold text-gray-900 mb-2">404</h1>
                </div>

                {/* Error Message */}
                <div className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-3">Page Not Found</h2>
                    <p className="text-lg md:text-xl text-gray-600 max-w-md mx-auto leading-relaxed">
                        The page you're looking for seems to have wandered off into the digital wilderness.
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-4">
                    <Link
                        to="/"
                        className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                            />
                        </svg>
                        Go Back Home
                    </Link>

                    <button
                        onClick={() => window.history.back()}
                        className="w-full inline-flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Go Back
                    </button>
                </div>

                
            </div>
        </div>
    )
}

export default NotFound

