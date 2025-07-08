// Login functionality for Delulu Diaries
class LoginManager {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
        this.checkAuthState();
    }

    bindEvents() {
        const googleLoginBtn = document.getElementById('googleLoginBtn');
        googleLoginBtn.addEventListener('click', () => this.signInWithGoogle());
    }

    checkAuthState() {
        // Check if user is already logged in
        auth.onAuthStateChanged((user) => {
            if (user) {
                // User is signed in, redirect to main app
                this.redirectToApp();
            }
        });
    }

    async signInWithGoogle() {
        const loadingDiv = document.querySelector('.loading');
        const errorDiv = document.getElementById('errorMessage');
        const loginBtn = document.getElementById('googleLoginBtn');

        try {
            // Show loading state
            loadingDiv.style.display = 'block';
            loginBtn.disabled = true;
            errorDiv.textContent = '';

            console.log('🔥 Starting Google sign-in...');

            // Check if Firebase is initialized
            if (typeof firebase === 'undefined') {
                throw new Error('Firebase not initialized');
            }

            // Sign in with Google
            const result = await auth.signInWithPopup(googleProvider);
            const user = result.user;

            console.log('✅ Sign-in successful:', user.displayName);

            // Store user info in localStorage
            const userInfo = {
                uid: user.uid,
                displayName: user.displayName,
                email: user.email,
                photoURL: user.photoURL
            };

            localStorage.setItem('deluluUser', JSON.stringify(userInfo));

            // Show personalized welcome message
            const firstName = user.displayName.split(' ')[0]; // Get first name
            this.showNotification(`Welcome ${firstName}! 🎉✨`, 'success');

            // Redirect to main app
            setTimeout(() => {
                this.redirectToApp();
            }, 2000); // Increased delay to show the welcome message

        } catch (error) {
            console.error('❌ Error signing in:', error);
            console.error('Error code:', error.code);
            console.error('Error message:', error.message);
            
            let errorMessage = 'Failed to sign in. Please try again.';
            
            // More specific error messages
            switch (error.code) {
                case 'auth/popup-closed-by-user':
                    errorMessage = 'Sign-in was cancelled. Please try again.';
                    break;
                case 'auth/popup-blocked':
                    errorMessage = 'Popup was blocked. Please allow popups and try again.';
                    break;
                case 'auth/cancelled-popup-request':
                    errorMessage = 'Sign-in was cancelled. Please try again.';
                    break;
                case 'auth/network-request-failed':
                    errorMessage = 'Network error. Please check your connection and try again.';
                    break;
                case 'auth/too-many-requests':
                    errorMessage = 'Too many failed attempts. Please try again later.';
                    break;
                case 'auth/unauthorized-domain':
                    errorMessage = 'This domain is not authorized. Please contact support.';
                    break;
                case 'auth/operation-not-allowed':
                    errorMessage = 'Google sign-in is not enabled. Please contact support.';
                    break;
                default:
                    if (error.message.includes('Firebase not initialized')) {
                        errorMessage = 'App not properly loaded. Please refresh the page and make sure you\'re using a local server.';
                    } else {
                        errorMessage = `Sign-in failed: ${error.message}`;
                    }
            }
            
            errorDiv.textContent = errorMessage;
            
            // Hide loading state
            loadingDiv.style.display = 'none';
            loginBtn.disabled = false;
        }
    }

    redirectToApp() {
        window.location.href = 'index.html';
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '15px 20px',
            borderRadius: '10px',
            color: 'white',
            fontFamily: 'Poppins, sans-serif',
            fontWeight: '500',
            zIndex: '1000',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease',
            maxWidth: '300px'
        });

        if (type === 'success') {
            notification.style.background = 'linear-gradient(45deg, #4ecdc4, #44a08d)';
        } else if (type === 'error') {
            notification.style.background = 'linear-gradient(45deg, #ff6b6b, #ff8e8e)';
        }

        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 3000);
    }
}

// Initialize login manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new LoginManager();
});
