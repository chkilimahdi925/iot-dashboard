require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const mqtt = require('mqtt');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const SensorData = require('./models/SensorData');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:4200", // Angular dev server
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
  mqttClient.subscribe(process.env.MQTT_TOPIC, (err) => {
    if (err) {
      console.error('❌ Erreur subscription MQTT:', err);
    } else {
      console.log(`📡 Abonné au topic: ${process.env.MQTT_TOPIC}`);
    }
  });
});

// Réception des messages MQTT
mqttClient.on('message', async (topic, message) => {
  try {
    const data = JSON.parse(message.toString());
    console.log('📥 Données reçues:', data);

    // Sauvegarder dans MongoDB
    const sensorData = new SensorData({
      temperature: data.temp,
      humidity: data.hum,
      timestamp: new Date()
    });

    await sensorData.save();
    console.log('💾 Données sauvegardées dans MongoDB');

    // Envoyer via WebSocket aux clients connectés
    io.emit('newSensorData', {
      temperature: data.temp,
      humidity: data.hum,
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

// GET - Obtenir les dernières données
app.get('/api/sensor/latest', async (req, res) => {
  try {
    const latestData = await SensorData.findOne().sort({ timestamp: -1 });
    res.json(latestData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Obtenir l'historique des données
app.get('/api/sensor/history', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const hours = parseInt(req.query.hours) || 24;
    
    const startDate = new Date();
    startDate.setHours(startDate.getHours() - hours);

    const history = await SensorData.find({
      timestamp: { $gte: startDate }
    })
    .sort({ timestamp: -1 })
    .limit(limit);

    res.json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Statistiques
app.get('/api/sensor/stats', async (req, res) => {
  try {
    const hours = parseInt(req.query.hours) || 24;
    const startDate = new Date();
    startDate.setHours(startDate.getHours() - hours);

    const stats = await SensorData.aggregate([
      { $match: { timestamp: { $gte: startDate } } },
      {
        $group: {
          _id: null,
          avgTemp: { $avg: '$temperature' },
          minTemp: { $min: '$temperature' },
          maxTemp: { $max: '$temperature' },
          avgHum: { $avg: '$humidity' },
          minHum: { $min: '$humidity' },
          maxHum: { $max: '$humidity' },
          count: { $sum: 1 }
        }
      }
    ]);

    res.json(stats[0] || {});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Données par plage de temps
app.get('/api/sensor/range', async (req, res) => {
  try {
    const { start, end } = req.query;
    
    const query = {};
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

// DELETE - Supprimer anciennes données (optionnel)
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
});
