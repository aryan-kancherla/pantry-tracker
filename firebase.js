// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCtxERvMQTihBIbwh0aJMgx-6TEE6MYy4c",
  authDomain: "inventory-managements-305e8.firebaseapp.com",
  projectId: "inventory-managements-305e8",
  storageBucket: "inventory-managements-305e8.appspot.com",
  messagingSenderId: "609638018225",
  appId: "1:609638018225:web:46519522c7ec788c9ac690",
  measurementId: "G-BPBLL0JHXG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app)


export {firestore}