// Delulu Diaries - Single Page App with Inline Authentication
class DeluluDiaries {
    constructor() {
        this.currentUser = null;
        this.posts = [];
        this.init();
    }

    init() {
        console.log('🚀 Starting Delulu Diaries Single Page App...');
        this.checkAuthState();
        this.setupLoginButton();
    }

    setupLoginButton() {
        const loginBtn = document.getElementById('googleLoginBtn');
        if (loginBtn) {
            loginBtn.addEventListener('click', () => this.signInWithGoogle());
        }
    }

    checkAuthState() {
        console.log('🔍 Checking auth state...');
        
        // Wait for Firebase to be available
        const waitForFirebase = () => {
            if (typeof firebase !== 'undefined' && firebase.auth) {
                console.log('🔥 Firebase available, setting up auth listener...');
                
                // Set persistence to LOCAL to maintain auth across sessions
                firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
                    .then(() => {
                        console.log('✅ Auth persistence set to LOCAL');
                        
                        // Check authentication state
                        firebase.auth().onAuthStateChanged((user) => {
                            console.log('🔄 Auth state changed:', user ? `User: ${user.displayName} (${user.email})` : 'No user');
                            
                            if (user && user.uid && user.email) {
                                this.currentUser = user;
                                console.log('✅ User authenticated, setting up app...');
                                this.showApp();
                            } else {
                                console.log('❌ User not authenticated, showing login...');
                                this.showLogin();
                            }
                        });
                    })
                    .catch((error) => {
                        console.error('❌ Error setting auth persistence:', error);
                        // Fallback: continue without persistence setting
                        firebase.auth().onAuthStateChanged((user) => {
                            if (user && user.uid && user.email) {
                                this.currentUser = user;
                                this.showApp();
                            } else {
                                this.showLogin();
                            }
                        });
                    });
            } else {
                console.log('⏳ Firebase not ready yet, retrying...');
                setTimeout(waitForFirebase, 100);
            }
        };
        
        waitForFirebase();
    }

    showLogin() {
        console.log('📱 Showing login section...');
        document.getElementById('loginSection').style.display = 'flex';
        document.getElementById('app').style.display = 'none';
        
        // Clear any previous errors
        document.getElementById('loginError').textContent = '';
    }

    showApp() {
        console.log('🏠 Showing main app...');
        document.getElementById('loginSection').style.display = 'none';
        document.getElementById('app').style.display = 'block';
        
        this.setupApp();
    }

    async signInWithGoogle() {
        const loadingDiv = document.getElementById('loginLoading');
        const errorDiv = document.getElementById('loginError');
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

            // Configure Google Auth Provider
            const googleProvider = new firebase.auth.GoogleAuthProvider();
            googleProvider.addScope('profile');
            googleProvider.addScope('email');

            // Sign in with Google
            const result = await firebase.auth().signInWithPopup(googleProvider);
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

            // Show success message briefly
            const firstName = user.displayName.split(' ')[0];
            this.showNotification(`Welcome ${firstName}! 🎉✨`, 'success');

            // The onAuthStateChanged listener will handle showing the app

        } catch (error) {
            console.error('❌ Error signing in:', error);
            
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
                default:
                    if (error.message.includes('Firebase not initialized')) {
                        errorMessage = 'App not properly loaded. Please refresh the page.';
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

    setupApp() {
        this.displayUserProfile();
        this.bindEvents();
        this.loadUserPosts();
        this.setupCharacterCounter();
        this.personalizeApp();
        
        // Show welcome message on main app
        const firstName = this.currentUser.displayName ? this.currentUser.displayName.split(' ')[0] : 'Bestie';
        this.showNotification(`Hey ${firstName}! Ready to share your delulu vibes? 💖`, 'info');
    }

    personalizeApp() {
        // Personalize the mood input placeholder
        const moodInput = document.getElementById('moodInput');
        const firstName = this.currentUser.displayName ? this.currentUser.displayName.split(' ')[0] : 'bestie';
        
        const personalizedPlaceholders = [
            `Spill the tea ${firstName}... what's your vibe today? ☕️✨`,
            `Hey ${firstName}, what's the mood? 🌈✨`,
            `${firstName}, what's happening in your delulu era? 💖`,
            `Tell us your main character moment ${firstName}! 👑✨`,
            `What's the vibe check ${firstName}? 🦋💫`
        ];
        
        // Pick a random placeholder
        const randomPlaceholder = personalizedPlaceholders[Math.floor(Math.random() * personalizedPlaceholders.length)];
        moodInput.placeholder = randomPlaceholder;
    }

    displayUserProfile() {
        const userProfile = document.getElementById('userProfile');
        const userPhoto = document.getElementById('userPhoto');
        const userName = document.getElementById('userName');
        const dropdownUserPhoto = document.getElementById('dropdownUserPhoto');
        const dropdownUserName = document.getElementById('dropdownUserName');
        const dropdownUserEmail = document.getElementById('dropdownUserEmail');

        if (this.currentUser) {
            userProfile.style.display = 'block';
            userPhoto.src = this.currentUser.photoURL || 'https://via.placeholder.com/32x32?text=👤';
            userName.textContent = this.currentUser.displayName || 'User';
            dropdownUserPhoto.src = this.currentUser.photoURL || 'https://via.placeholder.com/60x60?text=👤';
            dropdownUserName.textContent = this.currentUser.displayName || 'User';
            dropdownUserEmail.textContent = this.currentUser.email || '';
        }
    }

    bindEvents() {
        const submitBtn = document.getElementById('submitMood');
        const moodInput = document.getElementById('moodInput');
        
        const logoutBtn = document.getElementById('logoutBtn');
        const profileBtn = document.getElementById('profileBtn');
        const profileDropdown = document.getElementById('profileDropdown');

        // Submit mood
        if (submitBtn) {
            submitBtn.addEventListener('click', () => this.submitMood());
        }

        // Enter key to submit mood
        if (moodInput) {
            moodInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.submitMood();
                }
            });
        }

        // Logout
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.logout());
        }

        // Profile dropdown
        if (profileBtn) {
            profileBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                profileDropdown.classList.toggle('show');
            });
        }

        // Close dropdown when clicking outside
        document.addEventListener('click', () => {
            if (profileDropdown) {
                profileDropdown.classList.remove('show');
            }
        });

        // Mood presets
        document.querySelectorAll('.mood-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const mood = btn.dataset.mood;
                moodInput.value = `Feeling ${mood} today! ✨`;
                this.updateCharacterCount();
            });
        });
    }

    logout() {
        console.log('🚪 Logging out...');
        firebase.auth().signOut().then(() => {
            localStorage.removeItem('deluluUser');
            console.log('✅ Logged out successfully');
            this.showNotification('See you later! 👋', 'info');
            // onAuthStateChanged will handle showing the login section
        }).catch((error) => {
            console.error('❌ Logout error:', error);
            this.showNotification('Logout failed. Please try again.', 'error');
        });
    }

    setupCharacterCounter() {
        const moodInput = document.getElementById('moodInput');
        const charCount = document.getElementById('charCount');
        
        if (moodInput && charCount) {
            moodInput.addEventListener('input', () => {
                this.updateCharacterCount();
            });
        }
    }

    updateCharacterCount() {
        const moodInput = document.getElementById('moodInput');
        const charCount = document.getElementById('charCount');
        
        if (moodInput && charCount) {
            const text = moodInput.value;
            const count = text.length;
            charCount.textContent = count;
            
            if (count > 400) {
                charCount.style.color = '#ff6b6b';
            } else if (count > 300) {
                charCount.style.color = '#ff9800';
            } else {
                charCount.style.color = '#666';
            }
        }
    }

    async submitMood() {
        const moodInput = document.getElementById('moodInput');
        const submitBtn = document.getElementById('submitMood');
        
        if (!moodInput || !this.currentUser) return;

        const moodText = moodInput.value.trim();
        if (!moodText) {
            this.showNotification('Please write something before posting! 📝', 'warning');
            return;
        }

        try {
            // Disable submit button
            submitBtn.disabled = true;
            submitBtn.textContent = 'Posting...';

            const moodData = {
                text: moodText,
                userId: this.currentUser.uid,
                userEmail: this.currentUser.email,
                userName: this.currentUser.displayName || 'Anonymous',
                userPhoto: this.currentUser.photoURL || '',
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            };

            await firebase.firestore().collection('moods').add(moodData);

            // Clear input
            moodInput.value = '';
            this.updateCharacterCount();

            this.showNotification('Vibe posted! ✨', 'success');
            
            // Reload posts
            this.loadUserPosts();

        } catch (error) {
            console.error('❌ Error posting mood:', error);
            this.showNotification('Failed to post mood. Please try again.', 'error');
        } finally {
            // Re-enable submit button
            submitBtn.disabled = false;
            submitBtn.textContent = 'Post Vibe ✨';
        }
    }

    async loadUserPosts() {
        if (!this.currentUser) return;

        try {
            const snapshot = await firebase.firestore()
                .collection('moods')
                .where('userId', '==', this.currentUser.uid)
                .orderBy('timestamp', 'desc')
                .limit(20)
                .get();

            const postsContainer = document.getElementById('moodPosts');
            postsContainer.innerHTML = '';

            if (snapshot.empty) {
                postsContainer.innerHTML = '<div class="no-posts">No moods yet! Share your first vibe ✨</div>';
                return;
            }

            snapshot.forEach((doc) => {
                const mood = doc.data();
                const postDiv = document.createElement('div');
                postDiv.className = 'mood-post';
                
                const date = mood.createdAt ? new Date(mood.createdAt.seconds * 1000) : new Date();
                const timeStr = date.toLocaleString();
                
                postDiv.innerHTML = `
                    <div class="mood-text">${mood.text}</div>
                    <div class="mood-meta">Posted on ${timeStr}</div>
                `;
                
                postsContainer.appendChild(postDiv);
            });

        } catch (error) {
            console.error('❌ Error loading posts:', error);
            document.getElementById('moodPosts').innerHTML = '<div class="no-posts">Error loading posts. Please refresh the page.</div>';
        }
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
            zIndex: '1001',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease',
            maxWidth: '300px'
        });

        if (type === 'success') {
            notification.style.background = 'linear-gradient(45deg, #4ecdc4, #44a08d)';
        } else if (type === 'error') {
            notification.style.background = 'linear-gradient(45deg, #ff6b6b, #ff8e8e)';
        } else if (type === 'warning') {
            notification.style.background = 'linear-gradient(45deg, #ff9800, #ffb74d)';
        } else {
            notification.style.background = 'linear-gradient(45deg, #667eea, #764ba2)';
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

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new DeluluDiaries();
});
