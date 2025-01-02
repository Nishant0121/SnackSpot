import { onMessage } from "firebase/messaging";
import { useEffect, useState } from "react";
import { messaging, requestNotificationPermission } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

export const useNotifications = (userId) => {
  const [token, setToken] = useState(null);
  const [notification, setNotification] = useState(null);
  const [error, setError] = useState(null);

  // Request permission and get FCM token
  const requestPermission = async () => {
    try {
      if (!userId) {
        throw new Error("User ID is required for notifications");
      }

      console.log("Requesting permission for user:", userId);
      const fcmToken = await requestNotificationPermission();

      if (!fcmToken) {
        throw new Error("Failed to get FCM token");
      }

      console.log("FCM Token received:", fcmToken);
      setToken(fcmToken);

      // Store token in Firestore
      const tokenRef = doc(db, "userTokens", userId);
      await setDoc(
        tokenRef,
        {
          fcmToken: fcmToken,
          updatedAt: new Date().toISOString(),
          userId: userId,
        },
        { merge: true }
      );

      console.log("Token stored in Firestore successfully");
      return fcmToken;
    } catch (error) {
      console.error("Notification permission error:", error);
      setError(error.message);
      return null;
    }
  };

  // Check if token exists in Firestore
  useEffect(() => {
    const checkExistingToken = async () => {
      if (!userId) return;

      try {
        console.log("Checking existing token for user:", userId);
        const tokenDoc = await getDoc(doc(db, "userTokens", userId));

        if (!tokenDoc.exists()) {
          console.log("No existing token found, requesting new one");
          await requestPermission();
        } else {
          const existingToken = tokenDoc.data().fcmToken;
          console.log("Existing token found:", existingToken);
          setToken(existingToken);
        }
      } catch (error) {
        console.error("Error checking token:", error);
        setError(error.message);
      }
    };

    checkExistingToken();
  }, [userId]);

  // Listen for foreground messages
  useEffect(() => {
    if (!messaging) return;

    const unsubscribe = onMessage(messaging, (payload) => {
      console.log("Received foreground message:", payload);
      setNotification(payload);

      if (Notification.permission === "granted") {
        new Notification(payload.notification.title, {
          body: payload.notification.body,
          icon: payload.notification.icon,
        });
      }
    });

    return () => unsubscribe();
  }, []);

  return {
    token,
    notification,
    error,
    requestNotificationPermission: requestPermission,
  };
};
