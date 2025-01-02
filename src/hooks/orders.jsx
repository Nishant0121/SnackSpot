import { ref, push, serverTimestamp } from "firebase/database";
import { realTimeDb, sendNotification } from "../firebase.jsx";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase.jsx";

export const createOrder = async (orderData) => {
  try {
    const ordersRef = ref(realTimeDb, "orders");
    const newOrderRef = await push(ordersRef, {
      ...orderData,
      timestamp: serverTimestamp(),
    });
    return newOrderRef.key;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};

export const placeOrder = async (paymentMethod, cart, uid, calculateTotal) => {
  try {
    const orderData = {
      userId: uid,
      items: cart.items,
      totalPrice: calculateTotal(),
      status: "pending",
      type: paymentMethod,
      timestamp: new Date().toISOString(),
    };

    const title = "Order Placed";
    const body =
      "Your order has been placed successfully. Thank you for choosing us!";

    await sendNotification(uid, title, body);

    const newOrderKey = await createOrder(orderData);
    const ordersCollection = collection(db, "orders");
    await addDoc(ordersCollection, {
      ...orderData,
      id: newOrderKey,
    });

    return newOrderKey;
  } catch (error) {
    console.error("Error placing order:", error);
    throw error;
  }
};
