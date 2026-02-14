@echo off
REM ==========================================
REM Script de demarrage pour Windows
REM Dashboard IoT - DHT11
REM ==========================================

echo.
echo ========================================
echo   Demarrage du Dashboard IoT
echo ========================================
echo.

REM Verifier Node.js
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERREUR] Node.js n'est pas installe !
    echo Telechargez depuis: https://nodejs.org/
    pause
    exit /b 1
)

echo [OK] Node.js detecte
node --version

echo.
echo ----------------------------------------
echo  1. Demarrage du Backend...
echo ----------------------------------------
cd backend
start "IoT Backend" cmd /k "npm start"

echo [OK] Backend demarre dans une nouvelle fenetre

REM Attendre que le backend demarre
timeout /t 5 /nobreak > nul

echo.
echo ----------------------------------------
echo  2. Demarrage du Frontend...
echo ----------------------------------------
cd ..\frontend
start "IoT Frontend" cmd /k "ng serve"

echo [OK] Frontend demarre dans une nouvelle fenetre

REM Attendre que le frontend demarre
timeout /t 8 /nobreak > nul

echo.
echo ----------------------------------------
echo  3. Ouverture du navigateur...
echo ----------------------------------------
start http://localhost:4200

echo.
echo ========================================
echo   Dashboard IoT demarre avec succes !
echo ========================================
echo.
echo   Backend:  http://localhost:3000
echo   Frontend: http://localhost:4200
echo.
echo Fermez les fenetres Backend et Frontend pour arreter.
echo.
pause
