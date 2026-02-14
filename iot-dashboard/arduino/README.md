# 📟 Code Arduino - ESP8266 + DHT11

## 📁 Contenu de ce Dossier

Ce dossier contient tout ce dont vous avez besoin pour programmer votre ESP8266 avec le capteur DHT11.

### Fichiers Principaux

| Fichier | Description |
|---------|-------------|
| **dht11_iot.ino** | ⭐ Programme Arduino complet pour ESP8266 + DHT11 |
| **GUIDE_ARDUINO.md** | 📖 Guide détaillé complet (installation, configuration, dépannage) |
| **BRANCHEMENT_RAPIDE.txt** | 📋 Guide visuel rapide et checklist |
| **LIENS_UTILES.md** | 🔗 Tous les liens de téléchargement et ressources |

## 🚀 Démarrage Ultra-Rapide

### 1. Brancher le DHT11
```
DHT11 VCC  → ESP8266 3.3V
DHT11 DATA → ESP8266 D4 (GPIO2)
DHT11 GND  → ESP8266 GND
```

### 2. Installer Arduino IDE
- Télécharger: https://www.arduino.cc/en/software
- Installer le support ESP8266
- Installer les bibliothèques DHT et PubSubClient

### 3. Modifier le Code
Ouvrir `dht11_iot.ino` et modifier:
```cpp
const char* WIFI_SSID = "VotreWiFi";        // ← Votre WiFi
const char* WIFI_PASS = "VotreMotDePasse";  // ← Mot de passe
const char* MQTT_SERVER = "192.168.1.X";    // ← IP Raspberry Pi
```

### 4. Téléverser
- Brancher l'ESP8266 via USB
- Sélectionner la carte: NodeMCU 1.0
- Sélectionner le port COM
- Cliquer sur → (Téléverser)

### 5. Vérifier
Ouvrir le Moniteur Série (115200 baud):
```
✅ WiFi connecté !
✅ MQTT connecté !
📊 Temp: 23.5°C | Hum: 45% → ✅ Envoyé
```

## 📚 Documentation

### Pour les Débutants
Commencez par: **BRANCHEMENT_RAPIDE.txt**
- Schémas visuels
- Étapes numérotées
- Checklist

### Pour Plus de Détails
Consultez: **GUIDE_ARDUINO.md**
- Installation complète Arduino IDE
- Configuration pas à pas
- Dépannage approfondi
- Personnalisation

### Ressources Externes
Voir: **LIENS_UTILES.md**
- Téléchargements
- Drivers USB
- Documentation
- Forums

## 🔧 Prérequis

### Matériel
- ✅ ESP8266 (NodeMCU, Wemos D1 Mini, ou autre)
- ✅ Capteur DHT11
- ✅ 3 câbles de connexion
- ✅ Câble USB pour programmer

### Logiciel
- ✅ Arduino IDE 1.8.x ou 2.x
- ✅ Bibliothèques:
  - DHT sensor library (Adafruit)
  - PubSubClient (Nick O'Leary)
  - Adafruit Unified Sensor

### Réseau
- ✅ WiFi 2.4 GHz (l'ESP8266 ne supporte pas 5 GHz)
- ✅ Raspberry Pi avec Mosquitto MQTT

## 💡 Fonctionnalités du Code

### Ce que Fait le Programme
1. ✅ Se connecte au WiFi
2. ✅ Se connecte au broker MQTT
3. ✅ Lit le DHT11 toutes les 3 secondes
4. ✅ Envoie les données au format JSON
5. ✅ Affiche tout dans le moniteur série
6. ✅ Reconnexion automatique en cas de coupure

### Format des Données Envoyées
```json
{
  "temp": 23.5,
  "hum": 45
}
```

Topic MQTT: `home/esp8266/dht11`

## 🐛 Dépannage Rapide

### Pas de Port COM ?
→ Installer driver CH340 ou CP2102
→ Voir LIENS_UTILES.md

### Erreur Compilation ?
→ Installer les bibliothèques DHT et PubSubClient
→ Voir GUIDE_ARDUINO.md section "Installation"

### WiFi Ne Connecte Pas ?
→ Vérifier SSID et mot de passe
→ WiFi doit être 2.4 GHz

### MQTT Ne Connecte Pas ?
→ Vérifier l'IP du Raspberry Pi
→ Ping l'IP depuis votre PC
→ Vérifier que Mosquitto fonctionne

### Lectures DHT11 Invalides (NaN) ?
→ Vérifier les connexions (VCC, DATA, GND)
→ Utiliser 3.3V (pas 5V)
→ Ajouter résistance 10kΩ entre DATA et VCC

## 🎨 Personnalisation

### Changer l'Intervalle d'Envoi
Modifier dans le code:
```cpp
#define INTERVALLE_LECTURE 3000  // 3 secondes
```

Pour 5 secondes: `5000`
Pour 10 secondes: `10000`

### Utiliser DHT22 (Plus Précis)
Modifier dans le code:
```cpp
#define DHTTYPE DHT22  // Au lieu de DHT11
```

### Changer le Pin du Capteur
Modifier dans le code:
```cpp
#define DHTPIN D5  // Au lieu de D4
```

## 📊 Vérification

### Test 1: Moniteur Série
✅ Messages de connexion WiFi
✅ Messages de connexion MQTT
✅ Lectures toutes les 3 secondes
✅ Confirmations d'envoi

### Test 2: Raspberry Pi
Sur le Raspberry Pi:
```bash
mosquitto_sub -h localhost -t "home/esp8266/dht11" -v
```

Vous devriez voir:
```
home/esp8266/dht11 {"temp":23.5,"hum":45}
```

### Test 3: Dashboard Web
1. Démarrer le backend Node.js
2. Ouvrir http://localhost:4200
3. Voir les données en temps réel !

## 🎯 Workflow Complet

```
1. Brancher DHT11 → ESP8266
2. Installer Arduino IDE et bibliothèques
3. Modifier le code (WiFi + MQTT)
4. Téléverser vers ESP8266
5. Vérifier moniteur série
6. Tester MQTT sur Raspberry Pi
7. Démarrer le dashboard web
8. Profiter des données en temps réel !
```

## 📞 Besoin d'Aide ?

1. **Consultez d'abord:** GUIDE_ARDUINO.md (très détaillé)
2. **Vérifiez:** Le moniteur série pour les messages d'erreur
3. **Testez:** Les connexions physiques
4. **Recherchez:** L'erreur sur Google
5. **Demandez:** Sur le forum Arduino

## ✅ Checklist

- [ ] DHT11 branché correctement
- [ ] Arduino IDE installé
- [ ] Support ESP8266 ajouté
- [ ] Bibliothèques installées
- [ ] Code modifié (WiFi, MQTT)
- [ ] ESP8266 branché via USB
- [ ] Port COM sélectionné
- [ ] Code téléversé avec succès
- [ ] Moniteur série affiche les lectures
- [ ] Données reçues sur Raspberry Pi
- [ ] Dashboard affiche les données

---

**🎉 Tout est Prêt ! Bon Développement IoT ! 🎉**

**Questions ?** Consultez GUIDE_ARDUINO.md pour tous les détails !
