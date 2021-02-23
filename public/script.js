window.alert("test")
const firebase = require("firebase");
// Required for side-effects
require("firebase/firestore");
// Initialize Cloud Firestore through Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBcpws21294EYsPFWxyqVHLl0YCguKUS5c",
    authDomain: "trackinglinks-951d0.firebaseapp.com",
    databaseURL: "https://trackinglinks-default-rtdb.firebaseio.com",
    projectId: "trackinglinks",
    storageBucket: "trackinglinks.appspot.com",
    messagingSenderId: "707897701423",
    appId: "1:707897701423:web:d0cdb76e54fa8a995402da"
  };
firebase.initializeApp({
    apiKey: 'AIzaSyBcpws21294EYsPFWxyqVHLl0YCguKUS5c',
    authDomain: 'trackinglinks-951d0.firebaseapp.com',
    projectId: 'trackinglinks'
  });
  
  var db = firebase.firestore();

db.collection("users").add({
    first: "Ada",
    last: "Lovelace",
    born: 1815
})
.then(function(docRef) {
    console.log("Document written with ID: ", docRef.id);
})
.catch(function(error) {
    console.error("Error adding document: ", error);
});
