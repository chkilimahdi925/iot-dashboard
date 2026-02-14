# 📟 Guide Complet - Programmer l'ESP8266 avec DHT11

## 🎯 Objectif

Programmer votre ESP8266 pour qu'il lise le capteur DHT11 et envoie les données via MQTT.

---

## 📦 Matériel Requis

### Composants
- ✅ **ESP8266** (NodeMCU, Wemos D1 Mini, ou autre)
- ✅ **Capteur DHT11**
- ✅ **Câbles de connexion** (3 fils minimum)
- ✅ **Câble USB** pour programmer l'ESP8266

### Logiciel
- ✅ **Arduino IDE** 1.8.x ou 2.x
- ✅ **Bibliothèques** (on va les installer)

---

## 🔌 Schéma de Connexion

```
DHT11                    ESP8266 (NodeMCU)
┌─────────┐             ┌──────────────┐
│         │             │              │
│  VCC ───┼────────────►│ 3.3V         │
│         │             │              │
│  DATA ──┼────────────►│ D4 (GPIO2)   │
│         │             │              │
│  GND ───┼────────────►│ GND          │
│         │             │              │
└─────────┘             └──────────────┘
```

### Détail des Connexions

| DHT11 | ESP8266 NodeMCU | Couleur Câble |
|-------|-----------------|---------------|
| VCC   | 3.3V            | Rouge         |
| DATA  | D4 (GPIO2)      | Jaune/Blanc   |
| GND   | GND             | Noir          |

⚠️ **IMPORTANT:** 
- Utilisez **3.3V** (pas 5V !)
- Le pin D4 correspond à GPIO2

---

## 💻 Installation Arduino IDE

### Étape 1: Télécharger Arduino IDE

**Windows:**
1. Allez sur https://www.arduino.cc/en/software
2. Téléchargez **Arduino IDE 2.x** (dernière version)
3. Installez le fichier `.exe`

**Déjà installé ?** Passez à l'étape 2.

### Étape 2: Ajouter le Support ESP8266

1. **Ouvrir Arduino IDE**

2. **Aller dans les Préférences:**
   - Menu: `Fichier` → `Préférences`
   - (Ou `File` → `Preferences` en anglais)

3. **Ajouter l'URL des cartes ESP8266:**
   - Dans "URL de gestionnaire de cartes supplémentaires"
   - Coller cette URL:
   ```
   http://arduino.esp8266.com/stable/package_esp8266com_index.json
   ```
   - Cliquer sur `OK`

4. **Installer le package ESP8266:**
   - Menu: `Outils` → `Type de carte` → `Gestionnaire de cartes`
   - Rechercher: `esp8266`
   - Installer: **esp8266 by ESP8266 Community**
   - Version: Dernière version (ex: 3.1.2)
   - Cliquer sur `Installer`
   - Attendre la fin du téléchargement (2-3 minutes)

### Étape 3: Installer les Bibliothèques

**Méthode Automatique (Recommandée):**

1. **Ouvrir le Gestionnaire de Bibliothèques:**
   - Menu: `Outils` → `Gérer les bibliothèques...`
   - (Ou `Tools` → `Manage Libraries...`)

2. **Installer DHT sensor library:**
   - Rechercher: `DHT sensor library`
   - Par: **Adafruit**
   - Version: Dernière
   - Cliquer sur `Installer`
   - Si demandé d'installer les dépendances → Cliquer sur `Install all`

3. **Installer PubSubClient:**
   - Rechercher: `PubSubClient`
   - Par: **Nick O'Leary**
   - Version: Dernière
   - Cliquer sur `Installer`

4. **Vérifier Adafruit Unified Sensor:**
   - Rechercher: `Adafruit Unified Sensor`
   - Par: **Adafruit**
   - Si pas installé → `Installer`

✅ **Bibliothèques installées !**

---

## 📝 Charger le Programme

### Étape 1: Ouvrir le Fichier

1. Copier le fichier `dht11_iot.ino` sur votre PC
2. Double-cliquer dessus pour l'ouvrir dans Arduino IDE

### Étape 2: Configurer Vos Paramètres

**⚠️ IMPORTANT: Modifiez ces lignes dans le code:**

```cpp
// CONFIGURATION WIFI
const char* WIFI_SSID = "Ordio";              // ← VOTRE WIFI
const char* WIFI_PASS = "789123456kkk";       // ← VOTRE MOT DE PASSE

// CONFIGURATION MQTT
const char* MQTT_SERVER = "172.22.241.241";   // ← IP DU RASPBERRY PI
```

**Comment trouver l'IP du Raspberry Pi ?**

Sur le Raspberry Pi, tapez:
```bash
hostname -I
```

### Étape 3: Sélectionner la Carte

1. **Brancher l'ESP8266** au PC via USB

2. **Sélectionner le type de carte:**
   - Menu: `Outils` → `Type de carte`
   - Choisir selon votre matériel:
     - `NodeMCU 1.0 (ESP-12E Module)` pour NodeMCU
     - `LOLIN(WEMOS) D1 R2 & mini` pour Wemos D1 Mini
     - `Generic ESP8266 Module` si autre

3. **Sélectionner le port COM:**
   - Menu: `Outils` → `Port`
   - Choisir le port COM qui apparaît
   - Windows: `COM3`, `COM4`, etc.
   - Si aucun port n'apparaît → Installer les drivers (voir section Dépannage)

4. **Configurer les paramètres (pour NodeMCU):**
   - **Upload Speed:** `115200`
   - **CPU Frequency:** `80 MHz`
   - **Flash Size:** `4MB (FS:2MB OTA:~1019KB)`

### Étape 4: Compiler et Téléverser

1. **Vérifier le code:**
   - Cliquer sur ✓ (Vérifier)
   - Attendre que "Compilation terminée" apparaisse

2. **Téléverser vers l'ESP8266:**
   - Cliquer sur → (Téléverser)
   - Attendre la compilation
   - Attendre le téléversement (barres bleues)
   - Message final: "Téléversement terminé"

⏱️ **Temps total:** 1-2 minutes

---

## 🔍 Tester le Programme

### Étape 1: Ouvrir le Moniteur Série

1. **Ouvrir le moniteur:**
   - Menu: `Outils` → `Moniteur série`
   - Ou cliquer sur l'icône 🔍 en haut à droite

2. **Configurer:**
   - Sélectionner **115200 baud** en bas à droite
   - Sélectionner **Nouvelle ligne** (NL)

### Étape 2: Vérifier la Sortie

Vous devriez voir quelque chose comme:

```
========================================
  ESP8266 + DHT11 - Dashboard IoT
========================================

🌡️  Initialisation du capteur DHT11...
✅ DHT11 initialisé
📡 Connexion au WiFi: Ordio
.......
✅ WiFi connecté !
📍 Adresse IP: 192.168.1.100
📶 Force du signal: -45 dBm

🔌 Connexion au serveur MQTT (172.22.241.241:1883)... ✅ Connecté !
📤 Topic MQTT: home/esp8266/dht11

✅ Configuration terminée
🚀 Démarrage des lectures...
========================================

📊 Lecture #1 → 🌡️  Temp: 23.5°C | 💧 Hum: 45% → ✅ Envoyé: {"temp":23.5,"hum":45}
📊 Lecture #2 → 🌡️  Temp: 23.6°C | 💧 Hum: 45% → ✅ Envoyé: {"temp":23.6,"hum":45}
📊 Lecture #3 → 🌡️  Temp: 23.5°C | 💧 Hum: 46% → ✅ Envoyé: {"temp":23.5,"hum":46}
```

✅ **Si vous voyez ça, PARFAIT !**

---

## 🐛 Dépannage

### Problème 1: Pas de Port COM Visible

**Solution:**

**Pour NodeMCU / CH340G:**
1. Télécharger le driver CH340:
   - https://sparks.gogo.co.nz/ch340.html
2. Installer le driver
3. Redémarrer Arduino IDE
4. Rebrancher l'ESP8266

**Pour Wemos / CP2102:**
1. Télécharger le driver CP210x:
   - https://www.silabs.com/developers/usb-to-uart-bridge-vcp-drivers
2. Installer
3. Redémarrer

### Problème 2: Erreur de Compilation

```
DHT.h: No such file or directory
```

**Solution:**
- Installer la bibliothèque DHT (voir Étape 3 ci-dessus)

```
PubSubClient.h: No such file or directory
```

**Solution:**
- Installer la bibliothèque PubSubClient

### Problème 3: Erreur de Téléversement

```
error: espcomm_upload_mem failed
```

**Solutions:**
1. Appuyer sur le bouton RESET de l'ESP8266
2. Débrancher/rebrancher l'USB
3. Essayer un autre câble USB (certains câbles ne transmettent pas les données)
4. Fermer Arduino IDE et redémarrer

### Problème 4: WiFi Ne Se Connecte Pas

**Vérifications:**
- ✅ SSID correct (sensible à la casse)
- ✅ Mot de passe correct
- ✅ WiFi 2.4 GHz (l'ESP8266 ne supporte pas 5 GHz)
- ✅ L'ESP8266 est à portée du WiFi

### Problème 5: MQTT Ne Se Connecte Pas

**Vérifications:**
1. **Ping le Raspberry Pi depuis votre PC:**
   ```cmd
   ping 172.22.241.241
   ```
   
2. **Vérifier que Mosquitto fonctionne:**
   Sur le Raspberry Pi:
   ```bash
   sudo systemctl status mosquitto
   ```

3. **Tester MQTT depuis PC:**
   ```bash
   mosquitto_sub -h 172.22.241.241 -t "home/esp8266/dht11" -v
   ```

### Problème 6: Lectures DHT11 Invalides (NaN)

```
❌ Erreur de lecture du capteur DHT11 !
```

**Solutions:**
1. **Vérifier les connexions:**
   - VCC → 3.3V (pas 5V)
   - DATA → D4
   - GND → GND

2. **Ajouter une résistance pull-up:**
   - Résistance 10kΩ entre DATA et VCC

3. **Changer le pin:**
   - Essayer D1, D2, ou D5 au lieu de D4
   - Modifier dans le code: `#define DHTPIN D1`

4. **Tester le capteur:**
   - Déconnecter et reconnecter
   - Essayer un autre capteur DHT11

---

## 🎛️ Personnalisation

### Changer l'Intervalle d'Envoi

Par défaut: 3 secondes

Pour changer à 5 secondes:
```cpp
#define INTERVALLE_LECTURE 5000  // 5000 ms = 5 secondes
```

Pour changer à 10 secondes:
```cpp
#define INTERVALLE_LECTURE 10000  // 10 secondes
```

### Changer le Pin du DHT11

Si vous connectez DATA à D5 au lieu de D4:
```cpp
#define DHTPIN D5  // Utiliser D5 au lieu de D4
```

### Utiliser DHT22 au Lieu de DHT11

Le DHT22 est plus précis. Pour l'utiliser:
```cpp
#define DHTTYPE DHT22  // Changer DHT11 en DHT22
```

---

## 📊 Vérifier que Ça Marche

### Test 1: Moniteur Série Arduino

✅ Vous voyez les lectures toutes les 3 secondes
✅ Messages `✅ Envoyé`

### Test 2: Mosquitto sur Raspberry Pi

Sur le Raspberry Pi:
```bash
mosquitto_sub -h localhost -t "home/esp8266/dht11" -v
```

Vous devriez voir:
```
home/esp8266/dht11 {"temp":23.5,"hum":45}
home/esp8266/dht11 {"temp":23.6,"hum":45}
```

### Test 3: Dashboard Web

1. Démarrer le backend: `npm start`
2. Ouvrir http://localhost:4200
3. Voir les données en temps réel !

---

## 📋 Checklist Finale

- [ ] Arduino IDE installé
- [ ] Support ESP8266 installé
- [ ] Bibliothèques DHT et PubSubClient installées
- [ ] DHT11 connecté correctement
- [ ] ESP8266 branché via USB
- [ ] Port COM sélectionné
- [ ] WIFI_SSID et WIFI_PASS modifiés dans le code
- [ ] MQTT_SERVER (IP Raspberry) modifié
- [ ] Code compilé sans erreur
- [ ] Code téléversé avec succès
- [ ] Moniteur série affiche les lectures
- [ ] Messages MQTT reçus sur Raspberry Pi
- [ ] Dashboard web affiche les données

---

## 🎉 Félicitations !

Votre ESP8266 envoie maintenant les données du DHT11 !

**Prochaines étapes:**
1. ✅ Laisser tourner 24/7
2. 📊 Consulter les statistiques sur le dashboard
3. 📱 Ajouter d'autres capteurs si vous voulez

---

## 📞 Support

**Problème persistant ?**
1. Vérifier le moniteur série pour les messages d'erreur
2. Vérifier les connexions physiques
3. Tester avec un exemple simple de blink LED
4. Consulter la documentation ESP8266: https://arduino-esp8266.readthedocs.io/

---

**✨ Bon développement IoT ! ✨**
