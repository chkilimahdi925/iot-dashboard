# ⚡ Démarrage Rapide Windows + MongoDB Atlas

## 🎯 Configuration en 5 Minutes

### 1️⃣ Prérequis

✅ **Node.js installé** → https://nodejs.org/ (version LTS)
✅ **Compte MongoDB Atlas** → https://www.mongodb.com/cloud/atlas (GRATUIT)

### 2️⃣ Configuration MongoDB Atlas

1. **Créer un cluster gratuit** (M0 Sandbox - 512 MB)
2. **Créer un utilisateur:**
   - Username: `iotuser`
   - Password: (notez-le !)
3. **Autoriser l'accès:**
   - Network Access → Add IP → "Allow Access from Anywhere"
4. **Copier l'URL de connexion:**
   ```
   mongodb+srv://iotuser:VotrePassword@cluster.mongodb.net/iot_sensors?retryWrites=true&w=majority
   ```

**📖 Guide détaillé:** Voir `WINDOWS_ATLAS_SETUP.md`

### 3️⃣ Installation du Projet

1. **Extraire l'archive:**
   ```
   Clic droit sur iot-dashboard-multi.tar.gz → Extraire tout
   ```

2. **Ouvrir le dossier** `iot-dashboard`

3. **Configurer MongoDB Atlas:**
   - Ouvrir `backend/.env` avec Notepad
   - Remplacer la ligne `MONGODB_URI` par votre URL Atlas
   
   ```env
   MONGODB_URI=mongodb+srv://iotuser:VotrePassword@cluster.mongodb.net/iot_sensors?retryWrites=true&w=majority
   ```

### 4️⃣ Démarrage

**Méthode 1: Script Automatique (RECOMMANDÉ)**

Double-cliquez sur: **`START_ALL.bat`**

Cela ouvrira 2 fenêtres:
- 🟢 Backend (port 3000)
- 🔵 Frontend (port 4200)

**Méthode 2: Manuel**

Terminal 1 (Backend):
```cmd
cd backend
start.bat
```

Terminal 2 (Frontend):
```cmd
cd frontend
start.bat
```

### 5️⃣ Accès au Dashboard

Ouvrez votre navigateur: **http://localhost:4200**

---

## 🔧 Structure des Fichiers Windows

```
iot-dashboard/
├── START_ALL.bat              ⭐ Tout démarrer d'un coup
│
├── backend/
│   ├── start.bat              ⭐ Démarrer backend seul
│   ├── .env                   ⭐ Configuration (MODIFIER ICI)
│   ├── .env.atlas             📝 Exemple MongoDB Atlas
│   └── config/
│       └── devices.config.js  ⭐ Ajouter des appareils ici
│
└── frontend/
    └── start.bat              ⭐ Démarrer frontend seul
```

---

## 📱 Ajouter un Appareil

1. Ouvrir: `backend/config/devices.config.js`
2. Trouver l'appareil (ex: `esp8266_mq2`)
3. Changer: `enabled: false` → `enabled: true`
4. Redémarrer: Fermer et relancer `backend/start.bat`

---

## 🐛 Problèmes Courants

### ❌ "npm n'est pas reconnu"

**Solution:** Node.js n'est pas installé ou pas dans le PATH

1. Installer Node.js: https://nodejs.org/
2. Redémarrer l'ordinateur
3. Vérifier: `node --version` dans CMD

### ❌ Erreur "MongooseServerSelectionError"

**Problème:** Impossible de se connecter à MongoDB Atlas

**Solutions:**
1. Vérifier l'URL dans `backend/.env`
2. Vérifier Network Access dans Atlas (0.0.0.0/0)
3. Vérifier username/password
4. Vérifier que le cluster est bien démarré

### ❌ Port 3000 déjà utilisé

**Solution:** Changer le port

Dans `backend/.env`:
```env
PORT=3001
```

### ❌ MQTT "ENOTFOUND"

**Problème:** Raspberry Pi non accessible

**Solutions:**
1. Vérifier que le Raspberry Pi est allumé
2. Vérifier l'IP: `ping 172.22.241.241`
3. Vérifier le pare-feu Windows

---

## ✅ Checklist Démarrage

- [ ] Node.js installé
- [ ] Compte MongoDB Atlas créé
- [ ] Cluster MongoDB créé
- [ ] Utilisateur DB créé
- [ ] URL de connexion copiée
- [ ] Fichier `.env` configuré
- [ ] `START_ALL.bat` exécuté
- [ ] Backend démarré (MongoDB connecté ✅)
- [ ] Frontend démarré
- [ ] Dashboard accessible sur http://localhost:4200

---

## 🌐 Avantages MongoDB Atlas

✅ **Gratuit** (512 MB)
✅ **Pas d'installation locale**
✅ **Sauvegarde automatique**
✅ **Accessible de partout**
✅ **Interface web** pour voir les données

---

## 📚 Documentation Complète

| Fichier | Description |
|---------|-------------|
| **WINDOWS_ATLAS_SETUP.md** | Guide complet Windows + Atlas |
| **GUIDE_AJOUT_APPAREILS.md** | Ajouter des capteurs |
| **README_MULTI.md** | Documentation technique |
| **QUICK_ADD_DEVICE.txt** | Guide visuel rapide |

---

## 🆘 Besoin d'Aide ?

1. **Configuration Atlas:** `WINDOWS_ATLAS_SETUP.md`
2. **Ajouter appareil:** `GUIDE_AJOUT_APPAREILS.md`
3. **Code ESP8266:** Dossier `examples/`

---

🌟 **Votre Dashboard IoT Cloud est prêt !** 🌟

**Architecture:**
```
ESP8266 (Raspberry Pi)
    ↓ MQTT
Backend Node.js (Windows)
    ↓
MongoDB Atlas (Cloud ☁️)
    ↓
Frontend Angular (Windows)
    ↓
Votre Navigateur 🎉
```
