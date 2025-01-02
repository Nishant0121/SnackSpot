import { initializeApp, cert } from "firebase-admin/app"; // Use 'cert' for service account
import { getMessaging } from "firebase-admin/messaging";
import cors from "cors";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

// Resolve __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load the service account JSON file
const serviceAccount = JSON.parse(
  fs.readFileSync(path.join(__dirname, "service-account.json"), "utf8")
);

// Initialize Firebase Admin SDK explicitly
initializeApp({
  credential: cert(serviceAccount), // Correct 'cert' usage
});

const app = express();
app.use(express.json());
app.use(cors());

// Endpoint for sending notifications
app.post("/sendNotification", async (req, res) => {
  const { token, notification, data } = req.body;

  if (!token || !notification) {
    return res.status(400).json({ error: "Missing required parameters" });
  }

  try {
    const result = await getMessaging().send({
      token,
      notification,
      data: data || {},
    });
    return res.json({ success: true, result });
  } catch (error) {
    if (error.code === "messaging/registration-token-not-registered") {
      console.error("Unregistered token. Remove it from your database.");
    } else {
      console.error("Error sending notification:", error);
    }
    return res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
