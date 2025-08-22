import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../../components/admin/Sidebar";

const MainPage = () => {
    return (
        <div className="flex h-screen">
            <div className="w-64 bg-gray-900 text-white fixed h-screen">
                <Sidebar />
            </div>

            {/* Main content on right */}
            <div className="ml-64 flex-1 overflow-y-auto pl-7 bg-gray-100">
                <Outlet /> {/* Child pages render here */}
            </div>
        </div>
    );
};

export default MainPage;
