// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDjFXubOhOTPJgBiN_VnvKYVqbjsvKQVyA",
  authDomain: "snackspot-cd9c4.firebaseapp.com",
  projectId: "snackspot-cd9c4",
  storageBucket: "snackspot-cd9c4.firebasestorage.app",
  messagingSenderId: "739785021225",
  appId: "1:739785021225:web:6f28d4ac388eefcc500938",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//export db
export const db = getFirestore(app);

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export const realTimeDb = getDatabase(app);

const messaging = getMessaging(app);
// Initialize Firebase Cloud Messaging
export const requestPermissionAndToken = async () => {
  try {
    console.log("Requesting notification permission...");
    const permission = await Notification.requestPermission();

    if (permission === "granted") {
      console.log("Notification permission granted.");

      // Get the FCM token
      const token = await getToken(messaging, {
        vapidKey:
          "BHrABL8TQgU0rMF_nwuExQiyBSzeClXg4SpECxAOWqRTG-LPVuiDaMwkZIR_CN4cmItZXS4ZwnQkhDntZry5hSA",
      });

      if (token) {
        console.log("FCM Token:", token);
        return token;
      } else {
        console.error("Failed to get FCM token.");
        throw new Error("No FCM token available");
      }
    } else {
      console.error("Notification permission not granted.");
      throw new Error("Permission denied");
    }
  } catch (error) {
    console.error("Error getting FCM token:", error.message);
    throw error;
  }
};

// Function to send notification directly
export const sendNotification = async (
  userId,
  title,
  body,
  additionalData = {}
) => {
  try {
    const fcmToken = await requestPermissionAndToken();

    if (!fcmToken) {
      throw new Error("Failed to get FCM token");
    }

    console.log("FCM Token received:", fcmToken);

    const tokenRef = doc(db, "userTokens", userId);
    const docSnap = await getDoc(tokenRef);

    if (docSnap.exists()) {
      await setDoc(
        tokenRef,
        {
          fcmToken: fcmToken,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
    } else {
      await setDoc(tokenRef, {
        fcmToken: fcmToken,
        updatedAt: new Date().toISOString(),
        userId: userId,
      });
    }

    console.log("Token stored in Firestore successfully");

    console.log(`Fetching FCM token for user: ${userId}`);

    // Fetch user's FCM token from Firestore
    const tokenDoc = await getDoc(doc(db, "userTokens", userId));

    if (!tokenDoc.exists()) {
      console.error("No token document found for user:", userId);
      throw new Error("No FCM token found for user");
    }

    const tokenData = tokenDoc.data();
    const userToken = tokenData.fcmToken;

    if (!userToken) {
      console.error("FCM token not found in Firestore for user:", userId);
      throw new Error("Invalid FCM token");
    }

    console.log("FCM token retrieved:", userToken);

    // Send notification through backend API
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: userToken,
        notification: {
          title,
          body,
        },
        data: additionalData,
      }),
    });

    const result = await response.json();

    if (response.ok) {
      console.log("Notification sent successfully:", result);
      listenForMessages();
    } else {
      console.error("Failed to send notification:", result);
      throw new Error(result.error || "Error sending notification");
    }
  } catch (error) {
    console.error("Error in sendNotification:", error.message);
    throw error;
  }
};

// Function to listen for incoming notifications
export const listenForMessages = () => {
  onMessage(messaging, (payload) => {
    console.log("Message received:", payload);
    // Handle the notification here, such as showing a browser notification
    new Notification(payload.notification.title, {
      body: payload.notification.body,
    });
  });
};

export { auth, googleProvider };
export default app;

const API_URL =
  process.env.NODE_ENV === "production"
    ? "https://snackspot.onrender.com/sendNotification"
    : "http://localhost:3000/sendNotification";
