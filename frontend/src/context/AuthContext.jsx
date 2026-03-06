import { createContext, useContext, useState, useEffect, useRef } from "react";
import axios from "axios";
axios.defaults.baseURL = "http://localhost:8080/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [loading, setLoading] = useState(true);
    const logoutRef = useRef(null);

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

    useEffect(() => {
        const interceptor = axios.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response && (error.response.status === 401)) {
                    if (logoutRef.current) {
                        logoutRef.current();
                    }
                }
                return Promise.reject(error);
            }
        );
        return () => axios.interceptors.response.eject(interceptor);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await axios.post("/auth/login", { email, password });

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
            const response = await axios.post("/auth/signup", { username, email, password });
            return response.data;
        } catch (error) {
            console.error("Signup failed", error);
            throw error;
        }
    };

    const verifyOtp = async (email, otp) => {
        try {
            const response = await axios.post("/auth/verify-otp", { email, otp });
            const userData = { ...response.data, email: email };
            setToken(response.data.token);
            setUser(userData);
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("user", JSON.stringify(userData));
            return true;
        } catch (error) {
            console.error("OTP Verification failed", error);
            throw error;
        }
    };

    const forgotPassword = async (email) => {
        try {
            const response = await axios.post("/auth/forgot-password", { email });
            return response.data;
        } catch (error) {
            console.error("Forgot password failed", error);
            throw error;
        }
    };

    const resetPassword = async (email, otp, newPassword) => {
        try {
            const response = await axios.post("/auth/reset-password", { email, otp, newPassword });
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
        localStorage.removeItem("cart");
        delete axios.defaults.headers.common["Authorization"];
        window.location.href = "/login";
    };

    useEffect(() => {
        logoutRef.current = logout;
    });

    return (
        <AuthContext.Provider value={{ user, token, login, signup, verifyOtp, logout, loading, forgotPassword, resetPassword }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
