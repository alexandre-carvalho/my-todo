// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC0WUPvSjMfpD9xBz5Wocy4-0ljLRwfQxs",
  authDomain: "my-todo-3c1ba.firebaseapp.com",
  projectId: "my-todo-3c1ba",
  storageBucket: "my-todo-3c1ba.firebasestorage.app",
  messagingSenderId: "1056665297666",
  appId: "1:1056665297666:web:0cf4bf91c07c50c6c1981b",
  measurementId: "G-7MM2F9YVWV",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
