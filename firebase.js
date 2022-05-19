// import {initializeApp} from 'firebase/app';
// import {getAuth} from 'firebase/auth';
// import {initializeFirestore} from 'firebase/firestore';

// const firebaseConfig = {
//   apiKey: "AIzaSyAv2d9-ciJshQY9ZC6YeRywzxtb7Iq8l1o",
//   authDomain: "finalyearproject-647c6.firebaseapp.com",
//   projectId: "finalyearproject-647c6",
//   storageBucket: "finalyearproject-647c6.appspot.com",
//   messagingSenderId: "633885789455",
//   appId: "1:633885789455:web:e6a2fdce4bbfdc7f0e027a"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);
// const db = initializeFirestore(app, {
//   experimentalForceLongPolling: true,
// });

// export {auth, db};

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"


const firebaseConfig = {
  apiKey: "AIzaSyAv2d9-ciJshQY9ZC6YeRywzxtb7Iq8l1o",
  authDomain: "finalyearproject-647c6.firebaseapp.com",
  projectId: "finalyearproject-647c6",
  storageBucket: "finalyearproject-647c6.appspot.com",
  messagingSenderId: "633885789455",
  appId: "1:633885789455:web:e6a2fdce4bbfdc7f0e027a"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);