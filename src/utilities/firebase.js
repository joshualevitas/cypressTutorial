import { initializeApp } from 'firebase/app';
import { getDatabase, onValue, ref, update} from 'firebase/database';
import { useCallback, useEffect, useState } from 'react';
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';

import { connectAuthEmulator } from "firebase/auth";
import { connectDatabaseEmulator } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBIio9qQIqm-3iGa8ZIVRbc2GyNIat9kZE",
  authDomain: "cypress-tutorial.firebaseapp.com",
  projectId: "cypress-tutorial",
  storageBucket: "cypress-tutorial.appspot.com",
  messagingSenderId: "682131399649",
  appId: "1:682131399649:web:dea214d124ddddb44be8a0",
  measurementId: "G-FBWJH9ZKZB"
};

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);
const database = getDatabase(firebase);

// if (process.env.REACT_APP_EMULATE) {
//   connectAuthEmulator(auth, "http://127.0.0.1:9099");
//   connectDatabaseEmulator(db, "127.0.0.1", 9000);

//   signInWithCredential(auth, GoogleAuthProvider.credential(
//     '{"sub": "qEvli4msW0eDz5mSVO6j3W7i8w1k", "email": "tester@gmail.com", "displayName":"Test User", "email_verified": true}'
//   ));
// }

export const useDbData = (path) => {
  const [data, setData] = useState();
  const [error, setError] = useState(null);

  useEffect(() => (
    onValue(ref(database, path), (snapshot) => {
     setData( snapshot.val() );
    }, (error) => {
      setError(error);
    })
  ), [ path ]);

  return [ data, error ];
};





const makeResult = (error) => {
  const timestamp = Date.now();
  const message = error?.message || `Updated: ${new Date(timestamp).toLocaleString()}`;
  return { timestamp, error, message };
};

export const useDbUpdate = (path) => {
  const [result, setResult] = useState();
  const updateData = useCallback((value) => {
    update(ref(database, path), value)
    .then(() => setResult(makeResult()))
    .catch((error) => setResult(makeResult(error)))
  }, [database, path]);

  return [updateData, result];
};

export const signInWithGoogle = () => {
  signInWithPopup(getAuth(firebase), new GoogleAuthProvider());
};

const firebaseSignOut = () => signOut(getAuth(firebase));

export { firebaseSignOut as signOut };

export const useAuthState = () => {
  const [user, setUser] = useState();
  
  useEffect(() => (
    onAuthStateChanged(getAuth(firebase), setUser)
  ));

  return [user];
};