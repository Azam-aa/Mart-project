import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";
import { API_BASE_URL } from "../lib/constants";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    // ... imports remain the same
    const { user, token } = useAuth(); // Get user and token from AuthContext

    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem("cart");
        return savedCart ? JSON.parse(savedCart) : [];
    });

    // Fetch cart from backend when user logs in
    useEffect(() => {
        if (user && token) {
            fetchCart();
        } else {
            // Fallback to local storage if needed, or clear if we want strict separation
            // For now, let's keep local storage as is for guests, but maybe clear it on logout?
            // Actually, when user logs out, we should probably clear cartItems or revert to local storage.
            // But for now, let's just focus on fetching backend cart on login.
        }
    }, [user, token]);

    const fetchCart = async () => {
        if (!token) {
            console.warn("Attempted to fetch cart without token");
            return;
        }
        try {
            const response = await axios.get(`${API_BASE_URL}/cart`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Backend returns a Cart object with 'items' list
            // We need to map backend items to frontend structure if different
            // Backend CartItem: { id, product, quantity, price }
            // Frontend expects: { id, title, price, imageUrl, quantity, ... }
            // Let's see what backend returns.
            // Based on models: CartItem has Product. Product has title, price, imageUrl.
            // So we need to map: 
            // item.product.id -> id
            // item.product.title -> title
            // item.product.price -> price
            // item.product.imageUrl -> imageUrl
            // item.quantity -> quantity

            const backendItems = response.data.items || [];
            const mappedItems = backendItems
                .filter(item => item && item.product) // Defensive check
                .map(item => ({
                    id: item.product.id,
                    title: item.product.title,
                    price: item.product.price,
                    imageUrl: item.product.imageUrl,
                    quantity: item.quantity,
                    cartItemId: item.id
                }));
            setCartItems(mappedItems);
        } catch (error) {
            console.error("Failed to fetch cart:", error.response?.status, error.message);
        }
    };

    useEffect(() => {
        if (!user) {
            localStorage.setItem("cart", JSON.stringify(cartItems));
        }
    }, [cartItems, user]);

    const addToCart = async (product) => {
        if (user && token) {
            try {
                await axios.post(`${API_BASE_URL}/cart/add`, {
                    productId: product.id,
                    quantity: 1
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                await fetchCart(); // Refresh cart from backend
            } catch (error) {
                console.error("Failed to add to cart:", error.response?.status, error.message, error.response?.data);
                alert(`Failed to add item to cart. (Error ${error.response?.status || 'Unknown'})`);
            }
        } else {
            setCartItems((prevItems) => {
                const existingItem = prevItems.find((item) => item.id === product.id);
                if (existingItem) {
                    return prevItems.map((item) =>
                        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                    );
                }
                return [...prevItems, { ...product, quantity: 1 }];
            });
        }
    };

    const removeFromCart = async (productId) => {
        if (user && token) {
            try {
                await axios.delete(`${API_BASE_URL}/cart/remove/${productId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                await fetchCart();
            } catch (error) {
                console.error("Failed to remove from cart:", error.response?.status, error.message);
            }
        } else {
            setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));
        }
    };

    const updateQuantity = async (productId, amount) => {
        if (user && token) {
            // Backend 'add' endpoint increments. To decrement we might need new logic or repeated calls?
            // Wait, CartService.addToCart increments: item.setQuantity(item.getQuantity() + quantity);
            // If we send negative quantity, it might work if logic allows.
            // CartService: Integer quantity. item.setQuantity(item.getQuantity() + quantity);
            // Yes, valid arithmetic.
            // However, we should check if quantity becomes 0 or less. 
            // Frontend UI prevents going below 1 usually, but let's be safe.

            // First, find current quantity to ensure we don't go below 1.
            const currentItem = cartItems.find(item => item.id === productId);
            if (!currentItem) return;

            if (currentItem.quantity + amount < 1) {
                // Maybe remove? Or just do nothing? Frontend usually limits to 1.
                return;
            }

            try {
                await axios.post(`${API_BASE_URL}/cart/add`, {
                    productId: productId,
                    quantity: amount
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                await fetchCart();
            } catch (error) {
                console.error("Failed to update quantity:", error.response?.status, error.message);
            }
        } else {
            setCartItems((prevItems) =>
                prevItems.map((item) => {
                    if (item.id === productId) {
                        const newQuantity = item.quantity + amount;
                        return { ...item, quantity: Math.max(1, newQuantity) };
                    }
                    return item;
                })
            );
        }
    };

    const clearCart = () => {
        setCartItems([]);
        // For backend, clearing is done by order placement. 
        // If we want a manual clear button, we'd need an endpoint.
        // But for now clearCart is mostly used after checkout or logout context.
        // We can leave it as state clear.
    };

    const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            cartTotal,
            cartCount
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};
