# 🪟 Installation sur Windows avec MongoDB Atlas

## 🎯 Configuration

- ✅ **Backend Node.js** sur Windows
- ✅ **MongoDB Atlas** (cloud)
- ✅ **Frontend Angular** sur Windows
- ✅ **DHT11** pour commencer (extensible)

## 📋 Prérequis

### 1. Node.js
Téléchargez et installez Node.js v18+ depuis: https://nodejs.org/

Vérifiez l'installation:
```cmd
node --version
npm --version
```

### 2. Git (optionnel mais recommandé)
https://git-scm.com/download/win

### 3. Visual Studio Code (recommandé)
https://code.visualstudio.com/

## 🗄️ Configuration MongoDB Atlas

### Étape 1: Créer un Compte Gratuit

1. Allez sur https://www.mongodb.com/cloud/atlas/register
2. Créez un compte (gratuit)
3. Créez une organisation (ou utilisez celle par défaut)

### Étape 2: Créer un Cluster Gratuit

1. Cliquez sur **"Build a Database"**
2. Choisissez **FREE** (M0 Sandbox)
3. Sélectionnez un provider et une région proche de vous:
   - **Provider**: AWS, Google Cloud, ou Azure
   - **Région**: Choisissez la plus proche (ex: Europe - Frankfurt)
4. Nommez votre cluster: `iot-cluster` (ou autre nom)
5. Cliquez sur **"Create"** et attendez 1-3 minutes

### Étape 3: Créer un Utilisateur de Base de Données

1. Dans **Security > Database Access**
2. Cliquez sur **"Add New Database User"**
3. Choisissez **"Password"** comme méthode d'authentification
4. Entrez:
   - **Username**: `iot_user` (ou votre choix)
   - **Password**: Générez un mot de passe fort (notez-le !)
5. **Database User Privileges**: Choisissez **"Read and write to any database"**
6. Cliquez sur **"Add User"**

### Étape 4: Configurer l'Accès Réseau

1. Dans **Security > Network Access**
2. Cliquez sur **"Add IP Address"**
3. Choisissez **"ALLOW ACCESS FROM ANYWHERE"** (pour simplifier)
   - IP: `0.0.0.0/0`
   - ⚠️ Pour production, limitez à votre IP
4. Cliquez sur **"Confirm"**

### Étape 5: Obtenir la Chaîne de Connexion

1. Retournez à **Database > Clusters**
2. Cliquez sur **"Connect"** sur votre cluster
3. Choisissez **"Connect your application"**
4. Sélectionnez:
   - **Driver**: Node.js
   - **Version**: 4.1 or later
5. Copiez la chaîne de connexion, elle ressemble à:
   ```
   mongodb+srv://iot_user:<password>@iot-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. **IMPORTANT**: Remplacez `<password>` par votre vrai mot de passe !

**Exemple final:**
```
mongodb+srv://iot_user:MonMotDePasse123@iot-cluster.abc12.mongodb.net/?retryWrites=true&w=majority
```

## 📦 Installation du Projet

### 1. Extraire le Projet

Extraire l'archive dans un dossier, par exemple:
```
C:\Users\VotreNom\iot-dashboard\
```

### 2. Installer les Dépendances Backend

Ouvrez **PowerShell** ou **Command Prompt** et:

```cmd
cd C:\Users\VotreNom\iot-dashboard\backend
npm install
```

### 3. Configurer le Backend

Éditez le fichier: `backend\.env`

**Remplacez:**
```env
# Configuration MQTT
MQTT_BROKER=172.22.241.241
MQTT_PORT=1883
MQTT_TOPIC=home/esp8266/dht11

# Configuration MongoDB - ATLAS CLOUD
MONGODB_URI=mongodb+srv://iot_user:VotreMotDePasse@iot-cluster.xxxxx.mongodb.net/iot_sensors?retryWrites=true&w=majority

# Configuration Serveur
PORT=3000
```

**Points importants:**
- ✅ Mettez votre vraie chaîne de connexion MongoDB Atlas
- ✅ Ajoutez `/iot_sensors` après `.net/` pour nommer la base de données
- ✅ Vérifiez l'IP de votre Raspberry Pi MQTT

### 4. Tester le Backend

```cmd
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

**Si erreur de connexion MongoDB:**
- Vérifiez le mot de passe dans l'URI
- Vérifiez que l'IP `0.0.0.0/0` est autorisée dans Network Access
- Attendez 1-2 minutes après avoir créé le cluster

### 5. Installer les Dépendances Frontend

**Dans une NOUVELLE fenêtre PowerShell/CMD:**

```cmd
cd C:\Users\VotreNom\iot-dashboard\frontend
npm install
```

### 6. Installer Angular CLI (si pas déjà fait)

```cmd
npm install -g @angular/cli
```

### 7. Démarrer le Frontend

```cmd
cd frontend
ng serve
```

Ou simplement:
```cmd
npm start
```

Le frontend démarre sur: **http://localhost:4200**

## 🚀 Démarrage Quotidien

### Méthode 1: Deux Fenêtres CMD

**Fenêtre 1 - Backend:**
```cmd
cd C:\Users\VotreNom\iot-dashboard\backend
npm start
```

**Fenêtre 2 - Frontend:**
```cmd
cd C:\Users\VotreNom\iot-dashboard\frontend
ng serve
```

### Méthode 2: Script PowerShell

Créez `start.ps1` à la racine:

```powershell
# Démarrer le backend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; npm start"

# Attendre 3 secondes
Start-Sleep -Seconds 3

# Démarrer le frontend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; ng serve"

# Ouvrir le navigateur
Start-Sleep -Seconds 5
Start-Process "http://localhost:4200"
```

Exécution:
```cmd
powershell -ExecutionPolicy Bypass -File start.ps1
```

### Méthode 3: Batch Script

Créez `start.bat`:

```batch
@echo off
echo Démarrage du Dashboard IoT...

start "Backend IoT" cmd /k "cd backend && npm start"
timeout /t 3 /nobreak > nul

start "Frontend IoT" cmd /k "cd frontend && ng serve"
timeout /t 5 /nobreak > nul

start http://localhost:4200
```

Double-cliquez sur `start.bat` pour tout démarrer !

## 🔧 Configuration DHT11 Uniquement

Le système est déjà configuré pour DHT11. Vérifiez simplement dans:

**`backend/config/devices.config.js`:**

```javascript
const DEVICES = [
  {
    id: 'esp8266_dht11',
    name: 'Capteur Température/Humidité',
    type: 'DHT11',
    location: 'Salon',
    mqttTopic: 'home/esp8266/dht11',
    icon: '🌡️',
    enabled: true,  // ✅ Activé
    sensors: [
      {
        key: 'temp',
        label: 'Température',
        unit: '°C',
        type: 'temperature',
        icon: '🌡️',
        thresholds: {
          min: 18,
          max: 28,
          critical_min: 10,
          critical_max: 35
        }
      },
      {
        key: 'hum',
        label: 'Humidité',
        unit: '%',
        type: 'humidity',
        icon: '💧',
        thresholds: {
          min: 30,
          max: 60,
          critical_min: 20,
          critical_max: 80
        }
      }
    ]
  }
  // Tous les autres appareils sont disabled
];
```

**Pour désactiver les exemples (optionnel):**

Vous pouvez supprimer ou laisser les autres appareils avec `enabled: false`. Ils n'apparaîtront pas sur le dashboard.

## 📊 Vérifier MongoDB Atlas

### Option 1: Interface Web Atlas

1. Connectez-vous sur https://cloud.mongodb.com
2. Allez dans **Database > Browse Collections**
3. Vous devriez voir la base `iot_sensors`
4. Collection: `sensordatas` avec vos données DHT11

### Option 2: MongoDB Compass (Interface Graphique)

1. Téléchargez MongoDB Compass: https://www.mongodb.com/try/download/compass
2. Installez-le
3. Connectez-vous avec votre URI MongoDB Atlas
4. Explorez visuellement vos données

## 🐛 Dépannage Windows

### Erreur: "ng n'est pas reconnu"

```cmd
npm install -g @angular/cli
# Redémarrez le CMD/PowerShell
```

### Erreur: Scripts désactivés (PowerShell)

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Port 3000 déjà utilisé

Changez le port dans `backend\.env`:
```env
PORT=3001
```

Et dans `frontend/src/app/services/sensor-multi.service.ts`:
```typescript
private apiUrl = 'http://localhost:3001/api';
```

### Backend ne se connecte pas à MQTT

Vérifiez:
1. L'IP du Raspberry Pi est correcte dans `.env`
2. Mosquitto fonctionne sur le Raspberry Pi
3. Pas de firewall bloquant

Test depuis Windows:
```cmd
# Si vous avez mosquitto-clients installé
mosquitto_sub -h 172.22.241.241 -t "home/esp8266/dht11" -v
```

### MongoDB Atlas: Connection Timeout

1. Vérifiez Network Access (0.0.0.0/0 autorisé)
2. Attendez 2-3 minutes après création du cluster
3. Vérifiez que votre mot de passe ne contient pas de caractères spéciaux non encodés
4. Essayez d'encoder le mot de passe: https://www.urlencoder.org/

## 📱 Ajouter d'Autres Capteurs Plus Tard

Quand vous voudrez ajouter un capteur (ex: MQ-2 pour gaz):

1. **Éditez** `backend/config/devices.config.js`
2. **Activez** l'appareil désiré: `enabled: true`
3. **Redémarrez** le backend

Le nouveau capteur apparaît automatiquement !

Voir le fichier `GUIDE_AJOUT_APPAREILS.md` pour plus de détails.

## ✅ Checklist Finale

- [ ] MongoDB Atlas cluster créé
- [ ] Utilisateur de base de données créé
- [ ] Network Access configuré (0.0.0.0/0)
- [ ] URI de connexion copiée et mot de passe remplacé
- [ ] Node.js installé sur Windows
- [ ] Dépendances backend installées (`npm install`)
- [ ] Fichier `.env` configuré avec l'URI Atlas
- [ ] Backend démarre sans erreur
- [ ] Dépendances frontend installées
- [ ] Angular CLI installé globalement
- [ ] Frontend démarre sur localhost:4200
- [ ] ESP8266 envoie des données MQTT
- [ ] Données visibles sur le dashboard

## 🌐 Accès

Une fois tout démarré:

- **Dashboard**: http://localhost:4200
- **API Backend**: http://localhost:3000
- **MongoDB Atlas**: https://cloud.mongodb.com

## 📞 Support

**Problème avec MongoDB Atlas?**
- Documentation: https://docs.atlas.mongodb.com/getting-started/
- Support: https://support.mongodb.com/

**Problème avec Node.js sur Windows?**
- Vérifiez les variables d'environnement PATH
- Redémarrez le CMD après installation

---

**🎉 Votre Dashboard IoT est maintenant dans le Cloud ! 🎉**
