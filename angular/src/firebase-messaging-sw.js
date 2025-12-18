// src/public/firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js');

// Configuración obtenida de tu environment.ts
firebase.initializeApp({
  apiKey: "AIzaSyA-by8O6uYEsw5vPq9I-s_d_RLBZbstMQY",
  authDomain: "angular-react-enjoyers-p2.firebaseapp.com",
  projectId: "angular-react-enjoyers-p2",
  storageBucket: "angular-react-enjoyers-p2.firebasestorage.app",
  messagingSenderId: "87430062589",
  appId: "1:87430062589:web:892dbfae8732fc24673994"
});

const messaging = firebase.messaging();

// Manejador de mensajes en segundo plano
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Mensaje recibido en segundo plano:', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/assets/logo.png' // Ruta a tu logo
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});