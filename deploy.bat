@echo off
echo ===============================================
echo 🚀 DELULU DIARIES - DEPLOYMENT SCRIPT
echo ===============================================
echo.

echo 📦 Adding changes to git...
git add .

echo 📝 Committing changes...
set /p commit_message="Enter commit message (or press Enter for default): "
if "%commit_message%"=="" set commit_message=Update Delulu Diaries app

git commit -m "%commit_message%"

echo 🚀 Pushing to GitHub...
git push

echo.
echo ✅ SUCCESS! Your code has been pushed to GitHub
echo.
echo 🌐 DEPLOYMENT OPTIONS:
echo.
echo 1. GitHub Pages:
echo    - Go to: https://github.com/akin-bh/delulu-diaries/settings/pages
echo    - Enable GitHub Pages from main branch
echo    - Your app will be live at: https://akin-bh.github.io/delulu-diaries/
echo.
echo 2. Netlify:
echo    - Go to: https://app.netlify.com/drop
echo    - Drag and drop your project folder
echo    - Get instant live URL
echo.
echo 3. Vercel:
echo    - Go to: https://vercel.com/import/git
echo    - Import your GitHub repository
echo    - Get instant deployment
echo.
echo ===============================================
echo ✨ DELULU DIARIES IS READY FOR THE WORLD! ✨
echo ===============================================

pause
