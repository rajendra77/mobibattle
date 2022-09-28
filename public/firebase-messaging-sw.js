importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js"
);

const firebaseConfig = {
  apiKey: "AIzaSyA2D1DdWQgBUWTYTNU6EPMP10IdKJl0o0E",
  authDomain: "mobibattle-18b06.firebaseapp.com",
  projectId: "mobibattle-18b06",
  storageBucket: "mobibattle-18b06.appspot.com",
  messagingSenderId: "328320039897",
  appId: "1:328320039897:web:4551a5bf060957887237c8",
};

// eslint-disable-next-line no-undef
firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
// eslint-disable-next-line no-undef
const messaging = firebase.messaging();

var myUrl = "";
messaging.onBackgroundMessage(function (payload) {
  console.log("Received background message ", payload);
  const notification = payload.data;
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/logo192.png",
    tag: "notification-1",
  };

  // myUrl = notification.url;
  myUrl = "https://sandbox.mobibattle.co"

  // eslint-disable-next-line no-restricted-globals
  self.addEventListener("notificationclick", function (event) {
    // eslint-disable-next-line no-restricted-globals
    event.waitUntil(self.clients.openWindow(myUrl));
    event.notification.close();
  });
  //   // eslint-disable-next-line no-restricted-globals
  // self.registration.hideNotification();

  // eslint-disable-next-line no-restricted-globals
  return self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );
});
