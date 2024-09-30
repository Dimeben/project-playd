import { initializeApp } from "firebase/app";
import {
  collection,
  getFirestore,
  doc,
  setDoc,
  query,
  getDocs,
  DocumentData,
  QuerySnapshot,
} from "firebase/firestore";

import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  User as FirebaseUser,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDmik3S723nZR-fFM70ilaoAObfPCBKpGc",
  authDomain: "find-my-dj-3a559.firebaseapp.com",
  projectId: "find-my-dj-3a559",
  storageBucket: "find-my-dj-3a559.appspot.com",
  messagingSenderId: "230071268783",
  appId: "1:230071268783:web:01c20d2e1f29178f566b5a",
  measurementId: "G-TXBJCGPGC6",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

interface User {
  username: string;
  first_name: string;
  surname: string;
  city: string;
}

interface DJ extends User {
  genre: string;
  Occasions: string;
  Price: number;
  Description: string;
}

const main = async () => {
  const newUser: User = {
    username: "dimeben",
    first_name: "Ben",
    surname: "McCarthy",
    city: "Leeds",
  };

  const usersRef = collection(db, "users");
  await setDoc(doc(usersRef), newUser);

  const newDj: DJ = {
    username: "megaDJ",
    first_name: "David",
    surname: "Smith",
    city: "Leeds",
    genre: "House",
    Occasions: "Club Nights",
    Price: 50,
    Description: "I just love DJing!",
  };

  const djRef = collection(db, "djs");
  await setDoc(doc(djRef), newDj);

  const q1 = query(collection(db, "users"));
  const usersArray: User[] = [];
  const querySnapshot1: QuerySnapshot<DocumentData> = await getDocs(q1);
  querySnapshot1.forEach((doc) => {
    usersArray.push(doc.data() as User);
  });

  const q2 = query(collection(db, "djs"));
  const djsArray: DJ[] = [];
  const querySnapshot2: QuerySnapshot<DocumentData> = await getDocs(q2);
  querySnapshot2.forEach((doc) => {
    djsArray.push(doc.data() as DJ);
  });

  console.log(usersArray, djsArray);
};

main().catch((err) => console.error(err));

function signInWithEmailPassword() {
  const email = "hello@hello.com";
  const password = "hunter2";

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log("Signed in: ", user.uid);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error("Error: ", errorCode, errorMessage);
    });
}

function signUpWithEmailPassword() {
  const email = "hi@hello.com";
  const password = "hunter2";

  createUserWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {

      const user = userCredential.user;
      console.log("Signed up: ", user.uid);

      const newUser = {
        username: "dimeben",
        first_name: "Ben",
        surname: "McCarthy",
        city: "Leeds",
      };

      const usersRef = collection(db, "users");
      await setDoc(doc(usersRef, user.uid), newUser);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error("Error: ", errorCode, errorMessage);
    });
}

onAuthStateChanged(auth, (user: FirebaseUser | null) => {
  if (user) {

    console.log("Current logged-in user: ", user.uid);
  } else {

    console.log("No user is currently logged in.");
  }
});
