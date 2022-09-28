import firebase from "firebase/app";
import "firebase/messaging";
import config from "../config/Config";

const firebaseConfig = {
  apiKey: "AIzaSyA2D1DdWQgBUWTYTNU6EPMP10IdKJl0o0E",
  authDomain: "mobibattle-18b06.firebaseapp.com",
  projectId: "mobibattle-18b06",
  storageBucket: "mobibattle-18b06.appspot.com",
  messagingSenderId: "328320039897",
  appId: "1:328320039897:web:4551a5bf060957887237c8",
  measurementId: "G-LXJ6RBQ0SJ"
}

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}else {
  firebase.app(); // if already initialized, use that one
}

let messaging = null;
if (firebase.messaging.isSupported()){   //check for browers support
    messaging = firebase.messaging();
}

const { REACT_APP_VAPID_KEY } = config.get("fcmPublicKey");

export const getToken = async (setTokenFound) => {
  let currentToken = "";
  try {
    currentToken = await messaging.getToken({ vapidKey: REACT_APP_VAPID_KEY });
    if (currentToken) {
      setTokenFound(true);
    } else {
      setTokenFound(false);
    }
  } catch (error) {
    console.log("An error occurred while retrieving token. ", error);
  }
  return currentToken;
};

// export const onMessageListener = () =>
//   new Promise((resolve) => {
//     messaging.onMessage((payload) => {
//       resolve(payload);
//     });
//   });

// to be used in app.js for in app notification
  // onMessageListener()
  // .then((payload) => {
  //   setShowNotification(true);
  //   updateNotification(payload.notification.title, payload.notification.body);
  //   console.log(payload);
  // })
  // .catch((err) => console.log("failed: ", err));

if (firebase.messaging.isSupported()){   //check for browers support
  messaging.onMessage(function(payload) {
    console.log("onMessage: ", payload);
    navigator.serviceWorker.getRegistration('/firebase-cloud-messaging-push-scope').then(registration => {
        registration.showNotification(
            payload.notification.title,
            payload.notification
        )
    });
  });
}


