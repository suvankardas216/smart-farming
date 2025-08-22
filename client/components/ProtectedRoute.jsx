import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { user, loading } = useContext(AuthContext);

    if (loading) return <div>Loading...</div>;

    if (!user) return <Navigate to="/logout-home" replace />;

    // Block non-admins from admin pages
    if (adminOnly && user.role !== "admin") return <Navigate to="/" replace />;

    // Block admins from user pages
    if (!adminOnly && user.role === "admin") return <Navigate to="/admin" replace />;

    return children;
};

export default ProtectedRoute;
