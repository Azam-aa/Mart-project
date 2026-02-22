import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

const Signup = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [otp, setOtp] = useState("");
    const [step, setStep] = useState(1); // 1: Signup, 2: OTP
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { signup, verifyOtp } = useAuth(); // Assuming verifyOtp is added to context
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await signup(username, email, password);
            // If successful, backend returns "OTP sent"
            setStep(2);
        } catch (err) {
            setError("Signup failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await verifyOtp(email, otp);
            navigate("/dashboard");
        } catch (err) {
            setError("Invalid OTP. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100 dark:border-gray-700">
                <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-6">
                    {step === 1 ? "Create Account" : "Verify Email"}
                </h2>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm text-center border border-red-100">
                        {error}
                    </div>
                )}

                {step === 1 ? (
                    <form onSubmit={handleSignup} className="space-y-4">
                        <Input
                            label="Username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="johndoe"
                            required
                        />
                        <Input
                            label="Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            required
                        />
                        <Input
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                        />

                        <Button type="submit" className="w-full py-3" disabled={loading}>
                            {loading ? "Sending OTP..." : "Sign Up"}
                        </Button>
                    </form>
                ) : (
                    <form onSubmit={handleVerify} className="space-y-4">
                        <p className="text-center text-gray-600 dark:text-gray-300 mb-4">
                            Enter the OTP sent to <strong>{email}</strong>
                        </p>
                        <Input
                            label="OTP"
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            placeholder="123456"
                            required
                        />
                        <Button type="submit" className="w-full py-3" disabled={loading}>
                            {loading ? "Verifying..." : "Verify & Login"}
                        </Button>
                    </form>
                )}

                {step === 1 && (
                    <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                        Already have an account?{" "}
                        <Link to="/login" className="text-primary-600 hover:underline font-medium">
                            Log in
                        </Link>
                    </p>
                )}
            </div>
        </div>
    );
};

export default Signup;
