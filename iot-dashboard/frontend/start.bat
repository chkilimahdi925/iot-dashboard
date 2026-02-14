@echo off
title IoT Dashboard - Frontend Angular
color 0B

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║        🌐 IoT Dashboard Frontend - Angular                   ║
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
    echo 📦 Installation des dépendances Angular...
    echo    ⏳ Cela peut prendre quelques minutes...
    echo.
    call npm install
    echo.
)

echo 🚀 Démarrage du serveur Angular...
echo.
echo ⏳ Le serveur démarre... Patientez...
echo.
echo 📊 Une fois démarré, ouvrez votre navigateur sur:
echo    👉 http://localhost:4200
echo.

REM Démarrer Angular
call npm start

echo.
echo ❌ Le serveur s'est arrêté
pause
