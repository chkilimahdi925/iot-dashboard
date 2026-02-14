#!/bin/bash

# Script de démarrage rapide pour le dashboard IoT

echo "🚀 Démarrage du Dashboard IoT DHT11"
echo "===================================="

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Vérifier MongoDB
echo -e "\n${YELLOW}1. Vérification de MongoDB...${NC}"
if systemctl is-active --quiet mongod; then
    echo -e "${GREEN}✅ MongoDB est démarré${NC}"
else
    echo -e "${RED}❌ MongoDB n'est pas démarré${NC}"
    echo "Démarrage de MongoDB..."
    sudo systemctl start mongod
    sleep 2
    if systemctl is-active --quiet mongod; then
        echo -e "${GREEN}✅ MongoDB démarré avec succès${NC}"
    else
        echo -e "${RED}❌ Impossible de démarrer MongoDB${NC}"
        exit 1
    fi
fi

# Démarrer le backend
echo -e "\n${YELLOW}2. Démarrage du Backend Node.js...${NC}"
cd backend
if [ ! -d "node_modules" ]; then
    echo "Installation des dépendances backend..."
    npm install
fi

echo "Démarrage du serveur backend..."
npm start &
BACKEND_PID=$!
sleep 3

if ps -p $BACKEND_PID > /dev/null; then
    echo -e "${GREEN}✅ Backend démarré (PID: $BACKEND_PID)${NC}"
else
    echo -e "${RED}❌ Erreur lors du démarrage du backend${NC}"
    exit 1
fi

# Démarrer le frontend
echo -e "\n${YELLOW}3. Démarrage du Frontend Angular...${NC}"
cd ../frontend
if [ ! -d "node_modules" ]; then
    echo "Installation des dépendances frontend..."
    npm install
fi

echo "Démarrage de l'application Angular..."
npm start &
FRONTEND_PID=$!

echo -e "\n${GREEN}✅ Tous les services sont démarrés !${NC}"
echo ""
echo "📊 Dashboard: http://localhost:4200"
echo "🔌 API Backend: http://localhost:3000"
echo ""
echo "Pour arrêter les services, appuyez sur Ctrl+C"
echo ""

# Attendre que l'utilisateur arrête
wait
