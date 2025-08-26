import { Injectable } from '@angular/core';
import { Observable, merge, fromEvent } from 'rxjs';
import { mapTo } from 'rxjs/operators';
import { Platform } from '@ionic/angular';
import { Network } from '@capacitor/network';
import { ControllersIonicService } from './controllers-ionic.service';

@Injectable({
  providedIn: 'root'
})
export class ConnectionService {
  
  private online$: Observable<boolean>;

  constructor(
    private platform: Platform,
    private controllersIonicService: ControllersIonicService) {
    this.online$ = new Observable(observer => {
      observer.next(true);
    }).pipe(mapTo(true));

    this.initNetworkStatus();
  }

  private async initNetworkStatus() {
    await this.platform.ready();
    if (this.platform.is('capacitor')) {
      const status = await Network.getStatus();
      this.online$ = new Observable(observer => {
        observer.next(status.connected);
      }).pipe(mapTo(status.connected));

      Network.addListener('networkStatusChange', (status) => {
        this.online$ = new Observable(observer => {
          observer.next(status.connected);
        }).pipe(mapTo(status.connected));
      });
    } else {
      this.online$ = merge(
        fromEvent(window, 'online').pipe(mapTo(true)),
        fromEvent(window, 'offline').pipe(mapTo(false))
      );
    }
  }

  getNetworkStatus(): Observable<boolean> {
    return this.online$;
  }

  async isConnected(): Promise<boolean> {
    const status = await Network.getStatus();
    return status.connected;
  }

  private async getNetworkType(): Promise<string> {
    if (this.platform.is('capacitor')) {
      const status = await Network.getStatus();
      return status.connectionType.toUpperCase();
    } else {
      if (navigator.onLine) {
        return 'UNKNOWN';
      }
      return 'NONE';
    }
  }

  displayWarningMsg(sectionName: string, msg?: string) {
    if (!msg) {
      msg = 'Esta sección requiere conexión a internet. Verifíquela e inténtelo nuevamente.';
    }
    this.controllersIonicService.presentAlert(sectionName, msg);
  }
}