import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { API_BASE_URL, IMAGE_BASE_URL } from "../lib/constants";
import Button from "../components/ui/Button";
import { IconMinus, IconPlus, IconTrash } from "@tabler/icons-react";

const Cart = () => {
    const navigate = useNavigate();
    const { cartItems, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
    const { user, token } = useAuth();
    const [shippingAddress, setShippingAddress] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("razorpay"); // 'razorpay' or 'cod'
    const [loading, setLoading] = useState(false);

    const handleCheckout = async () => {
        if (!shippingAddress.trim()) {
            alert("Please enter a shipping address");
            return;
        }

        if (paymentMethod === 'cod') {
            setLoading(true);
            try {
                // Create Order with COD
                await axios.post("orders/create", {
                    paymentId: "COD",
                    shippingAddress: shippingAddress
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                alert("Order Placed Successfully! Redirecting to orders...");
                clearCart();
                navigate('/orders');
            } catch (err) {
                console.error(err);
                alert("Failed to place order. Please try again.");
            } finally {
                setLoading(false);
            }
            return;
        }

        // Razorpay Flow
        setLoading(true);
        try {
            const res = await axios.post("payment/create-order", {
                amount: cartTotal
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const orderData = res.data;

            const options = {
                "key": "rzp_test_SHzK5nEuxj7TVK",
                "amount": orderData.amount,
                "currency": orderData.currency,
                "name": "MartApp",
                "description": "Purchase Description",
                "order_id": orderData.id,
                "image": "https://via.placeholder.com/200",
                "handler": function (response) {
                    setLoading(true);
                    axios.post("orders/create", {
                        paymentId: response.razorpay_payment_id,
                        shippingAddress: shippingAddress
                    }, {
                        headers: { Authorization: `Bearer ${token}` }
                    }).then(() => {
                        alert("Payment Successful! Order Confirmed.");
                        clearCart();
                        navigate('/orders');
                    }).catch(err => {
                        console.error(err);
                        alert("Payment successful but order creation failed. Contact support.");
                    }).finally(() => {
                        setLoading(false);
                    });
                },
                "modal": {
                    "ondismiss": function () {
                        setLoading(false);
                    }
                },
                "prefill": {
                    "name": user?.username,
                    "email": user?.email,
                },
                "theme": {
                    "color": "#7c3aed"
                }
            };
            const rzp1 = new window.Razorpay(options);
            rzp1.open();
        } catch (e) {
            console.error(e);
            alert("Checkout failed");
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">Your Cart</h1>

            {cartItems.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-4">
                        {cartItems.map(item => (
                            <div key={item.id} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm flex items-center justify-between border border-gray-100 dark:border-gray-700">
                                <div className="flex items-center space-x-4">
                                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden">
                                        <img
                                            src={item.imageUrl ? `${IMAGE_BASE_URL}${item.imageUrl}` : "https://via.placeholder.com/150"}
                                            alt={item.title}
                                            className="object-contain w-full h-full"
                                        />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-800 dark:text-white">{item.title}</h3>
                                        <p className="text-violet-600 font-medium">₹{item.price.toLocaleString('en-IN')}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-6">
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => updateQuantity(item.id, -1)}
                                            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
                                        >
                                            <IconMinus size={16} />
                                        </button>
                                        <span className="font-medium w-4 text-center text-gray-800 dark:text-white">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.id, 1)}
                                            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
                                        >
                                            <IconPlus size={16} />
                                        </button>
                                    </div>
                                    <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-full transition-colors">
                                        <IconTrash size={20} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg h-fit border border-gray-100 dark:border-gray-700 sticky top-24">
                        <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Order Summary</h3>
                        <div className="space-y-2 mb-6 text-gray-600 dark:text-gray-300">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>₹{cartTotal.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Tax</span>
                                <span>₹0.00</span>
                            </div>
                            <div className="border-t pt-2 mt-2 flex justify-between font-bold text-lg text-gray-800 dark:text-white">
                                <span>Total</span>
                                <span>₹{cartTotal.toLocaleString('en-IN')}</span>
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Shipping Address</label>
                            <textarea
                                value={shippingAddress}
                                onChange={(e) => setShippingAddress(e.target.value)}
                                placeholder="Enter your full delivery address..."
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-500 dark:text-white resize-none"
                                rows="3"
                            ></textarea>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Payment Method</label>
                            <div className="flex flex-col space-y-2">
                                <label className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-all ${paymentMethod === 'razorpay' ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20' : 'border-gray-200 dark:border-gray-700'}`}>
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="razorpay"
                                        checked={paymentMethod === 'razorpay'}
                                        onChange={() => setPaymentMethod('razorpay')}
                                        className="form-radio text-violet-600 focus:ring-violet-500"
                                    />
                                    <span className="text-gray-800 dark:text-white font-medium">Online Payment (Razorpay)</span>
                                </label>
                                <label className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20' : 'border-gray-200 dark:border-gray-700'}`}>
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="cod"
                                        checked={paymentMethod === 'cod'}
                                        onChange={() => setPaymentMethod('cod')}
                                        className="form-radio text-violet-600 focus:ring-violet-500"
                                    />
                                    <span className="text-gray-800 dark:text-white font-medium">Cash on Delivery</span>
                                </label>
                            </div>
                        </div>

                        <Button
                            onClick={handleCheckout}
                            disabled={loading}
                            className="w-full py-3 text-lg"
                        >
                            {loading ? "Processing..." : (paymentMethod === 'cod' ? 'Place Order' : 'Proceed to Pay')}
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-3xl border border-dashed border-gray-200 dark:border-gray-700">
                    <p className="text-xl text-gray-500 font-medium">Your cart is empty.</p>
                    <Button onClick={() => window.location.href = '/dashboard'} className="mt-6">Start Shopping</Button>
                </div>
            )}
        </div>
    );
};

export default Cart;
