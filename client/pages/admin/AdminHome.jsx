import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";

const AdminHome = () => {
    const [admin, setAdmin] = useState(null);
    const [stats, setStats] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data: adminData } = await axiosInstance.get("/user/profile");
                setAdmin(adminData);

                // Fetch stats
                const { data: statsData } = await axiosInstance.get("/admin/stats");
                setStats(statsData);
            } catch (error) {
                console.error("Error fetching admin home data:", error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            
            <div className="flex-1 p-8">
                
                <div className="mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                        Admin Dashboard
                    </h1>
                    <p className="text-gray-600 text-lg">Welcome back! Here's what's happening with your platform.</p>
                </div>

                {admin ? (
                    /* <CHANGE> Modern card design with gradient border and better layout */
                    <div className="mb-8 relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur opacity-20"></div>
                        <div className="relative bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-xl p-8">
                            <div className="flex items-center gap-4 mb-6">
                                {/* <CHANGE> Added admin avatar */}
                                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                                    {admin.user.name?.charAt(0) || 'A'}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800">Admin Profile</h2>
                                    <p className="text-gray-600">System Administrator</p>
                                </div>
                            </div>

                            {/* <CHANGE> Grid layout for admin details with icons */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 font-medium">Full Name</p>
                                        <p className="text-gray-800 font-semibold">{admin.user.name}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                                    <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 font-medium">Email Address</p>
                                        <p className="text-gray-800 font-semibold">{admin.user.email}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                                    <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 font-medium">Role</p>
                                        <p className="text-gray-800 font-semibold capitalize">{admin.user.role}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl">
                                    <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 font-medium">Location</p>
                                        <p className="text-gray-800 font-semibold">{admin.user.location}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl md:col-span-2">
                                    <div className="w-10 h-10 bg-teal-500 rounded-lg flex items-center justify-center">
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 font-medium">Language</p>
                                        <p className="text-gray-800 font-semibold capitalize">{admin.user.language}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    
                    <div className="mb-8 bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-xl p-8">
                        <div className="animate-pulse">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
                                <div>
                                    <div className="h-6 bg-gray-300 rounded w-32 mb-2"></div>
                                    <div className="h-4 bg-gray-300 rounded w-24"></div>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="p-4 bg-gray-100 rounded-xl">
                                        <div className="h-4 bg-gray-300 rounded w-20 mb-2"></div>
                                        <div className="h-5 bg-gray-300 rounded w-32"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                
                <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-2xl blur opacity-20"></div>
                    <div className="relative bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-xl p-8">
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">Platform Statistics</h2>
                            <p className="text-gray-600">Real-time overview of your platform's performance</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="group p-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl text-white transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                        </svg>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-3xl font-bold">{stats.users ?? "0"}</p>
                                        <p className="text-blue-100 text-sm">Total Users</p>
                                    </div>
                                </div>
                            </div>

                            <div className="group p-6 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl text-white transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                        </svg>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-3xl font-bold">{stats.products ?? "0"}</p>
                                        <p className="text-emerald-100 text-sm">Products</p>
                                    </div>
                                </div>
                                
                            </div>

                            <div className="group p-6 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl text-white transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                        </svg>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-3xl font-bold">{stats.orders ?? "0"}</p>
                                        <p className="text-purple-100 text-sm">Orders</p>
                                    </div>
                                </div>
                                
                            </div>

                            <div className="group p-6 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl text-white transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                                        </svg>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-3xl font-bold">{stats.advisories ?? "0"}</p>
                                        <p className="text-orange-100 text-sm">Advisories</p>
                                    </div>
                                </div>
                                
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminHome;
