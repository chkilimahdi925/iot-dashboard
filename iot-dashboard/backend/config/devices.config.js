// Configuration centralisée des appareils IoT
// Ajoutez vos appareils ici avec leur configuration

const DEVICES = [
  {
    id: 'esp8266_dht11',
    name: 'Capteur Température/Humidité',
    type: 'DHT11',
    location: 'Salon',
    mqttTopic: 'home/esp8266/dht11',
    icon: '🌡️',
    enabled: true,
    sensors: [
      {
        key: 'temp',
        label: 'Température',
        unit: '°C',
        type: 'temperature',
        icon: '🌡️',
        thresholds: {
          min: 18,
          max: 28,
          critical_min: 10,
          critical_max: 35
        }
      },
      {
        key: 'hum',
        label: 'Humidité',
        unit: '%',
        type: 'humidity',
        icon: '💧',
        thresholds: {
          min: 30,
          max: 60,
          critical_min: 20,
          critical_max: 80
        }
      }
    ]
  },
  
  // EXEMPLE: Capteur de Gaz (MQ-2)
  {
    id: 'esp8266_mq2',
    name: 'Capteur de Gaz',
    type: 'MQ-2',
    location: 'Cuisine',
    mqttTopic: 'home/esp8266/gas',
    icon: '🔥',
    enabled: false, // Mettre à true quand vous l'ajoutez
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
      },
      {
        key: 'smoke',
        label: 'Fumée',
        unit: 'ppm',
        type: 'smoke',
        icon: '💨',
        thresholds: {
          min: 0,
          max: 200,
          critical_min: 0,
          critical_max: 500
        }
      }
    ]
  },

  // EXEMPLE: Capteur de Mouvement (PIR)
  {
    id: 'esp8266_pir',
    name: 'Détecteur de Mouvement',
    type: 'PIR',
    location: 'Entrée',
    mqttTopic: 'home/esp8266/motion',
    icon: '🚶',
    enabled: false,
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
      }
    ]
  },

  // EXEMPLE: Capteur de Luminosité
  {
    id: 'esp8266_light',
    name: 'Capteur de Luminosité',
    type: 'BH1750',
    location: 'Bureau',
    mqttTopic: 'home/esp8266/light',
    icon: '💡',
    enabled: false,
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
          critical_max: 10000
        }
      }
    ]
  },

  // EXEMPLE: Capteur de Distance
  {
    id: 'esp8266_ultrasonic',
    name: 'Capteur de Distance',
    type: 'HC-SR04',
    location: 'Garage',
    mqttTopic: 'home/esp8266/distance',
    icon: '📏',
    enabled: false,
    sensors: [
      {
        key: 'distance',
        label: 'Distance',
        unit: 'cm',
        type: 'distance',
        icon: '📏',
        thresholds: {
          min: 0,
          max: 200,
          critical_min: 0,
          critical_max: 400
        }
      }
    ]
  }
];

// Fonction pour obtenir tous les appareils actifs
function getActiveDevices() {
  return DEVICES.filter(device => device.enabled);
}

// Fonction pour obtenir un appareil par ID
function getDeviceById(id) {
  return DEVICES.find(device => device.id === id);
}

// Fonction pour obtenir tous les topics MQTT actifs
function getActiveTopics() {
  return getActiveDevices().map(device => device.mqttTopic);
}

module.exports = {
  DEVICES,
  getActiveDevices,
  getDeviceById,
  getActiveTopics
};
