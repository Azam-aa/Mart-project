import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { useCart } from "../../context/CartContext";
import { IconShoppingCart, IconUser, IconSun, IconMoon, IconLogout } from "@tabler/icons-react";

const Navbar = () => {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const { cartCount } = useCart();

    return (
        <nav className="sticky top-0 z-50 bg-white dark:bg-brandDark border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between relative">
                {/* Mobile Menu Button (Hamburger) - Optional, keeping simple for now */}

                {/* Logo - Centered on mobile/tablet, Left on large? Or always centered? User said "towards left", implying they point it out as a negative. let's Center it absolutely for now to make it distinct. */}
                <div className="absolute left-1/2 transform -translate-x-1/2">
                    <Link to={user ? "/dashboard" : "/"} className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600">Mart</span>App
                    </Link>
                </div>

                {/* Nothing on the left if logo is centered? Or maybe a spacer? */}
                <div className="flex items-center">
                </div>

                <div className="flex items-center space-x-4 md:space-x-6">
                    <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-300">
                        {theme === "dark" ? <IconSun size={20} /> : <IconMoon size={20} />}
                    </button>

                    {user ? (
                        <>
                            <Link to="/cart" className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-gray-600 dark:text-gray-300">
                                <IconShoppingCart size={20} />
                                {cartCount > 0 && (
                                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full shadow-sm ring-2 ring-white dark:ring-brandDark">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>

                            <div className="relative group">
                                <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300">
                                    <IconUser size={20} />
                                    <span className="hidden md:block font-medium">{user.username}</span>
                                </button>

                                {/* Dropdown */}
                                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-surface rounded-lg shadow-xl border border-gray-100 dark:border-gray-700 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-200 transform origin-top-right z-50">
                                    <div className="py-1">
                                        <Link to="/profile" className="block px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200">Profile</Link>
                                        <Link to="/orders" className="block px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200">My Orders</Link>
                                        {user.role === 'ADMIN' && (
                                            <Link to="/admin" className="block px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 text-blue-600 dark:text-blue-400">Admin Panel</Link>
                                        )}
                                        <button onClick={logout} className="w-full text-left px-4 py-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 flex items-center">
                                            <IconLogout size={16} className="mr-2" /> Logout
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center space-x-4">
                            <Link to="/login" className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 font-medium">Login</Link>
                            <Link to="/signup" className="px-5 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-black rounded-lg font-bold hover:opacity-90 transition-all">
                                Sign Up
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
