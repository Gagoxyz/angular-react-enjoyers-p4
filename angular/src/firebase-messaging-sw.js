// src/firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyA-by8O6uYEsw5vPq9I-s_d_RLBZbstMQY",
    authDomain: "angular-react-enjoyers-p2.firebaseapp.com",
    projectId: "angular-react-enjoyers-p2",
    storageBucket: "angular-react-enjoyers-p2.firebasestorage.app",
    messagingSenderId: "87430062589",
    appId: "1:87430062589:web:892dbfae8732fc24673994",
    measurementId: "G-6DZWR6V784"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Notificación en background:', payload);
  
  // Personalizamos la notificación del navegador
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/assets/icons/icon-72x72.png', // Usamos uno de los iconos que generó el comando PWA
    data: payload.data
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});