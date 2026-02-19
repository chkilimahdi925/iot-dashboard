/*
 * ════════════════════════════════════════════════════════════
 * ESP8266 HYBRIDE AVEC DÉDUPLICATION
 * Publie sur Raspberry Pi (local) ET HiveMQ Cloud (distant)
 * Génère msgId unique pour éviter les doublons
 * ════════════════════════════════════════════════════════════
 */

#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <WiFiClientSecure.h>
#include "DHT.h"

// ════════════════════════════════════════════════════════════
// CONFIGURATION DHT11
// ════════════════════════════════════════════════════════════
#define DHTPIN D4
#define DHTTYPE DHT11

// ════════════════════════════════════════════════════════════
// CONFIGURATION WIFI
// ════════════════════════════════════════════════════════════
const char* WIFI_SSID = "Ordio";              
const char* WIFI_PASS = "789123456kkk";       

// ════════════════════════════════════════════════════════════
// MQTT LOCAL (Raspberry Pi)
// ════════════════════════════════════════════════════════════
const char* MQTT_LOCAL_SERVER = "172.22.241.241";  
const int MQTT_LOCAL_PORT = 1883;
const char* MQTT_LOCAL_TOPIC = "home/esp8266/dht11";

// ════════════════════════════════════════════════════════════
// MQTT CLOUD (HiveMQ)
// ════════════════════════════════════════════════════════════
const char* MQTT_CLOUD_SERVER = "183fde5ba0564588994ebfa2022137e4.s1.eu.hivemq.cloud";   
const int MQTT_CLOUD_PORT = 8883;
const char* MQTT_CLOUD_USER = "esp8266";
const char* MQTT_CLOUD_PASS = "Esp82668266";         

// ════════════════════════════════════════════════════════════
// DEVICE ID (pour générer msgId unique)
// ════════════════════════════════════════════════════════════
const char* DEVICE_ID = "esp8266";

// ════════════════════════════════════════════════════════════
// CLIENTS MQTT
// ════════════════════════════════════════════════════════════
WiFiClient localClient;
WiFiClientSecure cloudClient;
PubSubClient mqttLocal(localClient);
PubSubClient mqttCloud(cloudClient);
DHT dht(DHTPIN, DHTTYPE);

// État des connexions
bool localConnected = false;
bool cloudConnected = false;

// ════════════════════════════════════════════════════════════
// SETUP
// ════════════════════════════════════════════════════════════
void setup() {
  Serial.begin(115200);
  delay(100);
  
  Serial.println();
  Serial.println("╔════════════════════════════════════════╗");
  Serial.println("║  ESP8266 HYBRIDE + DÉDUPLICATION       ║");
  Serial.println("║  msgId unique évite les doublons       ║");
  Serial.println("╚════════════════════════════════════════╝");
  Serial.println();
  
  // Initialiser DHT11
  Serial.println("🌡️  Initialisation DHT11...");
  dht.begin();
  Serial.println("✅ DHT11 prêt");
  Serial.println();
  
  // Connexion WiFi
  Serial.print("📡 Connexion WiFi");
  WiFi.begin(WIFI_SSID, WIFI_PASS);
  
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 30) {
    delay(500);
    Serial.print(".");
    attempts++;
  }
  
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println(" ✅");
    Serial.print("IP: ");
    Serial.println(WiFi.localIP());
    Serial.print("Signal: ");
    Serial.print(WiFi.RSSI());
    Serial.println(" dBm");
  } else {
    Serial.println(" ❌");
    Serial.println("⚠️  Échec WiFi - Vérifier SSID/password");
    while(1) { delay(1000); }
  }
  
  Serial.println();
  
  // Configuration MQTT Local (Raspberry Pi)
  Serial.println("🏠 Configuration MQTT LOCAL (Raspberry Pi)...");
  mqttLocal.setServer(MQTT_LOCAL_SERVER, MQTT_LOCAL_PORT);
  Serial.print("   Serveur: ");
  Serial.print(MQTT_LOCAL_SERVER);
  Serial.print(":");
  Serial.println(MQTT_LOCAL_PORT);
  
  Serial.println();
  
  // Configuration MQTT Cloud (HiveMQ)
  Serial.println("☁️  Configuration MQTT CLOUD (HiveMQ)...");
  cloudClient.setInsecure(); // Pour HiveMQ Cloud gratuit
  mqttCloud.setServer(MQTT_CLOUD_SERVER, MQTT_CLOUD_PORT);
  Serial.print("   Serveur: ");
  Serial.print(MQTT_CLOUD_SERVER);
  Serial.print(":");
  Serial.println(MQTT_CLOUD_PORT);
  
  Serial.println();
  Serial.println("🚀 Configuration terminée !");
  Serial.println("════════════════════════════════════════");
  Serial.println();
}

// ════════════════════════════════════════════════════════════
// RECONNEXION MQTT LOCAL
// ════════════════════════════════════════════════════════════
void reconnectLocal() {
  if (!mqttLocal.connected()) {
    Serial.print("🏠 MQTT Local...");
    
    String clientId = "ESP8266-Local-";
    clientId += String(ESP.getChipId(), HEX);
    
    if (mqttLocal.connect(clientId.c_str())) {
      Serial.println(" ✅");
      localConnected = true;
    } else {
      Serial.print(" ❌ (Code: ");
      Serial.print(mqttLocal.state());
      Serial.println(")");
      localConnected = false;
    }
  }
}

// ════════════════════════════════════════════════════════════
// RECONNEXION MQTT CLOUD
// ════════════════════════════════════════════════════════════
void reconnectCloud() {
  if (!mqttCloud.connected()) {
    Serial.print("☁️  MQTT Cloud...");
    
    String clientId = "ESP8266-Cloud-";
    clientId += String(ESP.getChipId(), HEX);
    
    if (mqttCloud.connect(clientId.c_str(), MQTT_CLOUD_USER, MQTT_CLOUD_PASS)) {
      Serial.println(" ✅");
      cloudConnected = true;
    } else {
      Serial.print(" ❌ (Code: ");
      Serial.print(mqttCloud.state());
      Serial.println(")");
      
      if (mqttCloud.state() == 4) {
        Serial.println("   ⚠️  Username/Password HiveMQ incorrects !");
      }
      
      cloudConnected = false;
    }
  }
}

// ════════════════════════════════════════════════════════════
// GÉNÉRER msgId UNIQUE
// Format : deviceId-timestamp
// Exemple : esp8266-1739621234567
// ════════════════════════════════════════════════════════════
String generateMsgId() {
  unsigned long timestamp = millis();
  String msgId = String(DEVICE_ID) + "-" + String(timestamp);
  return msgId;
}

// ════════════════════════════════════════════════════════════
// LOOP
// ════════════════════════════════════════════════════════════
void loop() {
  // Maintenir les connexions
  reconnectLocal();
  reconnectCloud();
  
  mqttLocal.loop();
  mqttCloud.loop();
  
  // Lecture DHT11
  float temp = dht.readTemperature();
  float hum = dht.readHumidity();
  
  if (isnan(temp) || isnan(hum)) {
    Serial.println("❌ Erreur lecture DHT11");
    Serial.println("   → Vérifier connexions");
    delay(3000);
    return;
  }
  
  // Générer msgId UNIQUE pour cette mesure
  String msgId = generateMsgId();
  
  // Créer JSON avec msgId
  String payload = "{\"msgId\":\"";
  payload += msgId;
  payload += "\",\"temp\":";
  payload += String(temp, 1);
  payload += ",\"hum\":";
  payload += String(hum, 0);
  payload += "}";
  
  // Affichage
  Serial.println("════════════════════════════════════════");
  Serial.print("🆔 msgId : ");
  Serial.println(msgId);
  Serial.print("📊 Data  : ");
  Serial.println(payload);
  Serial.println();
  
  // Publier sur MQTT LOCAL (Raspberry Pi)
  if (localConnected) {
    if (mqttLocal.publish(MQTT_LOCAL_TOPIC, payload.c_str())) {
      Serial.println("  ✅ Envoyé → LOCAL (Raspberry Pi)");
    } else {
      Serial.println("  ❌ Échec → LOCAL");
      localConnected = false;
    }
  } else {
    Serial.println("  ⚠️  LOCAL déconnecté (Raspberry Pi)");
  }
  
  Serial.println();
  
  // Publier sur MQTT CLOUD (HiveMQ)
  if (cloudConnected) {
    if (mqttCloud.publish(MQTT_LOCAL_TOPIC, payload.c_str())) {
      Serial.println("  ✅ Envoyé → CLOUD (HiveMQ)");
    } else {
      Serial.println("  ❌ Échec → CLOUD");
      cloudConnected = false;
    }
  } else {
    Serial.println("  ⚠️  CLOUD déconnecté (HiveMQ)");
  }
  
  Serial.println();
  
  // Afficher l'état
  Serial.print("Mode : ");
  if (localConnected && cloudConnected) {
    Serial.println("✅✅ HYBRIDE (LOCAL + CLOUD) ✅✅");
  } else if (localConnected) {
    Serial.println("🏠 LOCAL uniquement");
  } else if (cloudConnected) {
    Serial.println("☁️  CLOUD uniquement");
  } else {
    Serial.println("❌ AUCUNE CONNEXION MQTT");
  }
  
  Serial.println("════════════════════════════════════════");
  Serial.println();
  
  // Attendre 3 secondes
  delay(3000);
}

/*
 * ════════════════════════════════════════════════════════════
 * POINTS CLÉS
 * ════════════════════════════════════════════════════════════
 * 
 * 1. GÉNÉRATION msgId :
 *    - Fonction generateMsgId() ligne 186-190
 *    - Format : deviceId-timestamp (unique)
 * 
 * 2. PUBLICATION DOUBLE :
 *    - Même message avec même msgId
 *    - Envoyé à Raspberry Pi ET HiveMQ
 * 
 * 3. DÉDUPLICATION :
 *    - Se fait côté backend
 *    - Backend ignore les doublons avec Cache LRU
 * 
 * ════════════════════════════════════════════════════════════
 */
