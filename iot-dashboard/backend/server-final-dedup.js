const { LRUCache } = require('lru-cache');
require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mqtt = require('mqtt');
const mongoose = require('mongoose');
const LRU = require('lru-cache');
const SensorData = require('./models/SensorData');
const { getActiveDevices, getDeviceById } = require('./config/devices.config');

const app = express();
const server = http.createServer(app);

// ════════════════════════════════════════════════════════════
// CACHE LRU POUR DÉDUPLICATION
// ════════════════════════════════════════════════════════════
const msgCache = new LRUCache({
  max: 1000,              // Garde 1000 derniers msgId
  ttl: 1000 * 60 * 10     // 10 minutes de durée de vie
});

console.log('\n╔════════════════════════════════════════╗');
console.log('║  BACKEND HYBRIDE + DÉDUPLICATION       ║');
console.log('║  Cache LRU : 1000 msgId (10 min TTL)   ║');
console.log('╚════════════════════════════════════════╝\n');

// Statistiques
let stats = {
  totalReceived: 0,
  duplicates: 0,
  saved: 0
};

// ════════════════════════════════════════════════════════════
// SOCKET.IO
// ════════════════════════════════════════════════════════════
const io = socketIo(server, {
  cors: {
    origin: ["http://localhost:4200", process.env.FRONTEND_URL || "*"],
    methods: ["GET", "POST"],
    credentials: true
  }
});

app.use(express.json());

// CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connecté'))
  .catch(err => console.error('❌ Erreur MongoDB:', err));

// ════════════════════════════════════════════════════════════
// CONFIGURATION MQTT
// ════════════════════════════════════════════════════════════
const USE_LOCAL = process.env.USE_LOCAL_MQTT !== 'false';
const USE_CLOUD = process.env.USE_CLOUD_MQTT !== 'false';

console.log('Configuration MQTT:');
console.log(`  🏠 LOCAL:  ${USE_LOCAL ? '✅ Activé' : '❌ Désactivé'}`);
console.log(`  ☁️  CLOUD:  ${USE_CLOUD ? '✅ Activé' : '❌ Désactivé'}`);
console.log();

// ════════════════════════════════════════════════════════════
// FONCTION TRAITEMENT AVEC DÉDUPLICATION
// ════════════════════════════════════════════════════════════
async function handleMQTTMessage(topic, message, source) {
  try {
    const data = JSON.parse(message.toString());
    stats.totalReceived++;
    
    // Générer msgId automatique si absent
    if (!data.msgId) {
      console.log(`⚠️  Message sans msgId (source: ${source})`);
      data.msgId = `auto-${source}-${Date.now()}`;
    }
    
    // VÉRIFIER CACHE LRU
    if (msgCache.has(data.msgId)) {
      stats.duplicates++;
      console.log(`🔄 DOUBLON détecté (source: ${source})`);
      console.log(`   msgId: ${data.msgId}`);
      console.log(`   Stats: ${stats.duplicates} doublons / ${stats.totalReceived} total`);
      console.log(`   ⏩ IGNORÉ\n`);
      return;  // IGNORER
    }
    
    // NOUVEAU MESSAGE → Ajouter au cache
    msgCache.set(data.msgId, true);
    
    console.log(`📥 Message NOUVEAU (source: ${source})`);
    console.log(`   msgId: ${data.msgId}`);
    console.log(`   temp=${data.temp}°C, hum=${data.hum}%`);
    
    const activeDevices = getActiveDevices();
    const device = activeDevices.find(d => d.mqttTopic === topic);
    
    if (device) {
      const sensorData = new SensorData({
        deviceId: device.id,
        deviceType: device.type,
        location: device.location,
        data: {
          temp: data.temp,
          hum: data.hum,
          msgId: data.msgId
        },
        timestamp: new Date()
      });
      
      await sensorData.save();
      stats.saved++;
      
      console.log(`   💾 Sauvegardé dans MongoDB`);
      console.log(`   Stats: ${stats.saved} saved / ${stats.totalReceived} total`);
      console.log();
      
      // WebSocket
      io.emit('sensor-data', {
        deviceId: device.id,
        data: { temp: data.temp, hum: data.hum },
        timestamp: new Date(),
        source: source
      });
    }
  } catch (error) {
    console.error(`❌ Erreur (${source}):`, error.message);
  }
}

// ════════════════════════════════════════════════════════════
// MQTT LOCAL
// ════════════════════════════════════════════════════════════
let mqttLocalClient = null;

if (USE_LOCAL) {
  const localHost = process.env.MQTT_LOCAL_BROKER || '172.22.241.241';
  const localPort = parseInt(process.env.MQTT_LOCAL_PORT || 1883);
  
  mqttLocalClient = mqtt.connect(`mqtt://${localHost}:${localPort}`);
  
  mqttLocalClient.on('connect', () => {
    console.log(`🏠 ✅ MQTT LOCAL (Raspberry Pi)`);
    console.log(`   ${localHost}:${localPort}`);
    
    getActiveDevices().forEach(device => {
      mqttLocalClient.subscribe(device.mqttTopic, (err) => {
        if (!err) console.log(`   📡 Topic: ${device.mqttTopic}`);
      });
    });
    console.log();
  });
  
  mqttLocalClient.on('message', (topic, message) => {
    handleMQTTMessage(topic, message, 'LOCAL');
  });
}

// ════════════════════════════════════════════════════════════
// MQTT CLOUD
// ════════════════════════════════════════════════════════════
let mqttCloudClient = null;

if (USE_CLOUD && process.env.MQTT_CLOUD_BROKER) {
  const cloudOpts = {
    host: process.env.MQTT_CLOUD_BROKER,
    port: parseInt(process.env.MQTT_CLOUD_PORT || 8883),
    username: process.env.MQTT_CLOUD_USERNAME,
    password: process.env.MQTT_CLOUD_PASSWORD,
    protocol: 'mqtts',
    rejectUnauthorized: false
  };
  
  mqttCloudClient = mqtt.connect(cloudOpts);
  
  mqttCloudClient.on('connect', () => {
    console.log(`☁️  ✅ MQTT CLOUD (HiveMQ)`);
    console.log(`   ${cloudOpts.host}:${cloudOpts.port}`);
    
    getActiveDevices().forEach(device => {
      mqttCloudClient.subscribe(device.mqttTopic, (err) => {
        if (!err) console.log(`   📡 Topic: ${device.mqttTopic}`);
      });
    });
    console.log();
  });
  
  mqttCloudClient.on('message', (topic, message) => {
    handleMQTTMessage(topic, message, 'CLOUD');
  });
}

// ════════════════════════════════════════════════════════════
// ROUTES API
// ════════════════════════════════════════════════════════════

app.get('/api/devices', (req, res) => {
  res.json(getActiveDevices());
});

app.get('/api/stats', (req, res) => {
  res.json({
    totalReceived: stats.totalReceived,
    duplicates: stats.duplicates,
    saved: stats.saved,
    cacheSize: msgCache.size,
    deduplicationRate: stats.totalReceived > 0 
      ? ((stats.duplicates / stats.totalReceived) * 100).toFixed(2) + '%'
      : '0%'
  });
});

app.get('/api/sensor/latest/:deviceId', async (req, res) => {
  try {
    const data = await SensorData.findOne({ deviceId: req.params.deviceId })
      .sort({ timestamp: -1 });
    res.json(data || {});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/sensor/history/:deviceId', async (req, res) => {
  try {
    const hours = parseInt(req.query.hours) || 24;
    const limit = parseInt(req.query.limit) || 100;
    const startDate = new Date(Date.now() - hours * 60 * 60 * 1000);
    
    const data = await SensorData.find({
      deviceId: req.params.deviceId,
      timestamp: { $gte: startDate }
    }).sort({ timestamp: -1 }).limit(limit);
    
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/sensor/stats/:deviceId', async (req, res) => {
  try {
    const hours = parseInt(req.query.hours) || 24;
    const startDate = new Date(Date.now() - hours * 60 * 60 * 1000);
    
    const data = await SensorData.find({
      deviceId: req.params.deviceId,
      timestamp: { $gte: startDate }
    });
    
    if (data.length === 0) return res.json({});
    
    const device = getDeviceById(req.params.deviceId);
    const stats = {};
    
    if (device) {
      device.sensors.forEach(sensor => {
        const values = data.map(d => d.data[sensor.key]).filter(v => v != null);
        if (values.length > 0) {
          stats[sensor.key] = {
            avg: values.reduce((a, b) => a + b, 0) / values.length,
            min: Math.min(...values),
            max: Math.max(...values),
            count: values.length
          };
        }
      });
    }
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Socket.IO
io.on('connection', (socket) => {
  console.log('🔌 Client WebSocket connecté');
  socket.on('disconnect', () => console.log('🔌 Client déconnecté'));
});

// Démarrage
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Serveur : http://localhost:${PORT}`);
  console.log(`📊 Appareils: ${getActiveDevices().length}`);
  console.log();
  console.log('════════════════════════════════════════');
  console.log('  Mode HYBRIDE + DÉDUPLICATION');
  console.log(`  🏠 LOCAL : ${USE_LOCAL ? 'Écoute' : 'Off'}`);
  console.log(`  ☁️  CLOUD : ${USE_CLOUD ? 'Écoute' : 'Off'}`);
  console.log('  🔄 Cache LRU : 1000 msgId (10 min)');
  console.log('════════════════════════════════════════');
  console.log();
});
