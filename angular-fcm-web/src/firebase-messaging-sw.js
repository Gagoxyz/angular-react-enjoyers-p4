importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js');

// Configuración de Firebase (igual que environment)
const firebaseConfig = {
    apiKey: "AIzaSyA-by8O6uYEsw5vPq9I-s_d_RLBZbstMQY",
    authDomain: "angular-react-enjoyers-p2.firebaseapp.com",
    projectId: "angular-react-enjoyers-p2",
    storageBucket: "angular-react-enjoyers-p2.firebasestorage.app",
    messagingSenderId: "87430062589",
    appId: "1:87430062589:web:5037a4628161aee4673994",
    measurementId: "G-6HWL9872Q8"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

// Opcional: manejar mensajes en segundo plano
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Mensaje recibido en segundo plano:', payload);

  const notificationTitle = payload.notification?.title || 'Notificación';
  const notificationOptions = {
    body: payload.notification?.body,
    icon: '/assets/icons/icon-72x72.png' // opcional
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});