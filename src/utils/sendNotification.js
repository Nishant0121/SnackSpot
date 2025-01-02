import { getFunctions, httpsCallable } from "firebase/functions";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

const functions = getFunctions();
const sendNotificationFunction = httpsCallable(functions, "sendNotification");

export const sendNotification = async (
  userId,
  title,
  body,
  additionalData = {}
) => {
  try {
    if (!userId) {
      throw new Error("User ID is required");
    }

    console.log("Fetching token for user:", userId);
    const tokenDoc = await getDoc(doc(db, "userTokens", userId));

    if (!tokenDoc.exists()) {
      console.error("No token document found for user:", userId);
      throw new Error("No FCM token found for user");
    }

    const tokenData = tokenDoc.data();
    const userToken = tokenData.fcmToken;

    if (!userToken) {
      console.error("Token document exists but no FCM token found");
      throw new Error("Invalid FCM token");
    }

    console.log("Sending notification with token:", userToken);

    // Call the Cloud Function
    const result = await sendNotificationFunction({
      token: userToken,
      title,
      body,
      additionalData,
    });

    console.log("Notification sent successfully:", result);
    return result.data;
  } catch (error) {
    console.error("Error sending notification:", error);
    // Check if it's a Firebase Error with a code
    if (error.code === "functions/unauthenticated") {
      throw new Error("User must be authenticated to send notifications");
    }
    throw error;
  }
};
