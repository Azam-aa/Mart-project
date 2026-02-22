import React, { useState } from "react";
import { IconEye, IconEyeOff } from "@tabler/icons-react";

const Input = ({ type = "text", placeholder, value, onChange, label, error, name }) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";

    return (
        <div className="w-full">
            {label && <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>}
            <div className="relative">
                <input
                    type={isPassword ? (showPassword ? "text" : "password") : type}
                    name={name}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    className={`w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors
          ${error ? "border-red-500" : "border-gray-300 dark:border-gray-600"}
          text-gray-900 dark:text-white placeholder-gray-400 ${isPassword ? "pr-10" : ""}`}
                />
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                    >
                        {showPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
                    </button>
                )}
            </div>
            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        </div>
    );
};

export default Input;
