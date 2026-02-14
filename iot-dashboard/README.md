# 🌡️ IoT Dashboard - ESP8266 DHT11

Tableau de bord web pour visualiser en temps réel les données de température et humidité d'un capteur DHT11 connecté à un ESP8266.

## 📋 Architecture

```
ESP8266 (DHT11) → MQTT Broker (Mosquitto) → Node.js Backend → MongoDB
                                                    ↓
                                              Angular Frontend
```

## 🛠️ Prérequis

- **Node.js** v18+ et npm
- **MongoDB** (installé et démarré)
- **Broker MQTT** (Mosquitto sur Raspberry Pi)
- **ESP8266** avec code déjà configuré et fonctionnel

## 📦 Installation

### 1️⃣ Installation de MongoDB

#### Sur Ubuntu/Debian (ou Raspberry Pi):
```bash
# Importer la clé publique
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

# Ajouter le repository
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Installer MongoDB
sudo apt-get update
sudo apt-get install -y mongodb-org

# Démarrer MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Vérifier le statut
sudo systemctl status mongod
```

#### Sur Windows:
- Téléchargez MongoDB Community Server depuis https://www.mongodb.com/try/download/community
- Installez et démarrez le service MongoDB

#### Sur macOS:
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

### 2️⃣ Installation du Backend

```bash
cd backend

# Installer les dépendances
npm install

# Modifier le fichier .env si nécessaire
# Vérifier que l'IP du broker MQTT est correcte
nano .env

# Démarrer le serveur
npm start
```

Le serveur backend démarre sur **http://localhost:3000**

### 3️⃣ Installation du Frontend

```bash
# Dans un nouveau terminal
cd frontend

# Installer Angular CLI globalement (si pas déjà fait)
npm install -g @angular/cli

# Installer les dépendances
npm install

# Démarrer l'application Angular
ng serve

# Ou simplement
npm start
```

L'application Angular démarre sur **http://localhost:4200**

## 🚀 Utilisation

1. **Vérifier que MongoDB est démarré:**
   ```bash
   sudo systemctl status mongod
   ```

2. **Vérifier que le broker MQTT fonctionne:**
   ```bash
   # Sur le Raspberry Pi
   sudo systemctl status mosquitto
   ```

3. **Démarrer le backend Node.js:**
   ```bash
   cd backend
   npm start
   ```
   
   Vous devriez voir:
   ```
   ✅ MongoDB connecté
   ✅ Connecté au broker MQTT
   📡 Abonné au topic: home/esp8266/dht11
   🚀 Serveur démarré sur http://localhost:3000
   ```

4. **Démarrer le frontend Angular:**
   ```bash
   cd frontend
   ng serve
   ```

5. **Ouvrir le navigateur:**
   - Accédez à http://localhost:4200
   - Vous devriez voir le dashboard avec les données en temps réel

## 📊 Fonctionnalités

### Dashboard Web
- ✅ **Affichage en temps réel** des données de température et humidité
- ✅ **Mises à jour automatiques** via WebSocket
- ✅ **Statistiques** (moyenne, min, max) sur une période configurable
- ✅ **Historique** des dernières mesures
- ✅ **Indicateurs visuels** avec codes couleur
- ✅ **Responsive design** adapté mobile/tablette

### API REST

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/sensor/latest` | Dernières données |
| GET | `/api/sensor/history?limit=100&hours=24` | Historique |
| GET | `/api/sensor/stats?hours=24` | Statistiques |
| GET | `/api/sensor/range?start=DATE&end=DATE` | Données par période |
| DELETE | `/api/sensor/cleanup?days=30` | Nettoyer anciennes données |

### Exemples d'utilisation de l'API

```bash
# Dernières données
curl http://localhost:3000/api/sensor/latest

# Historique des 24 dernières heures
curl http://localhost:3000/api/sensor/history?hours=24&limit=50

# Statistiques
curl http://localhost:3000/api/sensor/stats?hours=48
```

## 🔧 Configuration

### Backend (.env)

```env
# Broker MQTT
MQTT_BROKER=172.22.241.241
MQTT_PORT=1883
MQTT_TOPIC=home/esp8266/dht11

# MongoDB
MONGODB_URI=mongodb://localhost:27017/iot_sensors

# Serveur
PORT=3000
```

### Frontend (sensor.service.ts)

Si votre backend n'est pas sur localhost:3000, modifiez:
```typescript
private apiUrl = 'http://VOTRE_IP:3000/api/sensor';
```

## 🐛 Dépannage

### Le backend ne reçoit pas les données MQTT

1. Vérifier que Mosquitto fonctionne:
   ```bash
   sudo systemctl status mosquitto
   ```

2. Tester avec mosquitto_sub:
   ```bash
   mosquitto_sub -h 172.22.241.241 -t "home/esp8266/dht11" -v
   ```

3. Vérifier l'ESP8266:
   - Ouvrir le Serial Monitor Arduino IDE
   - Vérifier que les données sont envoyées

### MongoDB ne démarre pas

```bash
# Vérifier les logs
sudo journalctl -u mongod

# Redémarrer MongoDB
sudo systemctl restart mongod
```

### Le frontend ne reçoit pas les mises à jour en temps réel

1. Vérifier la console du navigateur (F12)
2. Vérifier que Socket.IO est connecté
3. Vérifier CORS dans le backend (déjà configuré)

### Erreur CORS

Si vous avez des erreurs CORS, vérifiez que le frontend utilise bien `http://localhost:4200` et que le backend autorise cette origine dans `server.js`.

## 📁 Structure du Projet

```
iot-dashboard/
├── backend/
│   ├── models/
│   │   └── SensorData.js       # Modèle MongoDB
│   ├── server.js               # Serveur principal
│   ├── package.json
│   └── .env                    # Configuration
│
└── frontend/
    ├── src/
    │   └── app/
    │       ├── components/
    │       │   └── dashboard/
    │       │       ├── dashboard.component.ts
    │       │       ├── dashboard.component.html
    │       │       └── dashboard.component.css
    │       ├── services/
    │       │   └── sensor.service.ts
    │       ├── app.module.ts
    │       └── app.component.ts
    └── package.json
```

## 🎨 Personnalisation

### Modifier l'intervalle de mise à jour de l'ESP8266

Dans le code ESP8266, modifiez:
```cpp
delay(3000); // 3 secondes
```

### Ajouter des graphiques

Le projet peut être étendu avec Chart.js ou ng2-charts pour afficher des graphiques en temps réel.

### Modifier les seuils de couleur

Dans `dashboard.component.ts`, modifiez les méthodes:
- `getTemperatureColor()`
- `getHumidityColor()`

## 📝 Améliorations Possibles

- [ ] Graphiques en temps réel avec Chart.js
- [ ] Alertes par email/SMS si valeurs anormales
- [ ] Export des données en CSV/Excel
- [ ] Authentification utilisateur
- [ ] Dashboard multi-capteurs
- [ ] Prévisions basées sur l'historique
- [ ] Application mobile (Ionic/React Native)

## 🤝 Support

Pour toute question ou problème:
1. Vérifier les logs du backend
2. Vérifier la console du navigateur
3. Tester chaque composant séparément (MQTT, MongoDB, Backend, Frontend)

## 📄 Licence

Ce projet est libre d'utilisation pour des projets personnels et éducatifs.

---

Créé avec ❤️ pour l'IoT et le DIY
