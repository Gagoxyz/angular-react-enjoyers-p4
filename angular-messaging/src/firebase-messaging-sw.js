importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js");

firebase.initializeApp({
    apiKey: "AIzaSyA-by8O6uYEsw5vPq9I-s_d_RLBZbstMQY",
    authDomain: "angular-react-enjoyers-p2.firebaseapp.com",
    projectId: "angular-react-enjoyers-p2",
    storageBucket: "angular-react-enjoyers-p2.firebasestorage.app",
    messagingSenderId: "87430062589",
    appId: "1:87430062589:web:5037a4628161aee4673994",
    measurementId: "G-6HWL9872Q8"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log("[SW] Background message", payload);

    self.registration.showNotification(
        payload.notification.title,
        {
            body: payload.notification.body
        }
    );
});
