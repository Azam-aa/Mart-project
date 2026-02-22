import React from "react";
import { twMerge } from "tailwind-merge";

const Button = ({ children, onClick, type = "button", variant = "primary", className, disabled }) => {
    const baseStyles = "px-4 py-2 rounded-lg font-medium transition-all duration-300 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        primary: "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-md hover:shadow-lg",
        secondary: "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600",
        danger: "bg-red-500 hover:bg-red-600 text-white",
        outline: "border-2 border-primary-500 text-primary-600 hover:bg-primary-50",
        ghost: "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800",
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={twMerge(baseStyles, variants[variant], className)}
        >
            {children}
        </button>
    );
};

export default Button;
