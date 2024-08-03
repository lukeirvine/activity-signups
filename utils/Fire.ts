/*
  This code created by Luke Irvine Developments
  
  Copyright 2024. All Rights Reserved.
  
  Created By: Luke Irvine
  
  Fire.js
*/
import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';
import { getAnalytics } from 'firebase/analytics';

// will use firebase emulator if set to true
export var useEmulator = true;

// Set the configuration for your app
// TODO: Replace with your project's config object
const firebaseConfig = {
  apiKey: "AIzaSyB87aTd1FxCNrBvK_bi1MXDMnu-V33-nIY",
  authDomain: "activity-signups.firebaseapp.com",
  projectId: "activity-signups",
  storageBucket: "activity-signups.appspot.com",
  messagingSenderId: "489590852831",
  appId: "1:489590852831:web:4375611ce3133f292cad6a",
  measurementId: "G-C67BGNR3KC"
};
const app = initializeApp(firebaseConfig);

// Get a reference to the database service
export const fireAuth = getAuth(app);
export const fireStore = getFirestore(app);
export const fireFuncs = getFunctions(app);
export const analytics = getAnalytics(app);
if (window.location.hostname === "localhost" && useEmulator) {
  connectAuthEmulator(fireAuth, "http://localhost:9099");
  connectFirestoreEmulator(fireStore, 'localhost', 8001);
  connectFunctionsEmulator(fireFuncs, "localhost", 5001);
}
