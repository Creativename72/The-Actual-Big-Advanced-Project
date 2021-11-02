// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-analytics.js";

import { getAuth, signOut, signInWithPopup, inMemoryPersistence, setPersistence, GoogleAuthProvider } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js';

import {updateUserTimeStamp} from "./database.js"

export const signOutUser = () => {
  const auth = getAuth();
    signOut(auth).then(() => {
      // Sign-out successful.
      console.log("signOut")
    }).catch((error) => {
      // An error happened.
    });
    window.location=""
}


export const firebaseSetup = () => {
  const firebaseConfig = {
    apiKey: "AIzaSyBWc2monM0UoavgfnCdFEHB9FsPWfi-vs4",
    authDomain: "cryptocracy-idle.firebaseapp.com",
    projectId: "cryptocracy-idle",
    storageBucket: "cryptocracy-idle.appspot.com",
    messagingSenderId: "862245898816",
    appId: "1:862245898816:web:eda0a714352fb60dceeda5",
    measurementId: "G-EV0LR3Z508"
  };
	 
 const app = initializeApp(firebaseConfig);
 const analytics = getAnalytics(app);

 var provider = new GoogleAuthProvider();
 provider.addScope("profile");
 provider.addScope("email");

 const auth = getAuth(app)

const newSignIn = () => {
  
  return new Promise((res) => {
    console.log("persistence set")
    signInWithPopup(auth, provider)
    .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;

        // The signed-in user info.
        var user = result.user;

        console.log(user.uid+" signed in for first time")
        res(user);
      }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage + " auth " + errorCode)
        // The email of the user's account used.
        const email = error.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        res(user);
      })
    })
  }

  return new Promise((res) => {
    var unsubscribe = auth.onAuthStateChanged((user)=>{
      if (user){
        console.log("state persistence");
        unsubscribe();
        res(user);
      } else{
        newSignIn().then(x=>{unsubscribe();res(x)})
      }
    }) 
  })
}

 