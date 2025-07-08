// Auth Check - This runs before the main app loads
// This file checks if user is authenticated and redirects accordingly

console.log('🔍 Checking authentication state...');

// Wait for Firebase to initialize
window.addEventListener('load', () => {
    // Give Firebase a moment to initialize
    setTimeout(() => {
        if (typeof firebase === 'undefined') {
            console.error('❌ Firebase not loaded! Make sure you are serving from a local server.');
            document.body.innerHTML = `
                <div style="
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 100vh;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    font-family: 'Poppins', sans-serif;
                    color: white;
                    text-align: center;
                    padding: 20px;
                ">
                    <div style="
                        background: rgba(255, 255, 255, 0.1);
                        padding: 40px;
                        border-radius: 20px;
                        backdrop-filter: blur(10px);
                        max-width: 500px;
                    ">
                        <h2 style="margin-bottom: 20px;">⚠️ Server Required</h2>
                        <p style="margin-bottom: 15px;">You need to serve this app from a local server!</p>
                        <p style="margin-bottom: 15px;"><strong>In VS Code:</strong></p>
                        <ol style="text-align: left; margin-bottom: 20px;">
                            <li>Install "Live Server" extension</li>
                            <li>Right-click on index.html</li>
                            <li>Select "Open with Live Server"</li>
                        </ol>
                        <p style="color: #ffeb3b;"><strong>URL should be:</strong> http://localhost:5500 or http://127.0.0.1:5500</p>
                        <p style="color: #f44336;"><strong>NOT:</strong> file:///C:/Users/...</p>
                    </div>
                </div>
            `;
            return;
        }

        // Check if user is authenticated
        firebase.auth().onAuthStateChanged((user) => {
            if (!user) {
                console.log('🔄 User not authenticated, redirecting to login...');
                // Only redirect if we're not already on the login page
                if (!window.location.pathname.includes('login.html')) {
                    window.location.href = 'login.html';
                }
            } else {
                console.log('✅ User authenticated:', user.displayName);
                // If we're on login page and user is authenticated, redirect to main app
                if (window.location.pathname.includes('login.html')) {
                    window.location.href = 'index.html';
                }
            }
        });
    }, 1000);
});
