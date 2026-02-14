# 🌡️ IoT Dashboard Multi-Appareils - Guide Complet

Tableau de bord web pour visualiser en temps réel les données de **PLUSIEURS capteurs IoT** connectés à des ESP8266.

## ✨ Nouveauté: Support Multi-Appareils

Cette version améliorée vous permet de gérer **plusieurs capteurs différents** sur le même dashboard en modifiant simplement un fichier de configuration !

### 🎯 Fonctionnalités

- ✅ **Support multi-capteurs** (DHT11, MQ-2, PIR, BH1750, etc.)
- ✅ **Configuration simple** dans un seul fichier
- ✅ **Ajout facile** de nouveaux appareils
- ✅ **Affichage en temps réel** de tous les capteurs
- ✅ **Statistiques individuelles** par appareil
- ✅ **Historique** pour chaque capteur
- ✅ **Codes couleur automatiques** selon les seuils
- ✅ **Interface responsive** et moderne

## 📋 Architecture

```
ESP8266 (Multi-Capteurs) → MQTT Broker → Node.js Backend → MongoDB
                                               ↓
                                         Angular Frontend
```

## 🚀 Installation Rapide

### 1️⃣ Installer les Dépendances

```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

### 2️⃣ Configurer les Appareils

**Fichier:** `backend/config/devices.config.js`

```javascript
{
  id: 'esp8266_mq2',
  name: 'Capteur de Gaz',
  type: 'MQ-2',
  location: 'Cuisine',
  mqttTopic: 'home/esp8266/gas',
  icon: '🔥',
  enabled: true,  // ✅ Mettre à true pour activer
  sensors: [
    {
      key: 'gas',
      label: 'Niveau de Gaz',
      unit: 'ppm',
      type: 'gas',
      icon: '🔥',
      thresholds: {
        min: 0,
        max: 300,
        critical_max: 1000
      }
    }
  ]
}
```

### 3️⃣ Démarrer l'Application

```bash
# Backend (version multi-appareils)
cd backend
npm run start:multi

# Frontend
cd frontend
ng serve
```

Accédez à **http://localhost:4200**

## 📱 Ajouter un Nouvel Appareil

### Méthode Rapide (3 étapes)

1. **Modifier** `backend/config/devices.config.js`
2. **Activer** l'appareil avec `enabled: true`
3. **Redémarrer** le backend

C'est tout ! 🎉

### Guide Détaillé

Consultez **[GUIDE_AJOUT_APPAREILS.md](GUIDE_AJOUT_APPAREILS.md)** pour:
- Templates de configuration
- Exemples de capteurs (Gaz, Mouvement, Lumière, Distance)
- Code ESP8266 correspondant
- Personnalisation des seuils et couleurs

## 📦 Appareils Pré-configurés

Le fichier `devices.config.js` contient déjà des exemples pour:

| Appareil | Type | Topic MQTT | Actif par défaut |
|----------|------|-----------|------------------|
| DHT11 | Température/Humidité | `home/esp8266/dht11` | ✅ Oui |
| MQ-2 | Gaz/Fumée | `home/esp8266/gas` | ❌ Non (exemple) |
| PIR | Mouvement | `home/esp8266/motion` | ❌ Non (exemple) |
| BH1750 | Luminosité | `home/esp8266/light` | ❌ Non (exemple) |
| HC-SR04 | Distance | `home/esp8266/distance` | ❌ Non (exemple) |

Pour activer un exemple, changez simplement `enabled: false` → `enabled: true` !

## 🔧 API REST

Tous les endpoints supportent maintenant les appareils multiples:

```bash
# Liste des appareils
GET /api/devices

# Informations d'un appareil
GET /api/devices/:deviceId

# Dernières données d'un appareil
GET /api/sensor/latest/:deviceId

# Dernières données de TOUS les appareils
GET /api/sensor/latest/all

# Historique d'un appareil
GET /api/sensor/history/:deviceId?hours=24&limit=100

# Statistiques d'un appareil
GET /api/sensor/stats/:deviceId?hours=24
```

### Exemples

```bash
# Tous les appareils actifs
curl http://localhost:3000/api/devices

# Dernières données du capteur de gaz
curl http://localhost:3000/api/sensor/latest/esp8266_mq2

# Statistiques DHT11 sur 48h
curl http://localhost:3000/api/sensor/stats/esp8266_dht11?hours=48
```

## 💻 Code ESP8266

### Exemple: DHT11 (Température/Humidité)

```cpp
// Votre code existant fonctionne toujours !
const char* MQTT_TOPIC = "home/esp8266/dht11";

String payload = "{\"temp\":";
payload += String(temperature, 1);
payload += ",\"hum\":";
payload += String(humidity, 0);
payload += "}";

client.publish(MQTT_TOPIC, payload.c_str());
```

### Exemple: MQ-2 (Capteur de Gaz)

```cpp
const char* MQTT_TOPIC = "home/esp8266/gas";

int gasValue = analogRead(A0);

String payload = "{\"gas\":";
payload += String(gasValue);
payload += "}";

client.publish(MQTT_TOPIC, payload.c_str());
```

**📁 Plus d'exemples dans le dossier `examples/`:**
- `esp8266_gas_mq2.ino`
- `esp8266_motion_pir.ino`

## 🎨 Interface Utilisateur

### Dashboard Principal

Le dashboard affiche automatiquement tous les appareils actifs avec:
- **Cartes** individuelles par appareil
- **Icônes** et couleurs personnalisées
- **Valeurs en temps réel** avec WebSocket
- **Expand/Collapse** pour voir les détails

### Codes Couleur

Les valeurs changent automatiquement de couleur selon les seuils:

- 🟢 **Vert**: Valeur normale (entre min et max)
- 🟠 **Orange**: Valeur anormale (hors min-max)
- 🔴 **Rouge**: Valeur critique (hors critical_min-critical_max)

## 📊 Structure du Projet

```
iot-dashboard/
├── backend/
│   ├── config/
│   │   └── devices.config.js     ⭐ FICHIER PRINCIPAL À MODIFIER
│   ├── models/
│   │   └── SensorData.js         (Modèle MongoDB flexible)
│   ├── server-multi.js           (Serveur multi-appareils)
│   ├── server.js                 (Serveur original DHT11 seulement)
│   └── package.json
│
├── frontend/
│   └── src/app/
│       ├── components/
│       │   ├── dashboard/               (Dashboard original)
│       │   └── multi-dashboard/         ⭐ Dashboard multi-appareils
│       └── services/
│           ├── sensor.service.ts        (Service original)
│           └── sensor-multi.service.ts  ⭐ Service multi-appareils
│
├── examples/                      ⭐ Exemples de code ESP8266
│   ├── esp8266_gas_mq2.ino
│   └── esp8266_motion_pir.ino
│
└── GUIDE_AJOUT_APPAREILS.md      ⭐ Guide détaillé
```

## 🔄 Migration depuis la Version Simple

Si vous utilisiez la version simple (DHT11 uniquement):

### Option 1: Continuer avec l'ancienne version

```bash
# Utiliser le serveur original
npm start

# Utiliser le dashboard original
# (dashboard.component.ts)
```

### Option 2: Migrer vers multi-appareils

1. Configurer votre DHT11 dans `devices.config.js` (déjà fait)
2. Démarrer le nouveau serveur: `npm run start:multi`
3. Le dashboard affichera automatiquement votre DHT11

**Aucune modification de votre code ESP8266 n'est nécessaire !**

## 🐛 Dépannage

### Appareil non détecté

```bash
# Vérifier la configuration
cat backend/config/devices.config.js | grep enabled

# Redémarrer le backend
npm run start:multi
```

Vous devriez voir:
```
📊 Appareils actifs: 2
   - 🌡️ Capteur Température/Humidité (esp8266_dht11)
   - 🔥 Capteur de Gaz (esp8266_mq2)
```

### Pas de données reçues

```bash
# Tester le topic MQTT
mosquitto_sub -h 172.22.241.241 -t "home/esp8266/gas" -v

# Vérifier les logs du backend
# Vous devriez voir:
📥 Données reçues sur home/esp8266/gas: {gas: 250}
💾 Données sauvegardées pour Capteur de Gaz
```

### Frontend ne compile pas

```bash
cd frontend
rm -rf node_modules
npm install
ng serve
```

## 📝 Scripts Disponibles

### Backend

```bash
npm start           # Serveur original (DHT11 seulement)
npm run start:multi # Serveur multi-appareils ⭐
npm run dev         # Mode développement (original)
npm run dev:multi   # Mode développement (multi) ⭐
```

### Frontend

```bash
ng serve            # Démarrer le serveur de développement
ng build            # Compiler pour production
```

## 🎯 Cas d'Usage

### Maison Connectée

```
📱 Salon: DHT11 (Température/Humidité)
🔥 Cuisine: MQ-2 (Détection gaz)
🚶 Entrée: PIR (Détection mouvement)
💡 Bureau: BH1750 (Luminosité)
📏 Garage: HC-SR04 (Distance/Parking)
```

Tous sur le même dashboard !

### Installation Industrielle

- Capteurs de température dans différentes zones
- Détecteurs de fumée multiples
- Surveillance de la qualité de l'air
- Contrôle d'accès avec PIR

## 📚 Documentation

- **[README.md](README.md)** - Ce fichier
- **[GUIDE_AJOUT_APPAREILS.md](GUIDE_AJOUT_APPAREILS.md)** - Guide détaillé pour ajouter des appareils
- **[QUICKSTART.md](QUICKSTART.md)** - Démarrage rapide
- **[examples/](examples/)** - Code ESP8266 d'exemple

## 🤝 Support

**Besoin d'aide ?**

1. Consultez `GUIDE_AJOUT_APPAREILS.md`
2. Vérifiez les exemples dans `devices.config.js`
3. Testez les codes d'exemple dans `examples/`

## 📄 Licence

Ce projet est libre d'utilisation pour des projets personnels et éducatifs.

---

**Créé avec ❤️ pour l'IoT DIY**

🌟 **Profitez de votre Dashboard Multi-Appareils !** 🌟
