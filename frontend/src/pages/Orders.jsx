import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { API_BASE_URL, IMAGE_BASE_URL } from "../lib/constants";
import {
    IconPackage,
    IconTruck,
    IconCheck,
    IconBoxSeam,
    IconClock,
    IconShoppingBag,
} from "@tabler/icons-react";

const STEPS = [
    { status: "Placed", label: "Order Placed", icon: IconBoxSeam },
    { status: "On the Way", label: "On the Way", icon: IconTruck },
    { status: "Shipped", label: "Shipped", icon: IconPackage },
    { status: "Delivered", label: "Delivered", icon: IconCheck },
];

const STATUS_COLORS = {
    "Placed": "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
    "On the Way": "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
    "Shipped": "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
    "Delivered": "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
    "Cancelled": "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
};

const POLL_SECONDS = 10;

const getStepIndex = (status) => STEPS.findIndex((s) => s.status === status);

const Orders = () => {
    const { token } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [countdown, setCountdown] = useState(POLL_SECONDS);
    const countdownRef = useRef(POLL_SECONDS);

    const fetchOrders = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/orders`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setOrders(
                res.data.sort(
                    (a, b) => new Date(b.orderDate) - new Date(a.orderDate)
                )
            );
        } catch (err) {
            console.error("Error fetching orders:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!token) return;
        fetchOrders();

        // Countdown ticker — fires every second
        const ticker = setInterval(() => {
            countdownRef.current -= 1;
            if (countdownRef.current <= 0) {
                countdownRef.current = POLL_SECONDS;
                fetchOrders();
            }
            setCountdown(countdownRef.current);
        }, 1000);

        return () => clearInterval(ticker);
    }, [token]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-4 text-gray-400">
                    <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
                    <p className="font-medium">Loading your orders...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto py-10 px-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <IconShoppingBag size={32} className="text-violet-600 dark:text-violet-400" />
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                        My Orders
                    </h1>
                </div>

                {/* Small refresh countdown — top right */}
                {orders.length > 0 && (
                    <div className="flex items-center gap-1.5 text-white/30 dark:text-white/20 select-none">
                        <div
                            className="w-4 h-4 rounded-full border border-white/20"
                            style={{
                                background: `conic-gradient(rgba(255,255,255,0.25) ${(countdown / POLL_SECONDS) * 360}deg, transparent 0deg)`,
                            }}
                        />
                        <span className="text-[11px] tabular-nums">{countdown}s</span>
                    </div>
                )}
            </div>

            {orders.length === 0 ? (
                <div className="text-center py-24 bg-white dark:bg-gray-800 rounded-3xl border border-dashed border-gray-200 dark:border-gray-700 flex flex-col items-center gap-4">
                    <IconPackage size={56} className="text-gray-300 dark:text-gray-600" />
                    <p className="text-xl font-semibold text-gray-500 dark:text-gray-400">
                        You haven't placed any orders yet.
                    </p>
                    <a
                        href="/dashboard"
                        className="mt-2 px-6 py-2 bg-violet-600 text-white rounded-lg font-medium hover:bg-violet-700 transition-colors"
                    >
                        Start Shopping
                    </a>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => {
                        const currentStepIndex = getStepIndex(order.status);
                        const isCancelled = order.status === "Cancelled";
                        const isDelivered = order.status === "Delivered";
                        const progressPct =
                            STEPS.length > 1
                                ? (currentStepIndex / (STEPS.length - 1)) * 100
                                : 0;

                        return (
                            <div
                                key={order.id}
                                className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
                            >
                                {/* Order Header */}
                                <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700 flex flex-wrap gap-4 justify-between items-center">
                                    <div>
                                        <p className="text-sm text-gray-400">
                                            Order{" "}
                                            <span className="font-mono font-bold text-gray-700 dark:text-gray-200">
                                                #{order.id}
                                            </span>
                                        </p>
                                        <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                                            <IconClock size={12} />
                                            {new Date(order.orderDate).toLocaleString("en-IN", {
                                                dateStyle: "medium",
                                                timeStyle: "short",
                                            })}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3 flex-wrap">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${STATUS_COLORS[order.status] || "bg-gray-100 text-gray-600"}`}>
                                            {order.status}
                                        </span>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${order.paymentId === "COD" ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300" : "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"}`}>
                                            {order.paymentId === "COD" ? "Cash on Delivery" : "Paid Online"}
                                        </span>
                                        <p className="text-lg font-bold text-violet-600 dark:text-violet-400">
                                            ₹{order.totalAmount.toLocaleString("en-IN")}
                                        </p>
                                    </div>
                                </div>

                                <div className="p-6">
                                    {/* Order Items */}
                                    <div className="space-y-3 mb-8">
                                        {order.orderItems.map((item) => (
                                            <div key={item.id} className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-14 h-14 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
                                                        {item.product?.imageUrl ? (
                                                            <img
                                                                src={`${IMAGE_BASE_URL}${item.product.imageUrl}`}
                                                                alt={item.product.title}
                                                                className="object-contain w-full h-full"
                                                            />
                                                        ) : (
                                                            <IconPackage size={24} className="text-gray-400" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-gray-800 dark:text-white">
                                                            {item.product?.title}
                                                        </p>
                                                        <p className="text-sm text-gray-400">Qty: {item.quantity}</p>
                                                    </div>
                                                </div>
                                                <p className="font-semibold text-gray-600 dark:text-gray-300">
                                                    ₹{item.price.toLocaleString("en-IN")}
                                                </p>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Tracking Progress */}
                                    {!isCancelled && (
                                        <div>
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
                                                Delivery Tracking
                                            </p>

                                            {/* Progress bar */}
                                            <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-6">
                                                <div
                                                    className="h-full bg-gradient-to-r from-violet-500 to-green-500 rounded-full transition-all duration-700"
                                                    style={{ width: `${progressPct}%` }}
                                                />
                                            </div>

                                            {/* Step Icons */}
                                            <div className="flex justify-between">
                                                {STEPS.map((step, index) => {
                                                    const Icon = step.icon;
                                                    const isCompleted = index < currentStepIndex;
                                                    const isCurrent = index === currentStepIndex;
                                                    const isActive = index <= currentStepIndex;

                                                    return (
                                                        <div key={step.status} className="flex flex-col items-center gap-2 flex-1">
                                                            <div className={`relative p-2.5 rounded-full transition-all duration-500 ${isCompleted
                                                                ? "bg-green-500 text-white"
                                                                : isCurrent
                                                                    ? "bg-violet-600 text-white ring-4 ring-violet-200 dark:ring-violet-900"
                                                                    : "bg-gray-100 dark:bg-gray-700 text-gray-400"
                                                                }`}>
                                                                <Icon size={18} />
                                                                {isCurrent && !isDelivered && (
                                                                    <span className="absolute inset-0 rounded-full bg-violet-400 opacity-40 animate-ping" />
                                                                )}
                                                            </div>
                                                            <span className={`text-xs font-semibold text-center ${isCompleted
                                                                ? "text-green-600 dark:text-green-400"
                                                                : isCurrent
                                                                    ? "text-violet-600 dark:text-violet-400"
                                                                    : "text-gray-400"
                                                                }`}>
                                                                {step.label}
                                                            </span>
                                                        </div>
                                                    );
                                                })}
                                            </div>

                                            {/* Shipping address */}
                                            {order.shippingAddress && (
                                                <p className="text-xs text-gray-400 mt-4">
                                                    📦 Delivering to:{" "}
                                                    <span className="text-gray-600 dark:text-gray-300 font-medium">
                                                        {order.shippingAddress}
                                                    </span>
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    {isCancelled && (
                                        <div className="text-center py-4 text-red-500 font-medium">
                                            This order has been cancelled.
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default Orders;
