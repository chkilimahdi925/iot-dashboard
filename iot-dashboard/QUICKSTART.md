# 🚀 Guide de Démarrage Rapide

## Installation en 5 minutes

### 📋 Prérequis
- Node.js v18+ installé
- MongoDB installé et démarré
- ESP8266 déjà configuré et envoyant des données

### ⚡ Installation Express

#### Option 1: Installation Manuelle

```bash
# 1. Aller dans le dossier backend
cd backend

# 2. Installer les dépendances
npm install

# 3. Vérifier la configuration dans .env
# Modifier MQTT_BROKER si nécessaire
cat .env

# 4. Démarrer le backend
npm start
```

Dans un **nouveau terminal**:

```bash
# 5. Aller dans le dossier frontend
cd frontend

# 6. Installer Angular CLI (si nécessaire)
npm install -g @angular/cli

# 7. Installer les dépendances
npm install

# 8. Démarrer le frontend
ng serve
```

#### Option 2: Script Automatique

```bash
# Depuis la racine du projet
chmod +x start.sh
./start.sh
```

#### Option 3: Docker (le plus simple)

```bash
# Depuis la racine du projet
docker-compose up -d

# Le backend sera sur http://localhost:3000
# Le frontend doit être lancé manuellement avec 'ng serve'
```

### 🌐 Accéder à l'application

Ouvrez votre navigateur sur: **http://localhost:4200**

### ✅ Vérifications

1. **MongoDB fonctionne ?**
   ```bash
   sudo systemctl status mongod
   ```

2. **Backend reçoit les données MQTT ?**
   - Regarder la console du backend
   - Vous devriez voir: `📥 Données reçues: {temp: XX, hum: XX}`

3. **Frontend affiche les données ?**
   - Ouvrir http://localhost:4200
   - Appuyer sur F12 pour voir la console
   - Vérifier qu'il n'y a pas d'erreurs

### 🐛 Problèmes courants

**Backend ne démarre pas:**
```bash
# Vérifier que MongoDB est démarré
sudo systemctl start mongod
```

**Frontend ne compile pas:**
```bash
# Réinstaller les dépendances
cd frontend
rm -rf node_modules
npm install
```

**Pas de données affichées:**
```bash
# Tester le broker MQTT
mosquitto_sub -h 172.22.241.241 -t "home/esp8266/dht11" -v

# Vérifier les logs du backend
# Vérifier que l'ESP8266 envoie bien des données
```

### 📊 Tester l'API

```bash
# Obtenir les dernières données
curl http://localhost:3000/api/sensor/latest

# Obtenir l'historique
curl http://localhost:3000/api/sensor/history?hours=24

# Obtenir les statistiques
curl http://localhost:3000/api/sensor/stats
```

### 🎯 Prochaines Étapes

1. Personnaliser l'intervalle de rafraîchissement de l'ESP8266
2. Ajouter des graphiques avec Chart.js
3. Configurer des alertes
4. Déployer en production

Pour plus de détails, consultez le [README.md](README.md) complet.
