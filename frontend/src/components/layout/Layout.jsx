import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-brandDark transition-colors duration-300">
            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-8">
                {children || <Outlet />}
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
