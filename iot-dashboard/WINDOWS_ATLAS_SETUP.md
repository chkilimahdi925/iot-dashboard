# 🌐 Configuration MongoDB Atlas (Cloud) + Node.js Windows

## 📋 Table des Matières

1. [Créer un compte MongoDB Atlas](#1-créer-mongodb-atlas)
2. [Configurer le cluster](#2-configurer-le-cluster)
3. [Obtenir l'URL de connexion](#3-url-de-connexion)
4. [Configuration Windows](#4-configuration-windows)
5. [Démarrage](#5-démarrage)

---

## 1️⃣ Créer MongoDB Atlas

### Étape 1.1: Inscription

1. Allez sur **https://www.mongodb.com/cloud/atlas**
2. Cliquez sur **"Try Free"** ou **"Start Free"**
3. Créez un compte (ou connectez-vous avec Google/GitHub)

### Étape 1.2: Créer un Cluster GRATUIT

1. Choisissez **"M0 Sandbox"** (GRATUIT - 512MB)
2. Provider: **AWS** ou **Google Cloud** (peu importe)
3. Région: Choisissez la plus proche (ex: Paris, Frankfurt)
4. Cluster Name: `iot-cluster` (ou ce que vous voulez)
5. Cliquez sur **"Create Cluster"**

⏱️ **Attendez 3-5 minutes** que le cluster soit créé.

---

## 2️⃣ Configurer le Cluster

### Étape 2.1: Créer un Utilisateur de Base de Données

1. Dans le menu de gauche, cliquez sur **"Database Access"**
2. Cliquez sur **"Add New Database User"**
3. Choisissez **"Password"** (Authentication Method)
4. Remplissez:
   - **Username**: `iotuser` (ou ce que vous voulez)
   - **Password**: Cliquez sur **"Autogenerate Secure Password"** 
   - ⚠️ **COPIEZ CE MOT DE PASSE** quelque part !
5. Built-in Role: **"Read and write to any database"**
6. Cliquez sur **"Add User"**

### Étape 2.2: Autoriser l'Accès depuis N'importe Où

1. Dans le menu de gauche, cliquez sur **"Network Access"**
2. Cliquez sur **"Add IP Address"**
3. Cliquez sur **"Allow Access from Anywhere"**
   - ⚠️ Cela ajoutera `0.0.0.0/0` (OK pour développement)
4. Cliquez sur **"Confirm"**

---

## 3️⃣ URL de Connexion

### Étape 3.1: Obtenir la Chaîne de Connexion

1. Retournez à **"Database"** dans le menu de gauche
2. Cliquez sur **"Connect"** sur votre cluster
3. Choisissez **"Connect your application"**
4. Driver: **Node.js**, Version: **5.5 or later**
5. Copiez l'URL qui ressemble à:

```
mongodb+srv://iotuser:<password>@iot-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

### Étape 3.2: Personnaliser l'URL

Remplacez `<password>` par votre mot de passe (celui que vous avez copié).

**Exemple:**
```
mongodb+srv://iotuser:MonMotDePasse123@iot-cluster.abc123.mongodb.net/?retryWrites=true&w=majority
```

⚠️ **IMPORTANT:** Si votre mot de passe contient des caractères spéciaux (@, :, /, etc.), 
vous devez les encoder:
- @ → %40
- : → %3A
- / → %2F

**Ou utilisez:** https://meyerweb.com/eric/tools/dencoder/ pour encoder

---

## 4️⃣ Configuration Windows

### Étape 4.1: Installer Node.js (si pas déjà fait)

1. Téléchargez Node.js depuis: **https://nodejs.org/**
2. Choisissez la version **LTS** (Long Term Support)
3. Installez avec les options par défaut
4. Vérifiez l'installation:

```cmd
node --version
npm --version
```

### Étape 4.2: Extraire le Projet

1. Téléchargez `iot-dashboard-multi.tar.gz`
2. Extrayez avec **7-Zip** ou **WinRAR**
3. Ou utilisez PowerShell:

```powershell
# PowerShell
tar -xzf iot-dashboard-multi.tar.gz
cd iot-dashboard
```

### Étape 4.3: Configurer MongoDB Atlas

Ouvrez le fichier `backend/.env` avec **Notepad** ou **VS Code**:

```env
# Configuration MQTT
MQTT_BROKER=172.22.241.241
MQTT_PORT=1883
MQTT_TOPIC=home/esp8266/dht11

# Configuration MongoDB Atlas (MODIFIEZ CETTE LIGNE)
MONGODB_URI=mongodb+srv://iotuser:VotreMotDePasse@iot-cluster.xxxxx.mongodb.net/iot_sensors?retryWrites=true&w=majority

# Configuration Serveur
PORT=3000
```

⚠️ **Remplacez** la ligne `MONGODB_URI` par votre URL complète MongoDB Atlas !

**Important:** Ajoutez `/iot_sensors` avant le `?` pour spécifier la base de données:
```
...mongodb.net/iot_sensors?retryWrites=true&w=majority
```

---

## 5️⃣ Démarrage sur Windows

### Étape 5.1: Installer les Dépendances

Ouvrez **PowerShell** ou **CMD** dans le dossier du projet:

```cmd
# Backend
cd backend
npm install

# Frontend (nouveau terminal)
cd frontend
npm install
```

### Étape 5.2: Démarrer le Backend

```cmd
cd backend
npm run start:multi
```

Vous devriez voir:
```
✅ MongoDB connecté
✅ Connecté au broker MQTT
📡 Abonné au topic: home/esp8266/dht11
🚀 Serveur démarré sur http://localhost:3000
📊 Appareils actifs: 1
   - 🌡️ Capteur Température/Humidité (esp8266_dht11)
```

✅ Si vous voyez **"MongoDB connecté"**, c'est bon !

### Étape 5.3: Démarrer le Frontend

**Nouveau terminal PowerShell/CMD:**

```cmd
cd frontend
npm start
```

Ou:

```cmd
cd frontend
npx ng serve
```

Attendez que le serveur démarre, puis ouvrez:
**http://localhost:4200**

---

## 🔍 Vérification MongoDB Atlas

### Vérifier que les Données sont Stockées

1. Retournez sur **MongoDB Atlas**
2. Cliquez sur **"Browse Collections"** sur votre cluster
3. Vous devriez voir:
   - Database: **iot_sensors**
   - Collection: **sensordatas**
   - Documents: Les données de vos capteurs

---

## 🐛 Dépannage Windows

### Problème: "npm n'est pas reconnu"

**Solution:** Ajoutez Node.js au PATH

1. Recherchez "Variables d'environnement" dans Windows
2. Cliquez sur "Variables d'environnement"
3. Dans "Variables système", trouvez "Path"
4. Ajoutez: `C:\Program Files\nodejs\`

### Problème: Erreur MQTT "ENOTFOUND"

**Raison:** Le broker MQTT (Raspberry Pi) n'est pas accessible depuis Windows

**Solution 1:** Vérifier que le Raspberry Pi est allumé et sur le même réseau

```cmd
ping 172.22.241.241
```

**Solution 2:** Vérifier le firewall Windows

1. Cherchez "Pare-feu Windows"
2. Autorisez Node.js

### Problème: "MongooseServerSelectionError"

**Raisons possibles:**
1. URL de connexion incorrecte
2. Mot de passe mal encodé
3. IP non autorisée dans MongoDB Atlas

**Solution:**

1. Vérifiez l'URL dans `.env`
2. Vérifiez Network Access dans Atlas (0.0.0.0/0)
3. Vérifiez le username/password

### Problème: Port 3000 déjà utilisé

**Solution:** Changer le port

Dans `backend/.env`:
```env
PORT=3001
```

Et dans `frontend/src/app/services/sensor-multi.service.ts`:
```typescript
private apiUrl = 'http://localhost:3001/api';
```

---

## 📝 Scripts Windows

### backend/start.bat

Créez un fichier `start.bat` dans le dossier `backend`:

```batch
@echo off
echo 🚀 Démarrage du Backend IoT...
echo.

npm run start:multi

pause
```

### frontend/start.bat

Créez un fichier `start.bat` dans le dossier `frontend`:

```batch
@echo off
echo 🌐 Démarrage du Frontend Angular...
echo.

call npm start

pause
```

**Double-cliquez** sur ces fichiers pour démarrer !

---

## 🌐 Avantages MongoDB Atlas

✅ **Gratuit** jusqu'à 512 MB
✅ **Hébergé dans le cloud** (pas besoin d'installer MongoDB localement)
✅ **Sauvegarde automatique**
✅ **Accessible de n'importe où**
✅ **Interface web** pour visualiser les données
✅ **Performance optimisée**

---

## 📊 Résumé de la Configuration

```
Architecture Finale:

ESP8266 (Raspberry Pi)
    ↓ WiFi
MQTT Broker (Mosquitto sur Raspberry Pi)
    ↓ MQTT Subscribe
Backend Node.js (Windows)
    ↓ Stockage
MongoDB Atlas (Cloud ☁️)
    ↓ API REST + WebSocket
Frontend Angular (Windows - http://localhost:4200)
    ↓ Navigateur
Vous ! 🎉
```

---

## ✅ Checklist Finale

- [ ] Compte MongoDB Atlas créé
- [ ] Cluster gratuit M0 créé
- [ ] Utilisateur de DB créé
- [ ] Network Access configuré (0.0.0.0/0)
- [ ] URL de connexion copiée
- [ ] Fichier `.env` modifié avec l'URL Atlas
- [ ] Node.js installé sur Windows
- [ ] Dépendances installées (`npm install`)
- [ ] Backend démarre sans erreur
- [ ] Frontend compile sans erreur
- [ ] Dashboard accessible sur http://localhost:4200

---

## 🆘 Support

**Erreur de connexion MongoDB?**
- Vérifiez l'URL dans `.env`
- Vérifiez Network Access dans Atlas
- Vérifiez que le cluster est bien démarré

**Erreur MQTT?**
- Vérifiez que le Raspberry Pi est accessible
- `ping 172.22.241.241` depuis Windows

**Frontend ne démarre pas?**
- Vérifiez Node.js: `node --version`
- Réinstallez: `npm install`
- Utilisez: `npx ng serve`

---

🌟 **Votre Dashboard IoT est maintenant dans le Cloud !** 🌟
