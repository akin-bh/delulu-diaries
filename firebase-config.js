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

// Initialize Firebase only if it's available
if (typeof firebase !== 'undefined') {
    try {
        firebase.initializeApp(firebaseConfig);
        console.log('🔥 Firebase initialized for Delulu Diaries! ✨');
    } catch (error) {
        console.error('❌ Firebase initialization error:', error);
    }
} else {
    console.log('⏳ Firebase SDK not loaded yet');
}
