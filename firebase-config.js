// Firebase Configuration for Delulu Diaries
// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC2LF9ytlMAhokvAUXYWoNcc_qtKWvU5ok",
    authDomain: "deluludiaries-c24f6.firebaseapp.com",
    projectId: "deluludiaries-c24f6",
    storageBucket: "deluludiaries-c24f6.firebasestorage.app",
    messagingSenderId: "706262998930",
    appId: "1:706262998930:web:e3a1e0bf6510399030eb4b",
    measurementId: "G-DLBC8Z1M36"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = firebase.auth();

// Initialize Cloud Firestore and get a reference to the service
const db = firebase.firestore();

// Configure Google Auth Provider
const googleProvider = new firebase.auth.GoogleAuthProvider();
googleProvider.addScope('profile');
googleProvider.addScope('email');

console.log('🔥 Firebase initialized for Delulu Diaries! ✨');
