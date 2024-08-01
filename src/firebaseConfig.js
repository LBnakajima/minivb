// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebaseプロジェクトの設定
const firebaseConfig = {
  apiKey: "AIzaSyAez7urAmr-3xiiiAaoIOPJ5gFTXPivpFY",
  authDomain: "minivb-poc.firebaseapp.com",
  projectId: "minivb-poc",
  storageBucket: "minivb-poc.appspot.com",
  messagingSenderId: "815827372477",
  appId: "1:815827372477:web:46ee21d8e2c6c4b6e1ead4",
};

// Firebaseの初期化
const app = initializeApp(firebaseConfig);

// FirestoreとAuthのインスタンスを取得
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { db, auth };
