import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { io, Socket } from 'socket.io-client';

export interface Device {
  id: string;
  name: string;
  type: string;
  location: string;
  mqttTopic: string;
  icon: string;
  enabled: boolean;
  sensors: Sensor[];
}

export interface Sensor {
  key: string;
  label: string;
  unit: string;
  type: string;
  icon: string;
  thresholds: {
    min: number;
    max: number;
    critical_min?: number;
    critical_max?: number;
  };
}

export interface SensorData {
  _id?: string;
  deviceId: string;
  deviceType: string;
  location: string;
  data: any; // Données flexibles selon le type de capteur
  timestamp: Date;
}

export interface SensorStats {
  count: number;
  sensors: {
    [key: string]: {
      label: string;
      unit: string;
      avg: number;
      min: number;
      max: number;
    };
  };
}

export interface RealtimeData {
  deviceId: string;
  deviceName: string;
  deviceType: string;
  location: string;
  data: any;
  timestamp: Date;
}

@Injectable({
  providedIn: 'root'
})
export class SensorService {
  private apiUrl = 'http://localhost:3000/api';
  private socket: Socket;
  private realtimeDataSubject = new Subject<RealtimeData>();

  constructor(private http: HttpClient) {
    // Initialiser la connexion WebSocket
    this.socket = io('http://localhost:3000');
    
    this.socket.on('newSensorData', (data: RealtimeData) => {
      console.log('Nouvelles données reçues via WebSocket:', data);
      this.realtimeDataSubject.next(data);
    });

    this.socket.on('connect', () => {
      console.log('✅ Connecté au serveur WebSocket');
    });

    this.socket.on('disconnect', () => {
      console.log('❌ Déconnecté du serveur WebSocket');
    });
  }

  // Observable pour les mises à jour en temps réel
  getRealtimeDataStream(): Observable<RealtimeData> {
    return this.realtimeDataSubject.asObservable();
  }

  // ==================== APPAREILS ====================

  // Obtenir la liste de tous les appareils
  getDevices(): Observable<Device[]> {
    return this.http.get<Device[]>(`${this.apiUrl}/devices`);
  }

  // Obtenir un appareil par ID
  getDevice(deviceId: string): Observable<Device> {
    return this.http.get<Device>(`${this.apiUrl}/devices/${deviceId}`);
  }

  // ==================== DONNÉES ====================

  // Obtenir les dernières données d'un appareil
  getLatestData(deviceId: string): Observable<SensorData> {
    return this.http.get<SensorData>(`${this.apiUrl}/sensor/latest/${deviceId}`);
  }

  // Obtenir les dernières données de tous les appareils
  getAllLatestData(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/sensor/latest/all`);
  }

  // Obtenir l'historique d'un appareil
  getHistory(deviceId: string, limit: number = 100, hours: number = 24): Observable<SensorData[]> {
    return this.http.get<SensorData[]>(
      `${this.apiUrl}/sensor/history/${deviceId}?limit=${limit}&hours=${hours}`
    );
  }

  // Obtenir les statistiques d'un appareil
  getStats(deviceId: string, hours: number = 24): Observable<SensorStats> {
    return this.http.get<SensorStats>(
      `${this.apiUrl}/sensor/stats/${deviceId}?hours=${hours}`
    );
  }

  // Obtenir les données par plage
  getDataByRange(deviceId: string, start?: Date, end?: Date): Observable<SensorData[]> {
    let url = `${this.apiUrl}/sensor/range/${deviceId}`;
    const params: string[] = [];
    
    if (start) params.push(`start=${start.toISOString()}`);
    if (end) params.push(`end=${end.toISOString()}`);
    
    if (params.length > 0) {
      url += '?' + params.join('&');
    }
    
    return this.http.get<SensorData[]>(url);
  }

  // Nettoyer les anciennes données
  cleanupOldData(days: number = 30): Observable<any> {
    return this.http.delete(`${this.apiUrl}/sensor/cleanup?days=${days}`);
  }

  // Déconnecter le WebSocket
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}
