# Delulu Diaries ✨

A Gen Z themed Progressive Web App for sharing your daily vibes and delulu moments!

https://akin-bh.github.io/delulu-diaries/

## Features

- 🎨 **Gen Z Aesthetic**: Vibrant gradients, modern UI, and fun emojis
- 📱 **PWA Ready**: Install on mobile devices for native app experience
- 🌈 **Mood Sharing**: Share your vibes with custom text or preset moods
- 💾 **Local Storage**: Your posts are saved locally in your browser
- 🔄 **Offline Support**: Works even when you're offline
- ⚡ **Fast & Responsive**: Optimized for all screen sizes

## Preset Moods

- **Slay 💅** - For when you're feeling absolutely fabulous
- **Goofy 🤪** - Perfect for silly and fun moments
- **Delulu 💖** - Embrace your delulu era with pride
- **Main Character 👑** - Channel your main character energy

## Installation

1. Open the app in your browser
2. Look for the "Install App" button or use your browser's install option
3. Add to home screen for quick access

## Tech Stack

- **HTML5**: Semantic structure
- **CSS3**: Modern styling with gradients and animations
- **Vanilla JavaScript**: Clean, efficient functionality
- **PWA**: Service worker for offline support
- **Local Storage**: Client-side data persistence

## How to Use

1. **Share Your Vibe**: Type your mood in the text area
2. **Use Presets**: Click preset mood buttons for quick sharing
3. **Submit**: Hit the "Post My Vibe" button
4. **View History**: See all your mood posts in chronological order

## Development

To run locally:
1. Clone or download the files
2. Open `index.html` in a modern browser
3. For PWA features, serve from a local server (like Live Server extension)

⚠️ **Important: Firebase requires a web server** - The app won't work properly when opened directly as a file (file:// protocol).

## Quick Start

### Option 1: Using the Batch File (Windows)
1. Double-click `start-server.bat`
2. Open your browser to `http://localhost:8000`

### Option 2: Manual Server Start
1. Open Command Prompt/PowerShell
2. Navigate to the project folder
3. Run one of these commands:
   - `python -m http.server 8000` (Python)
   - `npx http-server -p 8000` (Node.js)
   - `php -S localhost:8000` (PHP)

### Option 3: Using VS Code Live Server
1. Install "Live Server" extension in VS Code
2. Right-click on `index.html` and select "Open with Live Server"

## Authentication Flow
- `index.html` - Main app (requires authentication)
- `login.html` - Login page (Google sign-in)
- App automatically redirects between pages based on auth state

## Troubleshooting

**App stuck on loading screen:**
- Check browser console for errors
- Ensure you're using http://localhost, not file://
- Check Firebase configuration
- Verify internet connection

**Authentication issues:**
- Clear browser cache and cookies
- Check Firebase console for authentication logs
- Ensure popup blockers are disabled

## Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

---

*Stay delulu, stay happy! 💖*
