// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBseFJ_4AgQPBfvgd53RVQTSHcjTDbyrmE",
  authDomain: "chitchat-bbd21.firebaseapp.com",
  databaseURL: "https://chitchat-bbd21-default-rtdb.firebaseio.com",
  projectId: "chitchat-bbd21",
  storageBucket: "chitchat-bbd21.appspot.com",
  messagingSenderId: "223790024979",
  appId: "1:223790024979:web:fcd13408bcbab2101bf2e6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default firebaseConfig;
