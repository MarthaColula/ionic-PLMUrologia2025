import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
//import { Share } from '@capacitor/share';
import { Share } from '@capacitor/share';
import { ControllersIonicService } from '../services/controllers-ionic.service';
import { IShareWithOptions } from '../interfaces/models';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocialService {

  private android = new BehaviorSubject<boolean>(false);
  private iOS = new BehaviorSubject<boolean>(false);
  private availableApps: string[] = [];

  constructor(
    private platform: Platform,
    private controllersIonicService: ControllersIonicService) {
    if (this.android.getValue() === null && this.iOS.getValue() === null) {
      this.platform.ready()
        .then(() => {
          if (this.platform.is('android')) {
            this.android.next(true);
            this.iOS.next(false);
          }
          if (this.platform.is('ios')) {
            this.android.next(false);
            this.iOS.next(true);
          }
        });
    }
  }

  async share(message: string, subject?: string, url?: string, files?: string[]) {
    const options = this.createOptionsToShare(message, subject, files, url);
    try {
      await Share.share({
        title: options.subject,
        text: options.message,
        url: options.url,
        dialogTitle: options.chooserTitle
      });
    } catch (error) {
      this.controllersIonicService.presentToast('Hubo un problema, intente más tarde.');
      console.error('Error al compartir', error);
    }
  }

  private createOptionsToShare(message: string, subject?: string, files?: string[], url?: string) {
    const options: IShareWithOptions = {};
    if (message !== '') {
      options.message = message;
    }
    if (subject) {
      options.subject = subject;
      options.chooserTitle = subject;
    }
    if (url) {
      options.url = url;
    }
    if (files) {
      options.files = files;
    }
    return options;
  }

  async shareCongress(message: string, subject?: string, url?: string, files?: string[]) {
    const options = this.createOptionsToShare(message, subject, files, url);
    const tmpFiles = (options.files && options.files instanceof Array ? options.files : []);
    try {
      await Share.share({
        title: options.subject,
        text: options.message,
        url: options.url,
        files: tmpFiles,
        dialogTitle: options.chooserTitle
      });
    } catch (error) {
      this.controllersIonicService.presentToast('Hubo un problema, intente más tarde.');
      console.error('Error al compartir', error);
    }
  }
}