# 🎉 VERSION MULTI-APPAREILS DISPONIBLE !

## 🆕 Quoi de Neuf ?

Votre dashboard IoT a été **amélioré** pour supporter **plusieurs appareils** simultanément !

### ✨ Avant vs Après

**AVANT (Version Simple):**
- ❌ Un seul type de capteur (DHT11)
- ❌ Modification du code pour ajouter des capteurs
- ❌ Un seul appareil à la fois

**APRÈS (Version Multi-Appareils):**
- ✅ **Plusieurs types** de capteurs (DHT11, MQ-2, PIR, BH1750, etc.)
- ✅ **Ajout facile** via un fichier de configuration
- ✅ **Tous les appareils** sur le même dashboard
- ✅ **Statistiques individuelles** pour chaque appareil

## 📁 Fichiers Importants

### Version Multi-Appareils (NOUVEAU)

```
backend/
├── config/
│   └── devices.config.js        ⭐ CONFIGURATION DES APPAREILS
├── server-multi.js              ⭐ NOUVEAU SERVEUR
└── models/SensorData.js         ⭐ MODÈLE MIS À JOUR

frontend/
├── components/
│   └── multi-dashboard/         ⭐ NOUVEAU DASHBOARD
└── services/
    └── sensor-multi.service.ts  ⭐ NOUVEAU SERVICE

examples/
├── esp8266_gas_mq2.ino          ⭐ CODE EXEMPLE GAZ
└── esp8266_motion_pir.ino       ⭐ CODE EXEMPLE MOUVEMENT
```

### Version Simple (Conservée)

Vos anciens fichiers sont toujours là:
- `backend/server.js` - Serveur original
- `frontend/components/dashboard/` - Dashboard original

## 🚀 Comment Démarrer

### Option 1: Version Multi-Appareils (RECOMMANDÉ)

```bash
# Backend
cd backend
npm run start:multi  # ⬅️ Nouveau script

# Frontend
cd frontend
ng serve
```

**Accéder:** http://localhost:4200

### Option 2: Version Simple (Ancienne)

```bash
# Backend
cd backend
npm start  # ⬅️ Script original

# Frontend
cd frontend
ng serve
```

## 📱 Ajouter un Appareil (SUPER FACILE)

### 1. Ouvrir le Fichier de Configuration

```bash
nano backend/config/devices.config.js
```

### 2. Activer un Appareil Pré-configuré

Cherchez l'appareil dans le fichier et changez:

```javascript
enabled: false  →  enabled: true
```

**Exemples disponibles:**
- 🌡️ DHT11 (Température/Humidité) - DÉJÀ ACTIF
- 🔥 MQ-2 (Capteur de Gaz)
- 🚶 PIR (Détecteur de Mouvement)
- 💡 BH1750 (Capteur de Luminosité)
- 📏 HC-SR04 (Capteur de Distance)

### 3. Redémarrer le Backend

```bash
cd backend
npm run start:multi
```

**C'est tout !** Votre nouvel appareil apparaît automatiquement sur le dashboard.

## 🔧 Ajouter un Nouveau Type de Capteur

**Consultez:** `GUIDE_AJOUT_APPAREILS.md` pour:
- Template de configuration complet
- Exemples de code ESP8266
- Configuration des seuils
- Personnalisation des icônes et couleurs

## 💡 Exemple Rapide: Ajouter un Capteur de Gaz

### 1. Configuration (devices.config.js)

```javascript
{
  id: 'esp8266_mq2',
  name: 'Capteur de Gaz',
  type: 'MQ-2',
  location: 'Cuisine',
  mqttTopic: 'home/esp8266/gas',
  icon: '🔥',
  enabled: true,  // ⬅️ ACTIVÉ !
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

### 2. Code ESP8266

Utilisez le fichier: `examples/esp8266_gas_mq2.ino`

Ou créez le vôtre:

```cpp
const char* MQTT_TOPIC = "home/esp8266/gas";

void loop() {
  int gasValue = analogRead(A0);
  
  String payload = "{\"gas\":";
  payload += String(gasValue);
  payload += "}";
  
  client.publish(MQTT_TOPIC, payload.c_str());
  delay(3000);
}
```

### 3. Résultat

Le dashboard affiche automatiquement:
- 🔥 Icône du capteur de gaz
- Valeur en temps réel
- Couleur selon le seuil (vert/orange/rouge)
- Statistiques (moyenne, min, max)
- Historique des valeurs

## 📊 API Multi-Appareils

Nouveaux endpoints disponibles:

```bash
# Liste des appareils
GET /api/devices

# Dernières données de tous les appareils
GET /api/sensor/latest/all

# Données d'un appareil spécifique
GET /api/sensor/latest/:deviceId
GET /api/sensor/history/:deviceId
GET /api/sensor/stats/:deviceId
```

## 🎯 Cas d'Usage

**Maison Connectée Complète:**
```
🏠 Tableau de bord unique avec:
   📱 Salon: DHT11 (Température 23°C, Humidité 45%)
   🔥 Cuisine: MQ-2 (Gaz 0 ppm)
   🚶 Entrée: PIR (Aucun mouvement)
   💡 Bureau: BH1750 (450 lux)
   📏 Garage: HC-SR04 (120 cm)
```

Tout affiché en temps réel sur la même page !

## 📚 Documentation

| Fichier | Description |
|---------|-------------|
| `README_MULTI.md` | Documentation complète multi-appareils |
| `GUIDE_AJOUT_APPAREILS.md` | Guide détaillé pour ajouter des appareils |
| `QUICKSTART.md` | Démarrage rapide |
| `examples/` | Code ESP8266 d'exemple |

## 🔄 Migration

**Vous utilisez déjà le dashboard avec DHT11 ?**

✅ **Aucune modification nécessaire !**

Votre code ESP8266 actuel fonctionne toujours. Il suffit de:
1. Démarrer avec `npm run start:multi` au lieu de `npm start`
2. Votre DHT11 s'affichera automatiquement

Pour ajouter d'autres capteurs, suivez le guide ci-dessus.

## ⚡ Démarrage Ultra-Rapide

```bash
# 1. Extraire l'archive
tar -xzf iot-dashboard.tar.gz
cd iot-dashboard

# 2. Installer les dépendances
cd backend && npm install
cd ../frontend && npm install

# 3. Activer vos appareils
nano backend/config/devices.config.js
# Changer enabled: true pour les appareils voulus

# 4. Démarrer
cd backend && npm run start:multi &
cd frontend && ng serve

# 5. Accéder au dashboard
# http://localhost:4200
```

## 🆘 Besoin d'Aide ?

1. **Configuration:** Voir `GUIDE_AJOUT_APPAREILS.md`
2. **Code ESP8266:** Voir dossier `examples/`
3. **API:** Voir `README_MULTI.md`
4. **Problèmes:** Vérifier les logs du backend

---

## 🎁 Bonus

**Appareils pré-configurés prêts à l'emploi:**
- ✅ DHT11 (Température/Humidité) - ACTIF
- 📦 MQ-2 (Gaz) - Prêt à activer
- 📦 PIR (Mouvement) - Prêt à activer
- 📦 BH1750 (Lumière) - Prêt à activer
- 📦 HC-SR04 (Distance) - Prêt à activer

Il suffit de mettre `enabled: true` !

---

**🌟 Profitez de votre Dashboard Multi-Appareils ! 🌟**
