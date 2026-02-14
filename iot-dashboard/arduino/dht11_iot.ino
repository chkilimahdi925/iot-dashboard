/*
 * ========================================
 * Programme ESP8266 + DHT11
 * Dashboard IoT - Version Complète
 * ========================================
 * 
 * Ce programme lit les données du capteur DHT11 (température et humidité)
 * et les envoie via MQTT à votre Raspberry Pi
 * 
 * Matériel requis:
 * - ESP8266 (NodeMCU, Wemos D1 Mini, etc.)
 * - Capteur DHT11
 * - Connexions:
 *   DHT11 VCC  -> ESP8266 3.3V
 *   DHT11 GND  -> ESP8266 GND
 *   DHT11 DATA -> ESP8266 D4 (GPIO2)
 * 
 * Auteur: Dashboard IoT
 * Date: 2024
 */

// ========================================
// BIBLIOTHÈQUES NÉCESSAIRES
// ========================================
#include <ESP8266WiFi.h>      // Pour la connexion WiFi
#include <PubSubClient.h>     // Pour le protocole MQTT
#include "DHT.h"              // Pour le capteur DHT11

// ========================================
// CONFIGURATION WIFI
// ========================================
// ⚠️ IMPORTANT: Modifiez ces valeurs avec vos propres informations WiFi
const char* WIFI_SSID = "Ordio";              // Nom de votre réseau WiFi
const char* WIFI_PASS = "789123456kkk";       // Mot de passe WiFi

// ========================================
// CONFIGURATION MQTT (RASPBERRY PI)
// ========================================
// ⚠️ IMPORTANT: Mettez l'adresse IP de votre Raspberry Pi
const char* MQTT_SERVER = "172.22.241.241";   // IP du Raspberry Pi
const int MQTT_PORT = 1883;                   // Port MQTT (standard)
const char* MQTT_TOPIC = "home/esp8266/dht11"; // Topic MQTT

// ========================================
// CONFIGURATION DHT11
// ========================================
#define DHTPIN D4        // Pin de données DHT11 (D4 = GPIO2)
#define DHTTYPE DHT11    // Type de capteur: DHT11

// ========================================
// CONFIGURATION GÉNÉRALE
// ========================================
#define INTERVALLE_LECTURE 3000  // Intervalle entre lectures (millisecondes)
                                 // 3000 ms = 3 secondes

// ========================================
// OBJETS GLOBAUX
// ========================================
WiFiClient espClient;
PubSubClient client(espClient);
DHT dht(DHTPIN, DHTTYPE);

// ========================================
// VARIABLES GLOBALES
// ========================================
unsigned long dernierEnvoi = 0;
int compteurLectures = 0;

// ========================================
// FONCTION: setup()
// Exécutée une seule fois au démarrage
// ========================================
void setup() {
  // Initialiser la communication série (pour déboguer)
  Serial.begin(115200);
  delay(100);
  
  Serial.println();
  Serial.println("========================================");
  Serial.println("  ESP8266 + DHT11 - Dashboard IoT");
  Serial.println("========================================");
  Serial.println();
  
  // Initialiser le capteur DHT11
  Serial.println("🌡️  Initialisation du capteur DHT11...");
  dht.begin();
  Serial.println("✅ DHT11 initialisé");
  
  // Connecter au WiFi
  connecterWiFi();
  
  // Configurer le serveur MQTT
  client.setServer(MQTT_SERVER, MQTT_PORT);
  
  Serial.println();
  Serial.println("✅ Configuration terminée");
  Serial.println("🚀 Démarrage des lectures...");
  Serial.println("========================================");
  Serial.println();
}

// ========================================
// FONCTION: loop()
// Exécutée en boucle continuellement
// ========================================
void loop() {
  // Vérifier et maintenir la connexion MQTT
  if (!client.connected()) {
    reconnecterMQTT();
  }
  client.loop();
  
  // Lire et envoyer les données à intervalle régulier
  unsigned long maintenant = millis();
  
  if (maintenant - dernierEnvoi >= INTERVALLE_LECTURE) {
    dernierEnvoi = maintenant;
    
    // Lire les données du DHT11
    lireEtEnvoyerDonnees();
  }
}

// ========================================
// FONCTION: connecterWiFi()
// Connexion au réseau WiFi
// ========================================
void connecterWiFi() {
  Serial.print("📡 Connexion au WiFi: ");
  Serial.println(WIFI_SSID);
  
  WiFi.mode(WIFI_STA);  // Mode station (client)
  WiFi.begin(WIFI_SSID, WIFI_PASS);
  
  int tentatives = 0;
  while (WiFi.status() != WL_CONNECTED && tentatives < 30) {
    delay(500);
    Serial.print(".");
    tentatives++;
  }
  
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println();
    Serial.println("✅ WiFi connecté !");
    Serial.print("📍 Adresse IP: ");
    Serial.println(WiFi.localIP());
    Serial.print("📶 Force du signal: ");
    Serial.print(WiFi.RSSI());
    Serial.println(" dBm");
  } else {
    Serial.println();
    Serial.println("❌ Échec de connexion WiFi");
    Serial.println("⚠️  Vérifiez SSID et mot de passe");
    Serial.println("🔄 Redémarrage dans 5 secondes...");
    delay(5000);
    ESP.restart();
  }
}

// ========================================
// FONCTION: reconnecterMQTT()
// Reconnexion au serveur MQTT si déconnecté
// ========================================
void reconnecterMQTT() {
  while (!client.connected()) {
    Serial.print("🔌 Connexion au serveur MQTT (");
    Serial.print(MQTT_SERVER);
    Serial.print(":");
    Serial.print(MQTT_PORT);
    Serial.print(")... ");
    
    // Créer un ID client unique basé sur l'ID de la puce
    String clientId = "ESP8266-DHT11-";
    clientId += String(ESP.getChipId(), HEX);
    
    // Tenter la connexion
    if (client.connect(clientId.c_str())) {
      Serial.println("✅ Connecté !");
      Serial.print("📤 Topic MQTT: ");
      Serial.println(MQTT_TOPIC);
    } else {
      Serial.print("❌ Échec, code erreur: ");
      Serial.println(client.state());
      Serial.println("🔄 Nouvelle tentative dans 5 secondes...");
      delay(5000);
    }
  }
}

// ========================================
// FONCTION: lireEtEnvoyerDonnees()
// Lit le DHT11 et envoie les données via MQTT
// ========================================
void lireEtEnvoyerDonnees() {
  // Lire l'humidité (%)
  float humidite = dht.readHumidity();
  
  // Lire la température (°C)
  float temperature = dht.readTemperature();
  
  // Vérifier si les lectures sont valides
  if (isnan(humidite) || isnan(temperature)) {
    Serial.println("❌ Erreur de lecture du capteur DHT11 !");
    return;
  }
  
  // Incrémenter le compteur
  compteurLectures++;
  
  // Afficher les valeurs sur le moniteur série
  Serial.print("📊 Lecture #");
  Serial.print(compteurLectures);
  Serial.print(" → ");
  Serial.print("🌡️  Temp: ");
  Serial.print(temperature, 1);
  Serial.print("°C | ");
  Serial.print("💧 Hum: ");
  Serial.print(humidite, 0);
  Serial.print("%");
  
  // Créer le message JSON
  // Format: {"temp":23.5,"hum":45}
  String payload = "{\"temp\":";
  payload += String(temperature, 1);  // 1 décimale pour la température
  payload += ",\"hum\":";
  payload += String(humidite, 0);     // Pas de décimale pour l'humidité
  payload += "}";
  
  // Envoyer via MQTT
  if (client.publish(MQTT_TOPIC, payload.c_str())) {
    Serial.print(" → ✅ Envoyé: ");
    Serial.println(payload);
  } else {
    Serial.println(" → ❌ Échec d'envoi MQTT");
  }
}

// ========================================
// CODES D'ERREUR MQTT
// ========================================
// -4 : MQTT_CONNECTION_TIMEOUT
// -3 : MQTT_CONNECTION_LOST
// -2 : MQTT_CONNECT_FAILED
// -1 : MQTT_DISCONNECTED
//  0 : MQTT_CONNECTED
//  1 : MQTT_CONNECT_BAD_PROTOCOL
//  2 : MQTT_CONNECT_BAD_CLIENT_ID
//  3 : MQTT_CONNECT_UNAVAILABLE
//  4 : MQTT_CONNECT_BAD_CREDENTIALS
//  5 : MQTT_CONNECT_UNAUTHORIZED
// ========================================
