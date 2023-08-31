// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyAqKuKk-sP1dAVZ5Qebsoji9nMIMyAIg8w",
  authDomain: "firebase-app-393319.firebaseapp.com",
  projectId: "firebase-app-393319",
  storageBucket: "firebase-app-393319.appspot.com",
  messagingSenderId: "107189785944",
  appId: "1:107189785944:android:0d4a3a63b5a011802ec12d",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
