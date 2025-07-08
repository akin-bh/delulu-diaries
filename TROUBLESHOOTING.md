# 🔧 Firebase Authentication Troubleshooting Guide

## ❌ Common Error: "Failed to sign in. Please try again."

### 🎯 **Most Likely Causes:**

## 🚨 **PRIORITY 1: Enable Google Authentication** (Do this FIRST!)

**You MUST do this in Firebase Console:**

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `deluludiaries-c24f6`
3. Click on **"Authentication"** in the left sidebar
4. Click **"Get started"** if you haven't set up Authentication yet
5. Go to **"Sign-in method"** tab
6. Find **"Google"** in the list (it should show "Disabled")
7. Click on **"Google"** 
8. **Enable** the toggle switch (this is the most important step!)
9. **Select your support email** from the dropdown
10. Click **"Save"**

**✅ After this step, Google should change from "Disabled" to "Enabled"**

## 🚨 **PRIORITY 2: Check if it works**
Try logging in again. If it still doesn't work, then worry about authorized domains.

### 1. **Google Authentication Not Enabled** (90% of cases)
**You MUST do this in Firebase Console:**

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `deluludiaries-c24f6`
3. Click on **"Authentication"** in the left sidebar
4. Click **"Get started"** if you haven't set up Authentication yet
5. Go to **"Sign-in method"** tab
6. Find **"Google"** in the list
7. Click on **"Google"** 
8. **Enable** the toggle switch
9. **Select your support email** from the dropdown
10. Click **"Save"**

### 2. **Authorized Domains Not Configured** (Only if Google Auth is enabled)
**There are TWO places to check for authorized domains:**

#### Option A: In Google Sign-in Settings
1. In Authentication > Sign-in method > Google
2. After enabling Google, look for **"Web SDK configuration"**
3. You might see authorized domains listed there

#### Option B: In Authentication Settings (Main location)
1. Go to **Authentication** in Firebase Console
2. Click on **"Settings"** tab (next to "Users" tab)
3. Scroll down to **"Authorized domains"** section
4. Click **"Add domain"**
5. Add these domains:
   - `localhost`
   - `127.0.0.1`
   - `localhost:5500` (if using Live Server)
   - `127.0.0.1:5500` (if using Live Server)

#### Option C: If you still don't see it
**For localhost development, Firebase usually allows localhost by default.** 
The issue is likely that Google Authentication isn't enabled yet.

**Skip this step for now and focus on Step 1 (enabling Google Auth) first.**

### 3. **Firestore Database Not Created**
1. Go to **"Firestore Database"** in Firebase Console
2. Click **"Create database"**
3. Select **"Start in test mode"**
4. Choose a location (closest to you)
5. Click **"Done"**

### 4. **Security Rules for Firestore**
In Firestore Database > Rules, paste this:

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

## 🔍 **Debugging Steps:**

### Step 1: Check Console Logs
1. Open browser **Developer Tools** (F12)
2. Go to **Console** tab
3. Try to sign in again
4. Look for error messages

### Step 2: Common Error Messages

**"auth/operation-not-allowed"**
- ✅ **Fix:** Enable Google sign-in in Firebase Console

**"auth/unauthorized-domain"**
- ✅ **Fix:** Add your localhost domain to authorized domains

**"auth/popup-blocked"**
- ✅ **Fix:** Allow popups in your browser for localhost

**"Firebase not initialized"**
- ✅ **Fix:** Make sure you're using a local server (not file://)

### Step 3: Test Your Setup
1. Open browser console
2. Type: `console.log(firebase.auth())`
3. You should see a Firebase Auth object
4. Type: `console.log(firebase.firestore())`
5. You should see a Firestore object

## 🚀 **Quick Test Script**

Add this to your login.html temporarily for testing:

```html
<button onclick="testFirebase()">Test Firebase</button>

<script>
function testFirebase() {
    console.log('Testing Firebase...');
    
    // Test 1: Firebase loaded
    if (typeof firebase === 'undefined') {
        console.error('❌ Firebase not loaded');
        return;
    }
    console.log('✅ Firebase loaded');
    
    // Test 2: Auth initialized
    try {
        const auth = firebase.auth();
        console.log('✅ Auth initialized:', auth);
    } catch (error) {
        console.error('❌ Auth error:', error);
    }
    
    // Test 3: Firestore initialized
    try {
        const db = firebase.firestore();
        console.log('✅ Firestore initialized:', db);
    } catch (error) {
        console.error('❌ Firestore error:', error);
    }
}
</script>
```

## 🎯 **Step-by-Step Solution:**

1. **First, verify Firebase Console setup:**
   - Authentication > Sign-in method > Google = ENABLED
   - Firestore Database = CREATED
   - Security Rules = CONFIGURED

2. **Then test your app:**
   - Use Live Server in VS Code
   - Open browser console
   - Try to sign in
   - Check console for specific errors

3. **If still failing:**
   - Check if popups are blocked
   - Try in incognito/private browsing mode
   - Clear browser cache and cookies

## 📞 **Need Help?**

If you're still having issues, please share:
1. **Exact error message** from browser console
2. **Screenshot** of Firebase Console Authentication settings
3. **URL** you're using (should be http://localhost:xxxx)

The login should work once Google Authentication is properly enabled in Firebase Console! 🎉
