@echo off
REM FerIOX KICK App - Quick Start Script for Windows
REM This script helps you set up the application quickly

echo ============================================
echo   FerIOX KICK App - Quick Start
echo ============================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js is not installed
    echo Please install Node.js 18+ from https://nodejs.org/
    pause
    exit /b 1
)

echo [OK] Node.js found
node --version

REM Check if npm is installed
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: npm is not installed
    pause
    exit /b 1
)

echo [OK] npm found
npm --version
echo.

REM Install dependencies
echo Installing dependencies...
echo.

call npm run install:all
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

echo [OK] Dependencies installed successfully
echo.

REM Setup backend .env
echo Setting up backend configuration...
if not exist backend\.env (
    copy backend\.env.example backend\.env
    echo [OK] Created backend\.env
    echo WARNING: Please edit backend\.env with your KICK credentials
) else (
    echo WARNING: backend\.env already exists
)

REM Setup frontend .env
if not exist frontend\.env (
    copy frontend\.env.example frontend\.env
    echo [OK] Created frontend\.env
) else (
    echo WARNING: frontend\.env already exists
)

echo.
echo ============================================
echo [OK] Setup complete!
echo ============================================
echo.
echo Next steps:
echo.
echo 1. Edit backend\.env with your KICK credentials:
echo    - Get credentials from: https://kick.com/developer/applications
echo    - Set KICK_CLIENT_ID
echo    - Set KICK_CLIENT_SECRET
echo    - Set COOKIE_SECRET (use a random string)
echo.
echo 2. Start the backend (in one PowerShell window):
echo    npm run dev:backend
echo.
echo 3. Start the frontend (in another PowerShell window):
echo    npm run dev:frontend
echo.
echo 4. Open your browser at:
echo    http://localhost:5173
echo.
echo Documentation: .\docs\
echo Need help? Check .\docs\SETUP.md
echo.
pause
