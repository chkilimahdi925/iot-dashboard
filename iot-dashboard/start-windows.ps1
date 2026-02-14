# ==========================================
# Script PowerShell de demarrage pour Windows
# Dashboard IoT - DHT11
# ==========================================

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Demarrage du Dashboard IoT" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verifier Node.js
try {
    $nodeVersion = node --version
    Write-Host "[OK] Node.js detecte: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "[ERREUR] Node.js n'est pas installe !" -ForegroundColor Red
    Write-Host "Telechargez depuis: https://nodejs.org/" -ForegroundColor Yellow
    Read-Host "Appuyez sur Entree pour quitter"
    exit 1
}

Write-Host ""
Write-Host "----------------------------------------" -ForegroundColor Yellow
Write-Host " 1. Demarrage du Backend..." -ForegroundColor Yellow
Write-Host "----------------------------------------" -ForegroundColor Yellow

# Demarrer le backend dans une nouvelle fenetre
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend'; npm start"
Write-Host "[OK] Backend demarre" -ForegroundColor Green

# Attendre
Start-Sleep -Seconds 5

Write-Host ""
Write-Host "----------------------------------------" -ForegroundColor Yellow
Write-Host " 2. Demarrage du Frontend..." -ForegroundColor Yellow
Write-Host "----------------------------------------" -ForegroundColor Yellow

# Demarrer le frontend dans une nouvelle fenetre
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\frontend'; ng serve"
Write-Host "[OK] Frontend demarre" -ForegroundColor Green

# Attendre
Start-Sleep -Seconds 8

Write-Host ""
Write-Host "----------------------------------------" -ForegroundColor Yellow
Write-Host " 3. Ouverture du navigateur..." -ForegroundColor Yellow
Write-Host "----------------------------------------" -ForegroundColor Yellow

# Ouvrir le navigateur
Start-Process "http://localhost:4200"
Write-Host "[OK] Navigateur ouvert" -ForegroundColor Green

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Dashboard IoT demarre avec succes !" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Backend:  http://localhost:3000" -ForegroundColor White
Write-Host "  Frontend: http://localhost:4200" -ForegroundColor White
Write-Host ""
Write-Host "Fermez les fenetres Backend et Frontend pour arreter." -ForegroundColor Gray
Write-Host ""
Read-Host "Appuyez sur Entree pour fermer cette fenetre"
