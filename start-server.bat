@echo off
echo Starting Delulu Diaries Development Server...
echo.
echo Opening browser at http://localhost:8000
echo Press Ctrl+C to stop the server
echo.

cd /d "%~dp0"

:: Try different server options
if exist "C:\Program Files\nodejs\node.exe" (
    echo Using Node.js http-server...
    npx http-server -p 8000 -c-1
) else if exist "C:\Python39\python.exe" (
    echo Using Python 3.9 server...
    "C:\Python39\python.exe" -m http.server 8000
) else if exist "C:\Python38\python.exe" (
    echo Using Python 3.8 server...
    "C:\Python38\python.exe" -m http.server 8000
) else (
    echo Trying python command...
    python -m http.server 8000
)

pause
