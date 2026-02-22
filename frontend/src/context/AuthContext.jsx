import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../lib/constants";

// Set baseURL immediately on module load with trailing slash for correct relative joins
axios.defaults.baseURL = API_BASE_URL + "/";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        } else {
            delete axios.defaults.headers.common["Authorization"];
        }
        setLoading(false);
    }, [token]);

    const login = async (email, password) => {
        try {
            const response = await axios.post("auth/login", { email, password });

            if (response.data.token) {
                const userData = { ...response.data, email: email };
                setToken(response.data.token);
                setUser(userData);
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("user", JSON.stringify(userData));
                return { success: true, otpRequired: false };
            }

            return { success: true, otpRequired: true };
        } catch (error) {
            console.error("Login failed", error);
            throw error;
        }
    };

    const signup = async (username, email, password) => {
        try {
            const response = await axios.post("auth/signup", { username, email, password });
            return response.data;
        } catch (error) {
            console.error("Signup failed", error);
            throw error;
        }
    };

    const verifyOtp = async (email, otp) => {
        try {
            const response = await axios.post("auth/verify-otp", { email, otp });
            setToken(response.data.token);
            setUser(response.data);
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("user", JSON.stringify(response.data));
            return true;
        } catch (error) {
            console.error("OTP Verification failed", error);
            throw error;
        }
    };

    const forgotPassword = async (email) => {
        try {
            const response = await axios.post("auth/forgot-password", { email });
            return response.data;
        } catch (error) {
            console.error("Forgot password failed", error);
            throw error;
        }
    };

    const resetPassword = async (email, otp, newPassword) => {
        try {
            const response = await axios.post("auth/reset-password", { email, otp, newPassword });
            return response.data;
        } catch (error) {
            console.error("Reset password failed", error);
            throw error;
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        delete axios.defaults.headers.common["Authorization"];
        window.location.href = "/login";
    };

    return (
        <AuthContext.Provider value={{ user, token, login, signup, verifyOtp, logout, loading, forgotPassword, resetPassword }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
