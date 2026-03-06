import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

const BACKEND = "http://localhost:8080";

const authFetch = (url, options = {}) => {
    const token = localStorage.getItem("token");
    return fetch(`${BACKEND}${url}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(options.headers || {}),
        },
    });
};

export const CartProvider = ({ children }) => {
    const { user, token } = useAuth();

    const [cartItems, setCartItems] = useState(() => {
        try {
            const saved = localStorage.getItem("cart");
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    // Sync from backend when user logs in
    useEffect(() => {
        if (user && token) {
            fetchCart();
        } else if (!user) {
            // keep local cart when logged out
        }
    }, [user, token]);

    // Persist local cart for guests
    useEffect(() => {
        if (!user) {
            localStorage.setItem("cart", JSON.stringify(cartItems));
        }
    }, [cartItems, user]);

    const fetchCart = async () => {
        try {
            const res = await authFetch("/api/cart");
            if (!res.ok) {
                console.error("[Cart] fetchCart failed:", res.status);
                return;
            }
            const data = await res.json();
            const items = (data.items || [])
                .filter(item => item && item.product)
                .map(item => ({
                    id: item.product.id,
                    title: item.product.title,
                    price: item.product.price,
                    imageUrl: item.product.imageUrl,
                    quantity: item.quantity,
                    cartItemId: item.id,
                }));
            setCartItems(items);
        } catch (err) {
            console.error("[Cart] fetchCart error:", err.message);
        }
    };

    const addToCart = async (product) => {
        if (user && token) {
            try {
                const res = await authFetch("/api/cart/add", {
                    method: "POST",
                    body: JSON.stringify({ productId: product.id, quantity: 1 }),
                });
                if (!res.ok) {
                    const text = await res.text();
                    console.error("[Cart] addToCart failed:", res.status, text);
                    return;
                }
                await fetchCart();
            } catch (err) {
                console.error("[Cart] addToCart error:", err.message);
            }
        } else {
            setCartItems(prev => {
                const existing = prev.find(i => i.id === product.id);
                if (existing) {
                    return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
                }
                return [...prev, { ...product, quantity: 1 }];
            });
        }
    };

    const removeFromCart = async (productId) => {
        if (user && token) {
            try {
                const res = await authFetch(`/api/cart/remove/${productId}`, { method: "DELETE" });
                if (!res.ok) console.error("[Cart] removeFromCart failed:", res.status);
                await fetchCart();
            } catch (err) {
                console.error("[Cart] removeFromCart error:", err.message);
            }
        } else {
            setCartItems(prev => prev.filter(i => i.id !== productId));
        }
    };

    const updateQuantity = async (productId, amount) => {
        if (user && token) {
            const item = cartItems.find(i => i.id === productId);
            if (!item || item.quantity + amount < 1) return;
            try {
                const res = await authFetch("/api/cart/add", {
                    method: "POST",
                    body: JSON.stringify({ productId, quantity: amount }),
                });
                if (!res.ok) console.error("[Cart] updateQuantity failed:", res.status);
                await fetchCart();
            } catch (err) {
                console.error("[Cart] updateQuantity error:", err.message);
            }
        } else {
            setCartItems(prev =>
                prev.map(i => i.id === productId
                    ? { ...i, quantity: Math.max(1, i.quantity + amount) }
                    : i
                )
            );
        }
    };

    const clearCart = () => setCartItems([]);

    const cartTotal = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error("useCart must be used within CartProvider");
    return ctx;
};
