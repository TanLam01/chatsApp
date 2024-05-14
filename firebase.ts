import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getFunctions } from "firebase/functions";

const firebaseConfig = {
    apiKey: "AIzaSyCSlIWi3OAeduIjVGlfvdI8igfVjbeXYDA",
    authDomain: "realtime-chat-app-e180d.firebaseapp.com",
    projectId: "realtime-chat-app-e180d",
    storageBucket: "realtime-chat-app-e180d.appspot.com",
    messagingSenderId: "461338226769",
    appId: "1:461338226769:web:53a8cf457515aa1998c870"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const functions = getFunctions(app);

export { auth, db, functions };