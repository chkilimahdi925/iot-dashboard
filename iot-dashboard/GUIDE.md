# 📁 Structure du Projet IoT Dashboard

## 🎯 Votre Projet Complet

```
iot-dashboard/
│
├── 📂 backend/              → Serveur Node.js + MQTT + MongoDB
│   ├── models/
│   │   └── SensorData.js    → Modèle de données MongoDB
│   ├── server.js            → ⭐ Serveur principal
│   ├── package.json         → Dépendances Node.js
│   ├── .env                 → ⚙️ Configuration (IP MQTT, MongoDB)
│   ├── Dockerfile           → Pour Docker
│   └── test-api.js          → Tests de l'API
│
├── 📂 frontend/             → Application Angular
│   ├── src/
│   │   └── app/
│   │       ├── components/
│   │       │   └── dashboard/
│   │       │       ├── dashboard.component.ts    → ⭐ Logique du dashboard
│   │       │       ├── dashboard.component.html  → Interface utilisateur
│   │       │       └── dashboard.component.css   → Styles
│   │       ├── services/
│   │       │   └── sensor.service.ts             → ⭐ Connexion API + WebSocket
│   │       ├── app.module.ts                     → Configuration Angular
│   │       └── app.component.ts                  → Composant racine
│   └── package.json         → Dépendances Angular
│
├── 📄 README.md             → Documentation complète
├── 📄 QUICKSTART.md         → Guide de démarrage rapide
├── 📄 docker-compose.yml    → Déploiement Docker
├── 🚀 start.sh             → Script de démarrage automatique
└── 📄 .gitignore           → Fichiers à ignorer

```

## 🔑 Fichiers Importants

### Backend (Node.js)

| Fichier | Description | À Modifier ? |
|---------|-------------|--------------|
| `backend/.env` | Configuration MQTT et MongoDB | ✅ OUI - Vérifier l'IP du broker MQTT |
| `backend/server.js` | Serveur principal | ❌ Non (sauf personnalisation) |
| `backend/models/SensorData.js` | Structure des données | ❌ Non |

### Frontend (Angular)

| Fichier | Description | À Modifier ? |
|---------|-------------|--------------|
| `frontend/src/app/services/sensor.service.ts` | Connexion API | ✅ Si backend sur autre IP |
| `frontend/src/app/components/dashboard/` | Interface du dashboard | ✅ Pour personnaliser l'UI |

## ⚙️ Configuration Requise

### 1. Backend (.env)
```env
MQTT_BROKER=172.22.241.241  ← Vérifier cette IP !
MQTT_PORT=1883
MQTT_TOPIC=home/esp8266/dht11
MONGODB_URI=mongodb://localhost:27017/iot_sensors
PORT=3000
```

### 2. ESP8266 (déjà configuré)
```cpp
const char* MQTT_SERVER = "172.22.241.241";  ← Doit correspondre
const char* MQTT_TOPIC = "home/esp8266/dht11"; ← Doit correspondre
```

## 🚀 Démarrage Rapide

### Option 1: Manuel
```bash
# Terminal 1 - Backend
cd backend
npm install
npm start

# Terminal 2 - Frontend
cd frontend
npm install
ng serve
```

### Option 2: Script automatique
```bash
chmod +x start.sh
./start.sh
```

### Option 3: Docker
```bash
docker-compose up -d
cd frontend && ng serve
```

## 🌐 URLs d'Accès

- **Dashboard Web:** http://localhost:4200
- **API Backend:** http://localhost:3000
- **MongoDB:** localhost:27017

## 📊 Flux de Données

```
ESP8266 (DHT11)
    │
    │ WiFi → MQTT
    ↓
Broker MQTT (Mosquitto)
    │
    │ Subscribe
    ↓
Backend Node.js
    │
    ├─→ MongoDB (Stockage)
    │
    └─→ WebSocket (Temps réel)
         │
         ↓
    Angular Frontend
         │
         ↓
    Navigateur Web
```

## ✅ Checklist de Démarrage

- [ ] MongoDB installé et démarré (`sudo systemctl start mongod`)
- [ ] Broker MQTT (Mosquitto) actif sur Raspberry Pi
- [ ] ESP8266 envoie des données (vérifier Serial Monitor)
- [ ] Backend démarre sans erreur (`npm start` dans backend/)
- [ ] Frontend compile sans erreur (`ng serve` dans frontend/)
- [ ] Dashboard accessible sur http://localhost:4200
- [ ] Données s'affichent en temps réel

## 🆘 Aide Rapide

**Backend ne démarre pas:**
```bash
sudo systemctl start mongod
```

**Frontend ne compile pas:**
```bash
cd frontend
rm -rf node_modules
npm install
```

**Pas de données:**
```bash
# Tester MQTT
mosquitto_sub -h 172.22.241.241 -t "home/esp8266/dht11" -v
```

## 📞 Support

Consultez:
1. `README.md` pour la documentation complète
2. `QUICKSTART.md` pour le guide rapide
3. Les logs du backend pour debugger
4. La console du navigateur (F12) pour les erreurs frontend

---

✨ Votre dashboard IoT est prêt à l'emploi ! ✨
