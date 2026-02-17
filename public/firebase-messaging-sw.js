importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// NOTE: These values must be hardcoded or injected during build because 
// service workers don't have access to .env at runtime in this context easily.
// However, the messagingSenderId is the most critical one here for initialization.
const firebaseConfig = {
    apiKey: "AIzaSyAat5Z72G2yRuWXgUs_69aKz-mETeBzUvw",
    authDomain: "virginia-app-mob.firebaseapp.com",
    projectId: "virginia-app-mob",
    storageBucket: "virginia-app-mob.firebasestorage.app",
    messagingSenderId: "281252435080",
    appId: "1:281252435080:web:ee35e985af1dd2c498bb3d",
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);

    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: payload.notification.image || '/og-image.png'
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});
