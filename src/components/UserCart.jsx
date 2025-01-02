import React, { useState, useEffect } from "react";
import { useAuth } from "../context/auth.context";
import {
  getUserCart,
  removeFromCart,
  updateCartItemQuantity,
} from "../hooks/menu";
import PaymentGateway from "./PaymentGateway";
import { createOrder, placeOrder } from "../hooks/orders";
import { sendNotification } from "../utils/sendNotification";

const UserCart = () => {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const [showPayment, setShowPayment] = useState(false);

  useEffect(() => {
    if (currentUser) {
      loadUserCart();
    }
  }, [currentUser]);

  const loadUserCart = async () => {
    try {
      const userCart = await getUserCart(currentUser?.uid);
      setCart(userCart);
    } catch (error) {
      console.error("Error loading cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      const updatedCart = await removeFromCart(currentUser?.uid, itemId);
      setCart(updatedCart);
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      const updatedCart = await updateCartItemQuantity(
        currentUser?.uid,
        itemId,
        newQuantity
      );
      setCart(updatedCart);
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const handlePlaceOrder = () => {
    setShowPayment(true);
  };

  const handlePaymentSuccess = async (paymentMethod) => {
    try {
      const uid = currentUser?.uid;
      await placeOrder(paymentMethod, cart, uid, calculateTotal);
      setCart({ items: [] }); // Clear cart after successful order
      setShowPayment(false);
      alert("Order placed successfully!");
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order. Please try again.");
    }
  };

  const handlePaymentCancel = () => {
    setShowPayment(false);
  };

  if (loading) {
    return <div className="text-center p-4">Loading cart...</div>;
  }

  const calculateTotal = () => {
    return cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Your Cart</h2>
      {cart.items.length === 0 ? (
        <p className="text-gray-500 text-center">Your cart is empty</p>
      ) : (
        <>
          <div className="space-y-4">
            {cart.items.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-white rounded-lg shadow border border-gray-200 gap-4"
              >
                <div className="flex-1 w-full sm:w-auto">
                  <h3 className="font-semibold text-lg">{item.name}</h3>
                  <p className="text-gray-600">${item.price}</p>
                  {item.customizations && (
                    <div className="text-sm text-gray-500 mt-2">
                      {item.customizations.spiceLevel && (
                        <p>Spice Level: {item.customizations.spiceLevel}</p>
                      )}
                      {item.customizations.addOns && (
                        <p>Add-ons: {item.customizations.addOns.join(", ")}</p>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex flex-row sm:flex-row items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        handleQuantityChange(item.id, item.quantity - 1)
                      }
                      className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
                    >
                      -
                    </button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() =>
                        handleQuantityChange(item.id, item.quantity + 1)
                      }
                      className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm sm:text-base"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <h3 className="text-lg sm:text-xl font-bold">
                Total: ${calculateTotal().toFixed(2)}
              </h3>
              <button
                onClick={handlePlaceOrder}
                className="w-full sm:w-auto px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors text-base sm:text-lg font-semibold"
              >
                Place Order
              </button>
            </div>
          </div>
        </>
      )}

      {showPayment && (
        <PaymentGateway
          totalAmount={calculateTotal()}
          onPaymentSuccess={handlePaymentSuccess}
          onCancel={handlePaymentCancel}
        />
      )}
    </div>
  );
};

export default UserCart;
