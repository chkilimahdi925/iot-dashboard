import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { io, Socket } from 'socket.io-client';

export interface SensorData {
  _id?: string;
  temperature: number;
  humidity: number;
  timestamp: Date;
  deviceId?: string;
}

export interface SensorStats {
  avgTemp: number;
  minTemp: number;
  maxTemp: number;
  avgHum: number;
  minHum: number;
  maxHum: number;
  count: number;
}

@Injectable({
  providedIn: 'root'
})
export class SensorService {
  private apiUrl = 'http://localhost:3000/api/sensor';
  private socket: Socket;
  private sensorDataSubject = new Subject<SensorData>();

  constructor(private http: HttpClient) {
    // Initialiser la connexion WebSocket
    this.socket = io('http://localhost:3000');
    
    this.socket.on('newSensorData', (data: SensorData) => {
      console.log('Nouvelles données reçues via WebSocket:', data);
      this.sensorDataSubject.next(data);
    });

    this.socket.on('connect', () => {
      console.log('✅ Connecté au serveur WebSocket');
    });

    this.socket.on('disconnect', () => {
      console.log('❌ Déconnecté du serveur WebSocket');
    });
  }

  // Observable pour les mises à jour en temps réel
  getSensorDataStream(): Observable<SensorData> {
    return this.sensorDataSubject.asObservable();
  }

  // Obtenir les dernières données
  getLatestData(): Observable<SensorData> {
    return this.http.get<SensorData>(`${this.apiUrl}/latest`);
  }

  // Obtenir l'historique
  getHistory(limit: number = 100, hours: number = 24): Observable<SensorData[]> {
    return this.http.get<SensorData[]>(`${this.apiUrl}/history?limit=${limit}&hours=${hours}`);
  }

  // Obtenir les statistiques
  getStats(hours: number = 24): Observable<SensorStats> {
    return this.http.get<SensorStats>(`${this.apiUrl}/stats?hours=${hours}`);
  }

  // Obtenir les données par plage
  getDataByRange(start?: Date, end?: Date): Observable<SensorData[]> {
    let url = `${this.apiUrl}/range`;
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
    return this.http.delete(`${this.apiUrl}/cleanup?days=${days}`);
  }

  // Déconnecter le WebSocket
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}
