import { Injectable } from '@angular/core';
import { ICurrentPosition } from '../interfaces/models';
import { Geolocation } from '@capacitor/geolocation';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class GeolocationService {
  currentPosition: ICurrentPosition = {
    latitude: 0,
    longitude: 0,
    altitude: 0,
    accuracy: 0,
    altitudeAccuracy: 0,
    heading: 0,
    speed: 0,
    timestamp: 0,
  };

  constructor(private platform: Platform) {
    console.warn('GeolocationService', 'Iniciando GeolocationService');
  }

  async getClientCurrentPosition() {
    try {
      console.warn('GeolocationService', this.platform);
      if (this.platform.is('capacitor')) {
        const position = await this.getCurrentPosition();
        this.currentPosition.latitude = position.coords.latitude;
        this.currentPosition.longitude = position.coords.longitude;
        this.currentPosition.altitude = position.coords.altitude;
        this.currentPosition.accuracy = position.coords.accuracy;
        this.currentPosition.altitudeAccuracy = position.coords.altitudeAccuracy;
        this.currentPosition.heading = position.coords.heading;
        this.currentPosition.speed = position.coords.speed;
        this.currentPosition.timestamp = position.timestamp;
        console.log('getClientCurrentPosition', position);
        return this.currentPosition;
      } else {
        throw new Error('Capacitor is not available');
      }
    } catch (ex: any) {
      console.error('GeolocationService', ex.message);
      throw ex;
    }
  }

  private async getCurrentPosition() {
    const geolocationOptions = {
      maximumAge: 300,
      timeout: 3000,
      enableHighAccuracy: false,
    };
    console.log('getCurrentPosition', geolocationOptions);
    return Geolocation.getCurrentPosition(geolocationOptions);
  }

  clearClientCurrentPosition() {
    this.currentPosition = {
      latitude: 0,
      longitude: 0,
      altitude: 0,
      accuracy: 0,
      altitudeAccuracy: 0,
      heading: 0,
      speed: 0,
      timestamp: 0,
    };
  }
}