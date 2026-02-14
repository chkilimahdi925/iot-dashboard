import { Component, OnInit, OnDestroy } from '@angular/core';
import { SensorService, SensorData, SensorStats } from '../services/sensor.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  currentData: SensorData | null = null;
  historyData: SensorData[] = [];
  stats: SensorStats | null = null;
  
  isLoading = true;
  error: string | null = null;
  
  private dataSubscription?: Subscription;

  // Options pour l'historique
  selectedHours = 24;
  hoursOptions = [1, 6, 12, 24, 48, 72];

  constructor(private sensorService: SensorService) {}

  ngOnInit(): void {
    this.loadData();
    this.subscribeToRealTimeUpdates();
  }

  ngOnDestroy(): void {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
    this.sensorService.disconnect();
  }

  loadData(): void {
    this.isLoading = true;
    this.error = null;

    // Charger les dernières données
    this.sensorService.getLatestData().subscribe({
      next: (data) => {
        this.currentData = data;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des données:', err);
        this.error = 'Impossible de charger les données actuelles';
      }
    });

    // Charger l'historique
    this.sensorService.getHistory(50, this.selectedHours).subscribe({
      next: (data) => {
        this.historyData = data.reverse(); // Inverser pour avoir l'ordre chronologique
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement de l\'historique:', err);
        this.error = 'Impossible de charger l\'historique';
        this.isLoading = false;
      }
    });

    // Charger les statistiques
    this.sensorService.getStats(this.selectedHours).subscribe({
      next: (data) => {
        this.stats = data;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des stats:', err);
      }
    });
  }

  subscribeToRealTimeUpdates(): void {
    this.dataSubscription = this.sensorService.getSensorDataStream().subscribe({
      next: (data) => {
        console.log('Mise à jour temps réel:', data);
        this.currentData = data;
        
        // Ajouter à l'historique
        this.historyData.push(data);
        
        // Limiter la taille de l'historique affiché
        if (this.historyData.length > 50) {
          this.historyData.shift();
        }

        // Recharger les stats
        this.loadStats();
      },
      error: (err) => {
        console.error('Erreur WebSocket:', err);
      }
    });
  }

  loadStats(): void {
    this.sensorService.getStats(this.selectedHours).subscribe({
      next: (data) => {
        this.stats = data;
      }
    });
  }

  onHoursChange(): void {
    this.loadData();
  }

  refresh(): void {
    this.loadData();
  }

  getTemperatureColor(): string {
    if (!this.currentData) return '#888';
    const temp = this.currentData.temperature;
    
    if (temp < 18) return '#3498db'; // Bleu (froid)
    if (temp < 24) return '#2ecc71'; // Vert (confortable)
    if (temp < 28) return '#f39c12'; // Orange (chaud)
    return '#e74c3c'; // Rouge (très chaud)
  }

  getHumidityColor(): string {
    if (!this.currentData) return '#888';
    const hum = this.currentData.humidity;
    
    if (hum < 30) return '#e74c3c'; // Rouge (trop sec)
    if (hum < 60) return '#2ecc71'; // Vert (confortable)
    if (hum < 80) return '#f39c12'; // Orange (humide)
    return '#3498db'; // Bleu (très humide)
  }

  formatDate(date: Date | string): string {
    const d = new Date(date);
    return d.toLocaleString('fr-FR');
  }

  getTemperatureColorForValue(temp: number): string {
    if (temp < 18) return '#3498db'; // Bleu (froid)
    if (temp < 24) return '#2ecc71'; // Vert (confortable)
    if (temp < 28) return '#f39c12'; // Orange (chaud)
    return '#e74c3c'; // Rouge (très chaud)
  }

  getHumidityColorForValue(hum: number): string {
    if (hum < 30) return '#e74c3c'; // Rouge (trop sec)
    if (hum < 60) return '#2ecc71'; // Vert (confortable)
    if (hum < 80) return '#f39c12'; // Orange (humide)
    return '#3498db'; // Bleu (très humide)
  }
}
