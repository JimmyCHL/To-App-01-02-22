// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCzUwQg4evjfB0H5eY_UKL2HYWgJBNE8ro",
  authDomain: "to-do-project-01-01-22.firebaseapp.com",
  projectId: "to-do-project-01-01-22",
  storageBucket: "to-do-project-01-01-22.appspot.com",
  messagingSenderId: "692319601594",
  appId: "1:692319601594:web:165141e01b3c01edb05383",
};

// Initialize Firebase
const app = getApps.length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore();
const auth = getAuth();

export { db, auth };
