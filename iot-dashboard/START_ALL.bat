@echo off
title IoT Dashboard - Démarrage Complet
color 0E

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║            🏠 IoT Dashboard Multi-Appareils                  ║
echo ║              Démarrage Backend + Frontend                    ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

echo ⚠️  Ce script va ouvrir 2 fenêtres:
echo    1️⃣  Backend (Node.js)
echo    2️⃣  Frontend (Angular)
echo.
echo ⏳ Attendez que les deux serveurs démarrent avant d'accéder au dashboard
echo.
pause

echo.
echo 🚀 Démarrage du Backend...
start "IoT Backend" cmd /k "cd backend && start.bat"

timeout /t 3 /nobreak >nul

echo.
echo 🌐 Démarrage du Frontend...
start "IoT Frontend" cmd /k "cd frontend && start.bat"

echo.
echo ✅ Les deux serveurs sont en cours de démarrage !
echo.
echo 📊 Accédez au dashboard sur: http://localhost:4200
echo.
echo 💡 Pour arrêter les serveurs:
echo    - Fermez les deux fenêtres qui se sont ouvertes
echo    - Ou appuyez sur Ctrl+C dans chaque fenêtre
echo.
echo.
pause
