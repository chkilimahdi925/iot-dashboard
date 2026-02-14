# 🪟 IoT Dashboard - Windows + MongoDB Atlas

## 🎯 Configuration pour Windows avec MongoDB Cloud

Ce projet est **optimisé pour Windows** et utilise **MongoDB Atlas** (cloud gratuit) au lieu de MongoDB local.

---

## ⚡ Démarrage Ultra-Rapide

### 1. Installer Node.js

Téléchargez et installez: **https://nodejs.org/** (version LTS)

### 2. Configurer MongoDB Atlas (5 minutes)

1. Créez un compte gratuit: **https://www.mongodb.com/cloud/atlas**
2. Créez un cluster gratuit (M0 - 512 MB)
3. Créez un utilisateur (ex: `iotuser`)
4. Autorisez l'accès depuis partout (Network Access → 0.0.0.0/0)
5. Copiez l'URL de connexion

**📖 Guide détaillé:** Voir `WINDOWS_ATLAS_SETUP.md`

### 3. Configurer le Projet

Ouvrez `backend/.env` et remplacez:

```env
MONGODB_URI=mongodb+srv://iotuser:VotrePassword@cluster.mongodb.net/iot_sensors?retryWrites=true&w=majority
```

### 4. Démarrer

**Double-cliquez sur:** `START_ALL.bat`

Ou manuellement:
```cmd
# Terminal 1
cd backend
start.bat

# Terminal 2
cd frontend
start.bat
```

### 5. Accéder au Dashboard

**http://localhost:4200**

---

## 📁 Fichiers Importants Windows

```
iot-dashboard/
│
├── 📄 START_ALL.bat                    ⭐ DÉMARRER TOUT (double-clic)
├── 📄 QUICKSTART_WINDOWS.md            ⭐ Guide rapide Windows
├── 📄 WINDOWS_ATLAS_SETUP.md           ⭐ Configuration complète
│
├── 📂 backend/
│   ├── 📄 start.bat                    Démarrer backend
│   ├── 📄 .env                         ⭐ CONFIGURATION (modifier ici)
│   ├── 📄 .env.atlas                   Exemple MongoDB Atlas
│   └── 📂 config/
│       └── devices.config.js           ⭐ Ajouter appareils
│
└── 📂 frontend/
    └── 📄 start.bat                    Démarrer frontend
```

---

## 🌐 Pourquoi MongoDB Atlas ?

### Avantages

✅ **Gratuit** - 512 MB de stockage
✅ **Pas d'installation** - Pas besoin d'installer MongoDB localement
✅ **Cloud** - Accessible de partout
✅ **Sauvegarde automatique** - Vos données sont protégées
✅ **Interface web** - Visualisez vos données facilement
✅ **Performance** - Hébergement optimisé

### Comparaison

| Fonctionnalité | MongoDB Local | MongoDB Atlas |
|----------------|---------------|---------------|
| Installation | ❌ Complexe sur Windows | ✅ Aucune |
| Coût | Gratuit | ✅ Gratuit (512 MB) |
| Sauvegarde | Manuel | ✅ Automatique |
| Accessible | Localhost seulement | ✅ De partout |
| Configuration | Complexe | ✅ 5 minutes |

---

## 🚀 Fonctionnalités

### Multi-Appareils

Gérez plusieurs capteurs sur le même dashboard:

- 🌡️ **DHT11** - Température/Humidité (actif par défaut)
- 🔥 **MQ-2** - Capteur de Gaz
- 🚶 **PIR** - Détecteur de Mouvement
- 💡 **BH1750** - Luminosité
- 📏 **HC-SR04** - Distance

### Interface Moderne

- 📊 **Temps réel** - Mises à jour automatiques via WebSocket
- 📈 **Statistiques** - Moyenne, min, max pour chaque capteur
- 📜 **Historique** - Visualisation des données passées
- 🎨 **Codes couleur** - Vert/Orange/Rouge selon les seuils
- 📱 **Responsive** - Fonctionne sur mobile/tablette/desktop

---

## 📱 Ajouter un Capteur (3 étapes)

### 1. Ouvrir la Configuration

```cmd
notepad backend\config\devices.config.js
```

### 2. Activer un Appareil

Cherchez l'appareil et changez:
```javascript
enabled: false  →  enabled: true
```

### 3. Redémarrer le Backend

Fermez la fenêtre backend et relancez `backend/start.bat`

**📖 Guide détaillé:** `GUIDE_AJOUT_APPAREILS.md`

---

## 🔧 Configuration Détaillée

### Backend (.env)

```env
# MQTT - Votre Raspberry Pi
MQTT_BROKER=172.22.241.241
MQTT_PORT=1883

# MongoDB Atlas - MODIFIEZ CETTE LIGNE
MONGODB_URI=mongodb+srv://iotuser:VotrePassword@cluster.mongodb.net/iot_sensors?retryWrites=true&w=majority

# Port du serveur
PORT=3000
```

### Appareils (config/devices.config.js)

```javascript
{
  id: 'esp8266_mq2',              // ID unique
  name: 'Capteur de Gaz',         // Nom affiché
  mqttTopic: 'home/esp8266/gas',  // Topic MQTT
  enabled: true,                  // ⬅️ Activer/Désactiver
  sensors: [....]
}
```

---

## 🐛 Résolution de Problèmes Windows

### ❌ "npm n'est pas reconnu"

**Cause:** Node.js pas installé ou pas dans le PATH

**Solution:**
1. Installer Node.js: https://nodejs.org/
2. Redémarrer Windows
3. Vérifier: `node --version`

### ❌ Erreur MongoDB "MongooseServerSelectionError"

**Causes:**
- URL incorrecte dans `.env`
- Mot de passe incorrect
- Network Access non configuré

**Solution:**
1. Vérifier l'URL complète dans `backend/.env`
2. Vérifier MongoDB Atlas → Network Access → 0.0.0.0/0
3. Vérifier username/password

### ❌ Pare-feu Windows Bloque Node.js

**Solution:**
1. Windows Defender → Autoriser une application
2. Ajouter: `C:\Program Files\nodejs\node.exe`

### ❌ Port 3000 Déjà Utilisé

**Solution:**

Dans `backend/.env`:
```env
PORT=3001
```

Dans `frontend/src/app/services/sensor-multi.service.ts`:
```typescript
private apiUrl = 'http://localhost:3001/api';
```

### ❌ MQTT "ENOTFOUND 172.22.241.241"

**Causes:**
- Raspberry Pi éteint
- Mauvaise IP
- Réseau différent

**Solution:**
1. Vérifier que le Raspberry Pi est allumé
2. Tester: `ping 172.22.241.241`
3. Vérifier l'IP du Raspberry Pi

---

## 📊 Architecture

```
┌─────────────────┐
│   ESP8266       │ (Raspberry Pi avec Mosquitto)
│   + Capteurs    │
└────────┬────────┘
         │ WiFi + MQTT
         ↓
┌─────────────────┐
│ Raspberry Pi    │
│ Mosquitto MQTT  │
└────────┬────────┘
         │ MQTT Subscribe
         ↓
┌─────────────────┐
│ Backend Node.js │ (Windows - localhost:3000)
│ (Windows PC)    │
└────────┬────────┘
         │ Stockage
         ↓
┌─────────────────┐
│ MongoDB Atlas   │ ☁️ (Cloud - Gratuit)
│ (Cloud)         │
└────────┬────────┘
         │ API REST + WebSocket
         ↓
┌─────────────────┐
│ Frontend        │ (Windows - localhost:4200)
│ Angular         │
└────────┬────────┘
         │ HTTP
         ↓
┌─────────────────┐
│ Navigateur Web  │ 🎉
│ (Vous!)         │
└─────────────────┘
```

---

## 📚 Documentation

| Fichier | Description | Priorité |
|---------|-------------|----------|
| **QUICKSTART_WINDOWS.md** | Démarrage rapide | ⭐⭐⭐ |
| **WINDOWS_ATLAS_SETUP.md** | Configuration complète Windows + Atlas | ⭐⭐⭐ |
| **GUIDE_AJOUT_APPAREILS.md** | Ajouter des capteurs | ⭐⭐ |
| **README_MULTI.md** | Documentation technique complète | ⭐ |
| **QUICK_ADD_DEVICE.txt** | Guide visuel rapide | ⭐ |
| **examples/** | Code ESP8266 d'exemple | ⭐ |

---

## ✅ Checklist Complète

### Configuration Initiale

- [ ] Node.js installé (https://nodejs.org/)
- [ ] Compte MongoDB Atlas créé
- [ ] Cluster gratuit créé (M0 - 512 MB)
- [ ] Utilisateur de base de données créé
- [ ] Network Access configuré (0.0.0.0/0)
- [ ] URL de connexion copiée

### Configuration Projet

- [ ] Projet extrait
- [ ] `backend/.env` modifié avec URL Atlas
- [ ] `backend/config/devices.config.js` configuré (optionnel)

### Démarrage

- [ ] `npm install` exécuté (ou `start.bat` le fait automatiquement)
- [ ] Backend démarre sans erreur
- [ ] "MongoDB connecté" affiché ✅
- [ ] Frontend démarre sans erreur
- [ ] Dashboard accessible sur http://localhost:4200

### Vérification

- [ ] Données ESP8266 reçues (vérifier logs backend)
- [ ] Dashboard affiche les données en temps réel
- [ ] MongoDB Atlas contient les données (Browse Collections)

---

## 🎯 Prochaines Étapes

1. ✅ **Démarrez** avec `START_ALL.bat`
2. 📊 **Vérifiez** que les données s'affichent
3. 📱 **Ajoutez** d'autres capteurs selon vos besoins
4. 🌐 **Visualisez** vos données dans MongoDB Atlas
5. 🎨 **Personnalisez** l'interface selon vos préférences

---

## 🆘 Support

**Problème de configuration ?**
→ Consultez `WINDOWS_ATLAS_SETUP.md`

**Ajouter un capteur ?**
→ Consultez `GUIDE_AJOUT_APPAREILS.md`

**Erreur technique ?**
→ Vérifiez les logs dans les fenêtres backend/frontend

**Code ESP8266 ?**
→ Consultez le dossier `examples/`

---

🌟 **Profitez de votre Dashboard IoT Cloud sur Windows !** 🌟

**Créé avec ❤️ pour Windows + MongoDB Atlas**
