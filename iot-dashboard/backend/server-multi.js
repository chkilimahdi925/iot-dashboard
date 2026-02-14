require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const mqtt = require('mqtt');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const SensorData = require('./models/SensorData');
const { getActiveDevices, getDeviceById, getActiveTopics } = require('./config/devices.config');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:4200",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Connexion MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connecté'))
  .catch(err => console.error('❌ Erreur MongoDB:', err));

// Configuration MQTT Client
const mqttClient = mqtt.connect(`mqtt://${process.env.MQTT_BROKER}:${process.env.MQTT_PORT}`);

mqttClient.on('connect', () => {
  console.log('✅ Connecté au broker MQTT');
  
  // S'abonner à tous les topics des appareils actifs
  const activeTopics = getActiveTopics();
  
  if (activeTopics.length === 0) {
    console.log('⚠️  Aucun appareil actif configuré dans devices.config.js');
  }
  
  activeTopics.forEach(topic => {
    mqttClient.subscribe(topic, (err) => {
      if (err) {
        console.error(`❌ Erreur subscription au topic ${topic}:`, err);
      } else {
        console.log(`📡 Abonné au topic: ${topic}`);
      }
    });
  });
});

// Réception des messages MQTT
mqttClient.on('message', async (topic, message) => {
  try {
    const data = JSON.parse(message.toString());
    console.log(`📥 Données reçues sur ${topic}:`, data);

    // Trouver l'appareil correspondant au topic
    const device = getActiveDevices().find(d => d.mqttTopic === topic);
    
    if (!device) {
      console.error(`⚠️  Aucun appareil configuré pour le topic: ${topic}`);
      return;
    }

    // Sauvegarder dans MongoDB
    const sensorData = new SensorData({
      deviceId: device.id,
      deviceType: device.type,
      location: device.location,
      data: data,
      timestamp: new Date()
    });

    await sensorData.save();
    console.log(`💾 Données sauvegardées pour ${device.name}`);

    // Envoyer via WebSocket aux clients connectés
    io.emit('newSensorData', {
      deviceId: device.id,
      deviceName: device.name,
      deviceType: device.type,
      location: device.location,
      data: data,
      timestamp: sensorData.timestamp
    });

  } catch (error) {
    console.error('❌ Erreur traitement message:', error);
  }
});

mqttClient.on('error', (err) => {
  console.error('❌ Erreur MQTT:', err);
});

// ==================== ROUTES API ====================

// GET - Liste de tous les appareils configurés
app.get('/api/devices', async (req, res) => {
  try {
    const devices = getActiveDevices();
    res.json(devices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Informations d'un appareil spécifique
app.get('/api/devices/:deviceId', async (req, res) => {
  try {
    const device = getDeviceById(req.params.deviceId);
    if (!device) {
      return res.status(404).json({ error: 'Appareil non trouvé' });
    }
    res.json(device);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Dernières données d'un appareil
app.get('/api/sensor/latest/:deviceId', async (req, res) => {
  try {
    const latestData = await SensorData.findOne({ 
      deviceId: req.params.deviceId 
    }).sort({ timestamp: -1 });
    
    res.json(latestData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Dernières données de tous les appareils
app.get('/api/sensor/latest/all', async (req, res) => {
  try {
    const activeDevices = getActiveDevices();
    const allLatestData = [];

    for (const device of activeDevices) {
      const latestData = await SensorData.findOne({ 
        deviceId: device.id 
      }).sort({ timestamp: -1 });
      
      if (latestData) {
        allLatestData.push({
          device: device,
          data: latestData
        });
      }
    }

    res.json(allLatestData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Historique d'un appareil
app.get('/api/sensor/history/:deviceId', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const hours = parseInt(req.query.hours) || 24;
    
    const startDate = new Date();
    startDate.setHours(startDate.getHours() - hours);

    const history = await SensorData.find({
      deviceId: req.params.deviceId,
      timestamp: { $gte: startDate }
    })
    .sort({ timestamp: -1 })
    .limit(limit);

    res.json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Statistiques d'un appareil
app.get('/api/sensor/stats/:deviceId', async (req, res) => {
  try {
    const hours = parseInt(req.query.hours) || 24;
    const startDate = new Date();
    startDate.setHours(startDate.getHours() - hours);

    const device = getDeviceById(req.params.deviceId);
    if (!device) {
      return res.status(404).json({ error: 'Appareil non trouvé' });
    }

    // Récupérer toutes les données de la période
    const data = await SensorData.find({
      deviceId: req.params.deviceId,
      timestamp: { $gte: startDate }
    });

    if (data.length === 0) {
      return res.json({ count: 0 });
    }

    // Calculer les statistiques pour chaque capteur
    const stats = { count: data.length, sensors: {} };

    device.sensors.forEach(sensor => {
      const values = data.map(d => d.data[sensor.key]).filter(v => v !== undefined);
      
      if (values.length > 0) {
        stats.sensors[sensor.key] = {
          label: sensor.label,
          unit: sensor.unit,
          avg: values.reduce((a, b) => a + b, 0) / values.length,
          min: Math.min(...values),
          max: Math.max(...values)
        };
      }
    });

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Données par plage de temps
app.get('/api/sensor/range/:deviceId', async (req, res) => {
  try {
    const { start, end } = req.query;
    
    const query = { deviceId: req.params.deviceId };
    if (start || end) {
      query.timestamp = {};
      if (start) query.timestamp.$gte = new Date(start);
      if (end) query.timestamp.$lte = new Date(end);
    }

    const data = await SensorData.find(query).sort({ timestamp: 1 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE - Supprimer anciennes données
app.delete('/api/sensor/cleanup', async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const result = await SensorData.deleteMany({
      timestamp: { $lt: cutoffDate }
    });

    res.json({ 
      message: `Données supprimées`,
      deletedCount: result.deletedCount 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// WebSocket connection
io.on('connection', (socket) => {
  console.log('🔌 Client WebSocket connecté');
  
  socket.on('disconnect', () => {
    console.log('🔌 Client WebSocket déconnecté');
  });
});

// Démarrage du serveur
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
  console.log(`📊 Appareils actifs: ${getActiveDevices().length}`);
  getActiveDevices().forEach(device => {
    console.log(`   - ${device.icon} ${device.name} (${device.id})`);
  });
});
