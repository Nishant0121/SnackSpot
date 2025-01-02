import React, { createContext, useContext, useState } from "react";
import { auth, googleProvider } from "../firebase.jsx";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  signInWithPopup,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase.jsx";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  // Helper function to fetch user data from Firestore
  const fetchUserFromDb = async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setCurrentUser(userData);
        return userData;
      } else {
        console.error("No user found in Firestore with this UID:", uid);
        return null;
      }
    } catch (error) {
      console.error("Error fetching user from Firestore:", error);
      throw error;
    }
  };

  const signUp = async (email, password, name, phone, role = "customer") => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const userData = {
        uid: user.uid,
        name,
        email,
        profile_pic: "https://avatar.iran.liara.run/public",
        role,
        phone,
        points: 0,
        favorites: [],
        loyaltyPoints: 150,
        orderHistory: [],
        createdAt: new Date(),
      };

      // Save the user data to Firestore
      await setDoc(doc(db, "users", user.uid), userData);

      // Set currentUser from the newly created data
      setCurrentUser(userData);
      console.log("User created and saved to Firestore:", userData);
      return userData;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  };

  const logIn = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Fetch and set user data from Firestore
      const userData = await fetchUserFromDb(user.uid);
      console.log("User logged in:", userData);
      return userData;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const logOut = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      console.log("User logged out successfully.");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const signInWithGoogle = async () => {
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      const user = userCredential.user;

      // Check if user already exists in Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (!userDoc.exists()) {
        // If user doesn't exist, create a new entry in Firestore
        const userData = {
          uid: user.uid,
          name: user.displayName,
          email: user.email,
          profile_pic: user.photoURL,
          role: "customer",
          phone: user.phoneNumber || "",
          points: 0,
          favorites: [],
          loyaltyPoints: 150,
          orderHistory: [],
          createdAt: new Date(),
        };

        await setDoc(doc(db, "users", user.uid), userData);
        setCurrentUser(userData);
        console.log(
          "New Google user created and saved to Firestore:",
          userData
        );
      } else {
        // Fetch existing user data from Firestore
        const userData = userDoc.data();
        setCurrentUser(userData);
        console.log("Google user logged in:", userData);
      }
    } catch (error) {
      console.error("Google sign-in failed:", error);
      throw error;
    }
  };

  React.useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        // Fetch and set current user data from Firestore
        await fetchUserFromDb(user.uid);
      } else {
        setCurrentUser(null);
      }
    });
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider
      value={{ currentUser, signUp, logIn, logOut, signInWithGoogle }}
    >
      {children}
    </AuthContext.Provider>
  );
};
