# 📱 Guide: Ajouter des Appareils IoT

## 🎯 Objectif

Ce guide vous explique comment ajouter facilement de nouveaux capteurs/appareils à votre dashboard IoT en modifiant simplement un fichier de configuration.

## 📁 Fichier à Modifier

**Fichier:** `backend/config/devices.config.js`

C'est le **SEUL** fichier que vous devez modifier pour ajouter de nouveaux appareils !

## 🔧 Étapes pour Ajouter un Appareil

### Étape 1: Ouvrir le Fichier de Configuration

```bash
nano backend/config/devices.config.js
# ou
code backend/config/devices.config.js
```

### Étape 2: Ajouter Votre Appareil

Copiez ce template dans le tableau `DEVICES`:

```javascript
{
  id: 'esp8266_VOTRE_ID',              // ✅ ID unique de l'appareil
  name: 'Nom de votre capteur',        // ✅ Nom affiché
  type: 'TYPE_CAPTEUR',                // ✅ Type de capteur
  location: 'Emplacement',             // ✅ Où est le capteur
  mqttTopic: 'home/esp8266/TOPIC',     // ✅ Topic MQTT
  icon: '🔥',                          // ✅ Emoji pour l'icône
  enabled: true,                       // ✅ Activer/Désactiver
  sensors: [
    {
      key: 'cle_donnee',               // ✅ Clé dans le JSON MQTT
      label: 'Label affiché',          // ✅ Nom affiché
      unit: 'unité',                   // ✅ Unité de mesure
      type: 'type',                    // ✅ Type de capteur
      icon: '📊',                      // ✅ Icône du capteur
      thresholds: {
        min: 0,                        // ✅ Valeur min normale
        max: 100,                      // ✅ Valeur max normale
        critical_min: -10,             // ⚠️ Valeur min critique
        critical_max: 200              // ⚠️ Valeur max critique
      }
    }
  ]
}
```

### Étape 3: Activer l'Appareil

Mettez `enabled: true` pour activer l'appareil.

### Étape 4: Redémarrer le Backend

```bash
cd backend
npm start
```

Le backend détectera automatiquement votre nouvel appareil !

## 📝 Exemples Concrets

### Exemple 1: Capteur de Gaz MQ-2

```javascript
{
  id: 'esp8266_mq2',
  name: 'Capteur de Gaz',
  type: 'MQ-2',
  location: 'Cuisine',
  mqttTopic: 'home/esp8266/gas',
  icon: '🔥',
  enabled: true,  // ✅ Activé
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
        critical_min: 0,
        critical_max: 1000
      }
    }
  ]
}
```

**Code ESP8266 correspondant:**

```cpp
#include <ESP8266WiFi.h>
#include <PubSubClient.h>

#define MQ2_PIN A0

const char* MQTT_TOPIC = "home/esp8266/gas";  // ⬅️ Même topic

void loop() {
  int gasValue = analogRead(MQ2_PIN);
  
  String payload = "{\"gas\":";
  payload += String(gasValue);
  payload += "}";
  
  client.publish(MQTT_TOPIC, payload.c_str());
  delay(3000);
}
```

### Exemple 2: Capteur de Mouvement PIR

```javascript
{
  id: 'esp8266_pir',
  name: 'Détecteur de Mouvement',
  type: 'PIR',
  location: 'Entrée',
  mqttTopic: 'home/esp8266/motion',
  icon: '🚶',
  enabled: true,
  sensors: [
    {
      key: 'motion',
      label: 'Mouvement Détecté',
      unit: '',
      type: 'boolean',
      icon: '🚶',
      thresholds: {
        min: 0,
        max: 1
      }
    },
    {
      key: 'count',
      label: 'Nombre de Détections',
      unit: '',
      type: 'counter',
      icon: '📊',
      thresholds: {
        min: 0,
        max: 100
      }
    }
  ]
}
```

**Code ESP8266 correspondant:**

```cpp
#define PIR_PIN D5

int motionCount = 0;

void loop() {
  int motion = digitalRead(PIR_PIN);
  if (motion == HIGH) {
    motionCount++;
  }
  
  String payload = "{\"motion\":";
  payload += String(motion);
  payload += ",\"count\":";
  payload += String(motionCount);
  payload += "}";
  
  client.publish("home/esp8266/motion", payload.c_str());
  delay(1000);
}
```

### Exemple 3: Capteur de Luminosité BH1750

```javascript
{
  id: 'esp8266_light',
  name: 'Capteur de Luminosité',
  type: 'BH1750',
  location: 'Bureau',
  mqttTopic: 'home/esp8266/light',
  icon: '💡',
  enabled: true,
  sensors: [
    {
      key: 'lux',
      label: 'Luminosité',
      unit: 'lux',
      type: 'light',
      icon: '💡',
      thresholds: {
        min: 0,
        max: 1000,
        critical_min: 0,
        critical_max: 100000
      }
    }
  ]
}
```

**Code ESP8266 correspondant:**

```cpp
#include <BH1750.h>

BH1750 lightMeter;

void loop() {
  float lux = lightMeter.readLightLevel();
  
  String payload = "{\"lux\":";
  payload += String(lux, 0);
  payload += "}";
  
  client.publish("home/esp8266/light", payload.c_str());
  delay(5000);
}
```

## 🎨 Personnalisation

### Choisir une Icône

Utilisez des émojis pour les icônes:
- Température: 🌡️
- Humidité: 💧
- Gaz: 🔥
- Mouvement: 🚶
- Lumière: 💡
- Distance: 📏
- Pression: 🎈
- Son: 🔊

### Définir les Seuils

```javascript
thresholds: {
  min: 20,           // ✅ Valeur minimale normale (couleur verte)
  max: 80,           // ✅ Valeur maximale normale (couleur verte)
  critical_min: 0,   // ⚠️ En dessous = ROUGE
  critical_max: 100  // ⚠️ Au dessus = ROUGE
}
```

**Codes Couleur Automatiques:**
- 🟢 **Vert**: Entre min et max (normal)
- 🟠 **Orange**: En dehors de min-max mais pas critique
- 🔴 **Rouge**: En dehors de critical_min - critical_max (danger)

## 🔍 Vérification

### 1. Vérifier que l'appareil est détecté

Après redémarrage du backend, vous devriez voir:

```
🚀 Serveur démarré sur http://localhost:3000
📊 Appareils actifs: 3
   - 🌡️ Capteur Température/Humidité (esp8266_dht11)
   - 🔥 Capteur de Gaz (esp8266_mq2)
   - 🚶 Détecteur de Mouvement (esp8266_pir)
```

### 2. Tester l'API

```bash
# Liste des appareils
curl http://localhost:3000/api/devices

# Dernières données
curl http://localhost:3000/api/sensor/latest/esp8266_mq2
```

### 3. Vérifier le Dashboard

Ouvrez http://localhost:4200 et vous devriez voir toutes vos cartes d'appareils !

## 🚨 Problèmes Courants

### L'appareil n'apparaît pas

✅ Vérifiez que `enabled: true`
✅ Redémarrez le backend
✅ Vérifiez l'ID unique (pas de doublon)

### Pas de données reçues

✅ Vérifiez le topic MQTT (doit être identique côté ESP et config)
✅ Testez avec mosquitto_sub:

```bash
mosquitto_sub -h 172.22.241.241 -t "home/esp8266/gas" -v
```

### Les couleurs ne fonctionnent pas

✅ Vérifiez les seuils dans `thresholds`
✅ Assurez-vous que les valeurs sont numériques

## 📊 Format de Données MQTT

Votre ESP8266 doit envoyer du **JSON valide**:

```json
{
  "gas": 250,
  "smoke": 120
}
```

Les clés (`gas`, `smoke`) doivent correspondre aux `key` dans la configuration.

## 🎯 Résumé

1. ✅ Modifier **UN SEUL FICHIER**: `backend/config/devices.config.js`
2. ✅ Ajouter votre appareil avec son ID unique
3. ✅ Mettre `enabled: true`
4. ✅ Configurer l'ESP8266 avec le même topic MQTT
5. ✅ Redémarrer le backend
6. ✅ Profiter du dashboard !

---

**Besoin d'aide ?** Consultez les exemples dans `devices.config.js` !
