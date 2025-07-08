# Firebase Setup Instructions for Delulu Diaries

## Prerequisites
1. Google Account
2. Firebase Project

## Step 1: Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Name your project (e.g., "delulu-diaries")
4. Enable Google Analytics (optional)
5. Create project

## Step 2: Enable Authentication
1. In your Firebase project, go to "Authentication"
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Google" sign-in provider
5. Add your domain to authorized domains (for production)

## Step 3: Create Firestore Database
1. Go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (or configure security rules)
4. Select a location for your database

## Step 4: Get Firebase Configuration
1. Go to Project Settings (gear icon)
2. Scroll down to "Your apps"
3. Click "Web" icon (</>) to add a web app
4. Register your app with a name
5. Copy the Firebase configuration object

## Step 5: Update Configuration
1. Open `firebase-config.js`
2. Replace the placeholder values with your actual Firebase config:

```javascript
const firebaseConfig = {
    apiKey: "your-actual-api-key",
    authDomain: "your-project-id.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project-id.appspot.com",
    messagingSenderId: "your-sender-id",
    appId: "your-app-id"
};
```

## Step 6: Configure Firestore Security Rules
In the Firestore Database, go to "Rules" and update:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /moods/{document} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.uid;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.uid;
    }
  }
}
```

## Step 7: Serve the Application (IMPORTANT!)
**You MUST serve the files from a local server - Firebase won't work with file:// URLs**

### Option 1: VS Code Live Server (Recommended)
1. Install "Live Server" extension in VS Code
2. Right-click on `index.html` in VS Code
3. Select "Open with Live Server"
4. Your browser will open with `http://127.0.0.1:5500/index.html`

### Option 2: Python Server
1. Open terminal in your project folder
2. Run: `python -m http.server 8000` (Python 3) or `python -m SimpleHTTPServer 8000` (Python 2)
3. Open `http://localhost:8000` in your browser

### Option 3: Node.js Server
1. Install http-server globally: `npm install -g http-server`
2. Open terminal in your project folder
3. Run: `http-server`
4. Open the URL shown in terminal (usually `http://localhost:8080`)

### Option 4: Quick PowerShell Server (Windows)
1. Open PowerShell in your project folder
2. Run: `python -m http.server 3000`
3. Open `http://localhost:3000` in your browser

## Step 8: Test the Application
1. Make sure you're accessing via `http://localhost` or `http://127.0.0.1` (NOT file://)
2. You should be redirected to `login.html`
3. Click "Sign in with Google"
4. After successful login, you'll be redirected to the main app

## Why You Need a Local Server
- Firebase Authentication requires HTTPS or localhost
- File:// URLs don't work with Firebase
- CORS (Cross-Origin Resource Sharing) restrictions
- Service workers need to be served from a server

## Production Deployment
1. Add your production domain to Firebase Authentication authorized domains
2. Update Firestore security rules for production
3. Consider enabling Firebase Hosting for easy deployment

## Troubleshooting
- **❌ Opening file directly won't work!** Make sure you're serving files from a local server (use Live Server extension in VS Code)
- **✅ URL should be:** `http://localhost:xxxx` or `http://127.0.0.1:xxxx`
- **❌ URL should NOT be:** `file:///C:/Users/...`
- Check browser console for any errors
- Verify Firebase configuration is correct
- Ensure popups are not blocked for Google sign-in
- Make sure you've enabled Google Authentication in Firebase Console
- Check that Firestore database is created in Firebase Console

## Common Issues
1. **"Firebase not defined" error**: You're not serving from a local server
2. **Login page doesn't show**: Same issue - use a local server
3. **Popup blocked**: Allow popups for your localhost domain
4. **Authentication failed**: Check Firebase console for proper Google auth setup

## Features Included
- ✅ Google Authentication
- ✅ User profile display
- ✅ Firestore database integration
- ✅ User-specific mood posts
- ✅ Real-time post loading
- ✅ Logout functionality
- ✅ Post deletion
- ✅ Responsive design

Your Delulu Diaries app is now ready with full Firebase integration! 🎉
