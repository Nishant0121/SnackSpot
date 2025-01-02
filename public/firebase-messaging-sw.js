importScripts(
  "https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js"
);

firebase.initializeApp({
  // Your firebase config object
  apiKey: "AIzaSyDjFXubOhOTPJgBiN_VnvKYVqbjsvKQVyA",
  authDomain: "snackspot-cd9c4.firebaseapp.com",
  projectId: "snackspot-cd9c4",
  storageBucket: "snackspot-cd9c4.firebasestorage.app",
  messagingSenderId: "739785021225",
  appId: "1:739785021225:web:6f28d4ac388eefcc500938",
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
