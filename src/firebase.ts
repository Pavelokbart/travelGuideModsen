// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAzJRVHHCBXefWanmgpqi9HUcHHT2TE3IY",
  authDomain: "travelguidemodsen.firebaseapp.com",
  projectId: "travelguidemodsen",
  storageBucket: "travelguidemodsen.appspot.com",
  messagingSenderId: "701986009381",
  appId: "1:701986009381:web:ce71f777e47d1d422a6acc"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);