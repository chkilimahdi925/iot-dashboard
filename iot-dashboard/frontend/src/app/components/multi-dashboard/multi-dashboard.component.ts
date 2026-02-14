import { Component, OnInit, OnDestroy } from '@angular/core';
import { SensorService, Device, SensorData, SensorStats, RealtimeData } from '../../services/sensor-multi.service';
import { Subscription } from 'rxjs';

interface DeviceWithData {
  device: Device;
  latestData: SensorData | null;
  stats: SensorStats | null;
  history: SensorData[];
}

@Component({
  selector: 'app-multi-dashboard',
  templateUrl: './multi-dashboard.component.html',
  styleUrls: ['./multi-dashboard.component.css']
})
export class MultiDashboardComponent implements OnInit, OnDestroy {
  devices: Device[] = [];
  devicesWithData: DeviceWithData[] = [];
  selectedDevice: Device | null = null;
  
  isLoading = true;
  error: string | null = null;
  
  private realtimeSubscription?: Subscription;

  // Options pour l'historique
  selectedHours = 24;
  hoursOptions = [1, 6, 12, 24, 48, 72];

  constructor(private sensorService: SensorService) {}

  ngOnInit(): void {
    this.loadDevices();
    this.subscribeToRealtime();
  }

  ngOnDestroy(): void {
    if (this.realtimeSubscription) {
      this.realtimeSubscription.unsubscribe();
    }
    this.sensorService.disconnect();
  }

  loadDevices(): void {
    this.isLoading = true;
    this.error = null;

    this.sensorService.getDevices().subscribe({
      next: (devices) => {
        this.devices = devices;
        this.loadAllDevicesData();
      },
      error: (err) => {
        console.error('Erreur lors du chargement des appareils:', err);
        this.error = 'Impossible de charger les appareils';
        this.isLoading = false;
      }
    });
  }

  loadAllDevicesData(): void {
    this.devicesWithData = [];
    
    this.devices.forEach(device => {
      const deviceData: DeviceWithData = {
        device: device,
        latestData: null,
        stats: null,
        history: []
      };

      // Charger les dernières données
      this.sensorService.getLatestData(device.id).subscribe({
        next: (data) => {
          deviceData.latestData = data;
        },
        error: (err) => {
          console.error(`Erreur données ${device.id}:`, err);
        }
      });

      // Charger les statistiques
      this.sensorService.getStats(device.id, this.selectedHours).subscribe({
        next: (stats) => {
          deviceData.stats = stats;
        },
        error: (err) => {
          console.error(`Erreur stats ${device.id}:`, err);
        }
      });

      // Charger l'historique
      this.sensorService.getHistory(device.id, 50, this.selectedHours).subscribe({
        next: (history) => {
          deviceData.history = history.reverse();
        },
        error: (err) => {
          console.error(`Erreur historique ${device.id}:`, err);
        }
      });

      this.devicesWithData.push(deviceData);
    });

    this.isLoading = false;
  }

  subscribeToRealtime(): void {
    this.realtimeSubscription = this.sensorService.getRealtimeDataStream().subscribe({
      next: (data: RealtimeData) => {
        console.log('Mise à jour temps réel:', data);
        
        // Trouver l'appareil et mettre à jour ses données
        const deviceData = this.devicesWithData.find(d => d.device.id === data.deviceId);
        if (deviceData) {
          // Mettre à jour les dernières données
          deviceData.latestData = {
            _id: undefined,
            deviceId: data.deviceId,
            deviceType: data.deviceType,
            location: data.location,
            data: data.data,
            timestamp: data.timestamp
          };

          // Ajouter à l'historique
          deviceData.history.push(deviceData.latestData);
          
          // Limiter la taille de l'historique
          if (deviceData.history.length > 50) {
            deviceData.history.shift();
          }

          // Recharger les stats
          this.loadStatsForDevice(data.deviceId);
        }
      },
      error: (err) => {
        console.error('Erreur WebSocket:', err);
      }
    });
  }

  loadStatsForDevice(deviceId: string): void {
    const deviceData = this.devicesWithData.find(d => d.device.id === deviceId);
    if (deviceData) {
      this.sensorService.getStats(deviceId, this.selectedHours).subscribe({
        next: (stats) => {
          deviceData.stats = stats;
        }
      });
    }
  }

  onHoursChange(): void {
    this.loadAllDevicesData();
  }

  refresh(): void {
    this.loadAllDevicesData();
  }

  selectDevice(device: Device): void {
    this.selectedDevice = this.selectedDevice?.id === device.id ? null : device;
  }

  getValue(data: any, sensorKey: string): number {
    return data && data[sensorKey] !== undefined ? data[sensorKey] : 0;
  }

  getValueColor(value: number, sensor: any): string {
    if (!sensor.thresholds) return '#888';
    
    if (sensor.thresholds.critical_min !== undefined && value < sensor.thresholds.critical_min) {
      return '#e74c3c'; // Rouge critique
    }
    if (sensor.thresholds.critical_max !== undefined && value > sensor.thresholds.critical_max) {
      return '#e74c3c'; // Rouge critique
    }
    if (value < sensor.thresholds.min) {
      return '#f39c12'; // Orange
    }
    if (value > sensor.thresholds.max) {
      return '#f39c12'; // Orange
    }
    return '#2ecc71'; // Vert (normal)
  }

  formatDate(date: Date | string): string {
    const d = new Date(date);
    return d.toLocaleString('fr-FR');
  }

  formatValue(value: number, decimals: number = 1): string {
    return value.toFixed(decimals);
  }

  objectKeys(obj: any): string[] {
    return Object.keys(obj || {});
  }
}
