@echo off
title IoT Dashboard - Backend Server
color 0A

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║        🚀 IoT Dashboard Backend - Multi-Appareils            ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

REM Vérifier si Node.js est installé
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js n'est pas installé !
    echo.
    echo 📥 Téléchargez Node.js depuis: https://nodejs.org/
    echo.
    pause
    exit /b
)

echo ✅ Node.js trouvé: 
node --version
echo.

REM Vérifier si node_modules existe
if not exist "node_modules" (
    echo 📦 Installation des dépendances...
    echo.
    call npm install
    echo.
)

echo.
echo 🔧 Configuration MongoDB:
echo    Assurez-vous d'avoir configuré l'URL MongoDB Atlas dans .env
echo.
echo 📡 Démarrage du serveur...
echo.

REM Démarrer le serveur multi-appareils
call npm run start:multi

echo.
echo ❌ Le serveur s'est arrêté
pause
