// Test du backend Node.js - API REST

const BASE_URL = 'http://localhost:3000/api/sensor';

console.log('🧪 Tests de l\'API Backend\n');

// Test 1: Obtenir les dernières données
async function testLatestData() {
  console.log('1️⃣  Test GET /api/sensor/latest');
  try {
    const response = await fetch(`${BASE_URL}/latest`);
    const data = await response.json();
    console.log('✅ Succès:', data);
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
  console.log('');
}

// Test 2: Obtenir l'historique
async function testHistory() {
  console.log('2️⃣  Test GET /api/sensor/history');
  try {
    const response = await fetch(`${BASE_URL}/history?limit=10&hours=24`);
    const data = await response.json();
    console.log(`✅ Succès: ${data.length} entrées récupérées`);
    if (data.length > 0) {
      console.log('Première entrée:', data[0]);
    }
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
  console.log('');
}

// Test 3: Obtenir les statistiques
async function testStats() {
  console.log('3️⃣  Test GET /api/sensor/stats');
  try {
    const response = await fetch(`${BASE_URL}/stats?hours=24`);
    const data = await response.json();
    console.log('✅ Succès:', data);
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
  console.log('');
}

// Exécuter tous les tests
async function runAllTests() {
  await testLatestData();
  await testHistory();
  await testStats();
  
  console.log('✅ Tous les tests terminés\n');
}

// Note: Pour exécuter ces tests, il faut Node.js 18+ avec fetch natif
// Ou installer node-fetch: npm install node-fetch

if (typeof window === 'undefined') {
  // Exécution Node.js
  console.log('⚠️  Pour exécuter ces tests dans Node.js, installez node-fetch');
  console.log('npm install node-fetch\n');
  console.log('Ou testez directement dans le navigateur en ouvrant la console (F12)\n');
} else {
  // Exécution dans le navigateur
  runAllTests();
}
