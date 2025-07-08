// Delulu Diaries - App Logic with Firebase Authentication
class DeluluDiaries {
    constructor() {
        this.currentUser = null;
        this.posts = [];
        this.init();
    }

    init() {
        this.checkAuthState();
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
                                this.setupApp();
                            } else {
                                console.log('❌ User not authenticated, redirecting to login...');
                                // Small delay to ensure auth state is fully processed
                                setTimeout(() => {
                                    window.location.href = 'login.html';
                                }, 100);
                            }
                        });
                    })
                    .catch((error) => {
                        console.error('❌ Error setting auth persistence:', error);
                        // Fallback: continue without persistence setting
                        firebase.auth().onAuthStateChanged((user) => {
                            console.log('🔄 Auth state changed (no persistence):', user ? `User: ${user.displayName}` : 'No user');
                            
                            if (user && user.uid && user.email) {
                                this.currentUser = user;
                                console.log('✅ User authenticated, setting up app...');
                                this.setupApp();
                            } else {
                                console.log('❌ User not authenticated, redirecting to login...');
                                setTimeout(() => {
                                    window.location.href = 'login.html';
                                }, 100);
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

    setupApp() {
        this.displayUserProfile();
        this.bindEvents();
        this.loadUserPosts();
        this.setupCharacterCounter();
        this.setupPWAInstall();
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
        console.log('🖼️ Displaying user profile...');
        const userProfile = document.getElementById('userProfile');
        const userPhoto = document.getElementById('userPhoto');
        const userName = document.getElementById('userName');
        const dropdownUserPhoto = document.getElementById('dropdownUserPhoto');
        const dropdownUserName = document.getElementById('dropdownUserName');
        const dropdownUserEmail = document.getElementById('dropdownUserEmail');

        console.log('User profile elements:', { userProfile, userPhoto, userName });
        console.log('Current user:', this.currentUser);

        if (this.currentUser) {
            const photoUrl = this.currentUser.photoURL || 'https://via.placeholder.com/32x32?text=👤';
            const displayName = this.currentUser.displayName || 'Delulu User';
            const email = this.currentUser.email || '';
            
            console.log('Setting user photo:', photoUrl);
            console.log('Setting user name:', displayName);
            
            // Set profile button elements
            userPhoto.src = photoUrl;
            userName.textContent = displayName;
            
            // Set dropdown elements
            dropdownUserPhoto.src = photoUrl;
            dropdownUserName.textContent = displayName;
            dropdownUserEmail.textContent = email;
            
            userProfile.style.display = 'block';
            
            console.log('✅ User profile displayed successfully');
        } else {
            console.log('❌ No current user to display');
        }
    }

    bindEvents() {
        const submitBtn = document.getElementById('submitMood');
        const moodInput = document.getElementById('moodInput');
        const presetBtns = document.querySelectorAll('.mood-btn');
        const logoutBtn = document.getElementById('logoutBtn');
        const profileBtn = document.getElementById('profileBtn');
        const profileDropdown = document.getElementById('profileDropdown');

        submitBtn.addEventListener('click', () => this.submitMood());
        
        moodInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.submitMood();
            }
        });

        presetBtns.forEach(btn => {
            btn.addEventListener('click', () => this.selectPresetMood(btn.dataset.mood));
        });

        logoutBtn.addEventListener('click', () => this.logout());

        // Profile dropdown functionality
        profileBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleProfileDropdown();
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!profileDropdown.contains(e.target) && !profileBtn.contains(e.target)) {
                this.closeProfileDropdown();
            }
        });

        // Close dropdown on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeProfileDropdown();
            }
        });
    }

    toggleProfileDropdown() {
        const profileDropdown = document.getElementById('profileDropdown');
        const profileArrow = document.querySelector('.profile-arrow');
        
        if (profileDropdown.classList.contains('show')) {
            this.closeProfileDropdown();
        } else {
            profileDropdown.classList.add('show');
            profileArrow.style.transform = 'rotate(180deg)';
        }
    }

    closeProfileDropdown() {
        const profileDropdown = document.getElementById('profileDropdown');
        const profileArrow = document.querySelector('.profile-arrow');
        
        profileDropdown.classList.remove('show');
        profileArrow.style.transform = 'rotate(0deg)';
    }

    async logout() {
        try {
            await firebase.auth().signOut();
            localStorage.removeItem('deluluUser');
            this.showNotification('Logged out successfully! See you later! 👋', 'success');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1000);
        } catch (error) {
            console.error('Error logging out:', error);
            this.showNotification('Error logging out. Please try again.', 'error');
        }
    }

    setupCharacterCounter() {
        const moodInput = document.getElementById('moodInput');
        const charCount = document.getElementById('charCount');

        moodInput.addEventListener('input', () => {
            const currentLength = moodInput.value.length;
            charCount.textContent = currentLength;
            
            if (currentLength > 250) {
                charCount.style.color = '#ff6b6b';
            } else {
                charCount.style.color = '#666';
            }
        });
    }

    selectPresetMood(mood) {
        const moodInput = document.getElementById('moodInput');
        const currentText = moodInput.value.trim();
        
        if (currentText) {
            moodInput.value = `${currentText} ${mood}`;
        } else {
            moodInput.value = `Feeling ${mood} today!`;
        }
        
        // Update character counter
        const charCount = document.getElementById('charCount');
        charCount.textContent = moodInput.value.length;
        
        // Add visual feedback
        const selectedBtn = document.querySelector(`[data-mood="${mood}"]`);
        selectedBtn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            selectedBtn.style.transform = 'scale(1)';
        }, 150);
    }

    async submitMood() {
        const moodInput = document.getElementById('moodInput');
        const moodText = moodInput.value.trim();

        if (!moodText) {
            this.showNotification('Please share your vibe first! ✨', 'warning');
            return;
        }

        if (moodText.length > 280) {
            this.showNotification('Your vibe is too long! Keep it under 280 characters 💫', 'warning');
            return;
        }

        try {
            const submitBtn = document.getElementById('submitMood');
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<div class="loading"></div> Posting...';

            const post = {
                uid: this.currentUser.uid,
                displayName: this.currentUser.displayName,
                photoURL: this.currentUser.photoURL,
                text: moodText,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                mood: this.detectMood(moodText),
                createdAt: new Date().toISOString()
            };

            // Add to Firestore
            await firebase.firestore().collection('moods').add(post);

            // Clear input
            moodInput.value = '';
            document.getElementById('charCount').textContent = '0';
            
            this.showNotification('Your vibe has been posted! 🎉', 'success');
            
            // Reload posts
            this.loadUserPosts();
            
            // Scroll to posts section
            document.querySelector('.mood-posts-section').scrollIntoView({ 
                behavior: 'smooth' 
            });

        } catch (error) {
            console.error('Error posting mood:', error);
            this.showNotification('Failed to post your vibe. Please try again! 😢', 'error');
        } finally {
            const submitBtn = document.getElementById('submitMood');
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Post My Vibe ✨';
        }
    }

    async loadUserPosts() {
        try {
            const snapshot = await firebase.firestore().collection('moods')
                .where('uid', '==', this.currentUser.uid)
                .orderBy('timestamp', 'desc')
                .limit(50)
                .get();

            this.posts = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            this.displayPosts();
        } catch (error) {
            console.error('Error loading posts:', error);
            this.showNotification('Failed to load your posts. Please refresh the page.', 'error');
        }
    }

    detectMood(text) {
        const lowerText = text.toLowerCase();
        
        if (lowerText.includes('slay') || lowerText.includes('💅')) return 'Slay 💅';
        if (lowerText.includes('goofy') || lowerText.includes('🤪')) return 'Goofy 🤪';
        if (lowerText.includes('delulu') || lowerText.includes('💖')) return 'Delulu 💖';
        if (lowerText.includes('main character') || lowerText.includes('👑')) return 'Main Character 👑';
        
        // Default mood detection based on keywords
        if (lowerText.includes('happy') || lowerText.includes('good') || lowerText.includes('great')) return 'Slay 💅';
        if (lowerText.includes('funny') || lowerText.includes('lol') || lowerText.includes('haha')) return 'Goofy 🤪';
        if (lowerText.includes('love') || lowerText.includes('crush') || lowerText.includes('heart')) return 'Delulu 💖';
        if (lowerText.includes('confident') || lowerText.includes('boss') || lowerText.includes('queen')) return 'Main Character 👑';
        
        return 'Vibes ✨';
    }

    displayPosts() {
        const postsContainer = document.getElementById('moodPosts');
        
        if (this.posts.length === 0) {
            postsContainer.innerHTML = `
                <div class="no-posts">
                    <p>No vibes posted yet... be the first to share your delulu moment! 🦋</p>
                </div>
            `;
            return;
        }

        postsContainer.innerHTML = this.posts.map(post => {
            const date = post.timestamp ? post.timestamp.toDate() : new Date(post.createdAt);
            const timeAgo = this.getTimeAgo(date);
            
            return `
                <div class="mood-post" data-post-id="${post.id}">
                    <div class="post-header">
                        <div class="post-user">
                            <img src="${post.photoURL || 'https://via.placeholder.com/32x32?text=👤'}" 
                                 alt="${post.displayName}" class="post-user-photo">
                            <span class="post-user-name">${post.displayName || 'Delulu User'}</span>
                        </div>
                        <span class="post-time">${timeAgo}</span>
                    </div>
                    <div class="mood-text">${this.escapeHtml(post.text)}</div>
                    <div class="mood-meta">
                        <span class="mood-tag">${post.mood}</span>
                        <button class="delete-post-btn" onclick="app.deletePost('${post.id}')">🗑️</button>
                    </div>
                </div>
            `;
        }).join('');
    }

    async deletePost(postId) {
        if (!confirm('Are you sure you want to delete this vibe? 🥺')) {
            return;
        }

        try {
            await firebase.firestore().collection('moods').doc(postId).delete();
            this.showNotification('Vibe deleted successfully! 💔', 'success');
            this.loadUserPosts();
        } catch (error) {
            console.error('Error deleting post:', error);
            this.showNotification('Failed to delete the vibe. Please try again.', 'error');
        }
    }

    getTimeAgo(date) {
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        
        return date.toLocaleDateString();
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    savePosts() {
        // No longer needed as we're using Firestore
        // localStorage.setItem('deluluPosts', JSON.stringify(this.posts));
    }

    showNotification(message, type = 'info') {
        // Remove existing notification
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        // Style the notification
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
        } else if (type === 'warning') {
            notification.style.background = 'linear-gradient(45deg, #ff6b6b, #ff8e8e)';
        } else if (type === 'error') {
            notification.style.background = 'linear-gradient(45deg, #ff6b6b, #ff8e8e)';
        } else {
            notification.style.background = 'linear-gradient(45deg, #667eea, #764ba2)';
        }

        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 3000);
    }

    setupPWAInstall() {
        let deferredPrompt;
        
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            
            // Show install button
            const installBtn = document.createElement('button');
            installBtn.className = 'install-prompt';
            installBtn.textContent = 'Install App 📱';
            installBtn.style.display = 'block';
            document.body.appendChild(installBtn);
            
            installBtn.addEventListener('click', async () => {
                if (deferredPrompt) {
                    deferredPrompt.prompt();
                    const { outcome } = await deferredPrompt.userChoice;
                    
                    if (outcome === 'accepted') {
                        this.showNotification('Thanks for installing Delulu Diaries! 🎉', 'success');
                    }
                    
                    deferredPrompt = null;
                    installBtn.remove();
                }
            });
        });
        
        window.addEventListener('appinstalled', () => {
            this.showNotification('Delulu Diaries installed successfully! 💖', 'success');
        });
    }
}

// Initialize the app when DOM is loaded
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new DeluluDiaries();
});

// Add some fun console messages for developers
console.log(`
🌟 Welcome to Delulu Diaries! 🌟
Built with love for Gen Z vibes ✨
Stay delulu, stay happy! 💖
Created with love for the Gen Z by the Gen Z 💕
`);
