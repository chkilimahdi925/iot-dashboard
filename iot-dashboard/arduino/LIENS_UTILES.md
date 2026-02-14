# 🔗 Liens Utiles - ESP8266 + DHT11

## 🖥️ Logiciels Principaux

### Arduino IDE
- **Téléchargement:** https://www.arduino.cc/en/software
- **Version recommandée:** 2.x (dernière)
- **Plateformes:** Windows, macOS, Linux

### Drivers USB

**Pour NodeMCU (chipset CH340):**
- **Windows:** https://sparks.gogo.co.nz/ch340.html
- **macOS:** https://github.com/adrianmihalko/ch340g-ch34g-ch34x-mac-os-x-driver
- **Linux:** Intégré dans le système

**Pour Wemos D1 Mini (chipset CP2102):**
- **Tous OS:** https://www.silabs.com/developers/usb-to-uart-bridge-vcp-drivers

## 📚 Bibliothèques Arduino

Toutes installables via le Gestionnaire de Bibliothèques Arduino:

### DHT Sensor Library
- **Nom:** DHT sensor library
- **Auteur:** Adafruit
- **GitHub:** https://github.com/adafruit/DHT-sensor-library
- **Installation:** Outils → Gérer les bibliothèques → Rechercher "DHT sensor library"

### PubSubClient (MQTT)
- **Nom:** PubSubClient
- **Auteur:** Nick O'Leary
- **GitHub:** https://github.com/knolleary/pubsubclient
- **Installation:** Outils → Gérer les bibliothèques → Rechercher "PubSubClient"

### Adafruit Unified Sensor
- **Nom:** Adafruit Unified Sensor
- **Auteur:** Adafruit
- **GitHub:** https://github.com/adafruit/Adafruit_Sensor
- **Installation:** Automatique avec DHT sensor library

## 🔧 Support ESP8266

### URL du Gestionnaire de Cartes
```
http://arduino.esp8266.com/stable/package_esp8266com_index.json
```

**À ajouter dans:** Fichier → Préférences → URLs gestionnaire de cartes supplémentaires

### Documentation ESP8266
- **Guide officiel:** https://arduino-esp8266.readthedocs.io/
- **GitHub:** https://github.com/esp8266/Arduino
- **Forum:** https://www.esp8266.com/

## 📖 Documentation Capteurs

### DHT11
- **Datasheet:** https://www.mouser.com/datasheet/2/758/DHT11-Technical-Data-Sheet-Translated-Version-1143054.pdf
- **Tutoriel Adafruit:** https://learn.adafruit.com/dht

### DHT22 (Alternative plus précise)
- **Datasheet:** https://www.sparkfun.com/datasheets/Sensors/Temperature/DHT22.pdf
- **Comparaison DHT11 vs DHT22:** https://randomnerdtutorials.com/dht11-vs-dht22-temperature-humidity-sensor/

## 🛠️ Outils de Diagnostic

### MQTT Explorer (Visualiser les messages MQTT)
- **Windows/macOS/Linux:** http://mqtt-explorer.com/
- **Alternative:** MQTT.fx - https://mqttfx.jensd.de/

### Mosquitto Clients (Ligne de commande)
- **Windows:** https://mosquitto.org/download/
- **Linux:** `sudo apt-get install mosquitto-clients`
- **macOS:** `brew install mosquitto`

## 📱 Applications Mobile

### MQTT Dashboard (Android)
- **Google Play:** https://play.google.com/store/apps/details?id=com.thn.iotmqttdashboard

### MQTTool (iOS)
- **App Store:** https://apps.apple.com/app/mqttool/id1085976398

## 🎓 Tutoriels et Ressources

### ESP8266 + MQTT
- **Random Nerd Tutorials:** https://randomnerdtutorials.com/esp8266-and-node-red-with-mqtt/
- **Last Minute Engineers:** https://lastminuteengineers.com/esp8266-dht11-dht22-web-server-tutorial/

### MQTT Protocol
- **Introduction:** https://mqtt.org/
- **Mosquitto Documentation:** https://mosquitto.org/documentation/

### Node.js + MQTT
- **MQTT.js:** https://github.com/mqttjs/MQTT.js
- **Tutoriel:** https://www.hivemq.com/blog/mqtt-client-library-encyclopedia-node-js/

## 🔍 Dépannage

### Erreurs Courantes ESP8266
- **ESP8266 Community Forum:** https://www.esp8266.com/
- **Arduino Forum - ESP8266:** https://forum.arduino.cc/c/hardware/esp8266/93

### Driver CH340 ne fonctionne pas
- **Guide Windows 10:** https://learn.sparkfun.com/tutorials/how-to-install-ch340-drivers/all
- **Problèmes macOS:** https://github.com/adrianmihalko/ch340g-ch34g-ch34x-mac-os-x-driver

## 🌐 MongoDB Atlas

### Création de Compte et Cluster
- **Inscription:** https://www.mongodb.com/cloud/atlas/register
- **Documentation:** https://docs.atlas.mongodb.com/getting-started/
- **Tutoriel Connexion Node.js:** https://docs.atlas.mongodb.com/driver-connection/

### MongoDB Compass (Interface Graphique)
- **Téléchargement:** https://www.mongodb.com/try/download/compass
- **Guide:** https://docs.mongodb.com/compass/current/

## 💻 Développement Web

### Node.js
- **Téléchargement:** https://nodejs.org/
- **Documentation:** https://nodejs.org/docs/

### Angular
- **Site officiel:** https://angular.io/
- **Documentation:** https://angular.io/docs
- **CLI:** https://angular.io/cli

## 🎨 Ressources Supplémentaires

### Fritzing (Schémas de Circuit)
- **Téléchargement:** https://fritzing.org/download/
- **Bibliothèque ESP8266:** https://github.com/squix78/esp8266-fritzing-parts

### Wokwi (Simulateur Arduino en ligne)
- **Site:** https://wokwi.com/
- **ESP8266 Simulator:** https://wokwi.com/arduino/projects

## 📞 Support Communautaire

### Forums Recommandés
- **Arduino Forum:** https://forum.arduino.cc/
- **ESP8266 Community:** https://www.esp8266.com/
- **Reddit - r/esp8266:** https://www.reddit.com/r/esp8266/
- **Stack Overflow:** https://stackoverflow.com/questions/tagged/esp8266

## 📦 Fournisseurs de Composants

### International
- **AliExpress:** https://www.aliexpress.com/ (ESP8266, DHT11 à petit prix)
- **Banggood:** https://www.banggood.com/
- **Amazon:** https://www.amazon.com/

### Europe
- **Conrad:** https://www.conrad.fr/
- **Gotronic:** https://www.gotronic.fr/
- **Mouser:** https://www.mouser.fr/

## 🆘 En Cas de Problème

1. **Vérifier le moniteur série** (115200 baud)
2. **Consulter la documentation** ESP8266
3. **Rechercher l'erreur** sur Google
4. **Poster sur le forum** Arduino avec:
   - Photo du branchement
   - Code complet
   - Message d'erreur exact
   - Modèle de l'ESP8266

---

## ⭐ Marque-pages Essentiels

**Pour démarrer rapidement:**
1. Arduino IDE: https://www.arduino.cc/en/software
2. Driver CH340: https://sparks.gogo.co.nz/ch340.html
3. ESP8266 Documentation: https://arduino-esp8266.readthedocs.io/
4. MongoDB Atlas: https://www.mongodb.com/cloud/atlas

**Gardez ces liens à portée de main !**
