import { Injectable } from '@angular/core';
import { SpinnerComponent } from '../componentes/spinner/spinner.component';
import { PopoverComponent } from '../componentes/popover/popover.component';
import { ModalController, ToastController, AlertController, PopoverController } from '@ionic/angular';
import { ToastOptions, AlertOptions } from '@ionic/core';

import { DomSanitizer } from '@angular/platform-browser';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ControllersIonicService {

  private alertElement!: HTMLIonAlertElement;
  private modalEl: HTMLIonModalElement | undefined;;

  country = '';

  public isLoaderOpen = new BehaviorSubject<boolean>(false);

  constructor(
    private sanitizer: DomSanitizer,
    private modalCtrl: ModalController,
    private toastController: ToastController,
    private alertController: AlertController,
    private popoverController: PopoverController, ) { }

  async showLoader() {
    if (!this.isLoaderOpen.getValue()) {
      const modal = await this.modalCtrl.create({
        component: SpinnerComponent,
        cssClass: 'full-screen-loader',
        backdropDismiss: false
      });
      await modal.present()
        .finally(() => {
          console.warn('LOADER', '***   isLoading.next(true)...');
          this.isLoaderOpen.next(true);
        });
      return
    }
  }

  async hideLoader() {
    try {
      const isModalOpened = await this.modalCtrl.getTop();
      console.warn('LOADER', '***   isModalOpened: '+ isModalOpened +', isLoading: ' + this.isLoaderOpen.getValue());
      if (this.isLoaderOpen.getValue() || isModalOpened) {
        await this.modalCtrl.dismiss()
          .finally(() => {
            console.warn('LOADER', '***   isLoading.next(false)...');
            this.isLoaderOpen.next(false);
          });
        return;
      }
    } catch (error) {
      console.error('LOADER', '***   Error in hideLoader: ' + JSON.stringify(error));
    }
  }

  presentToast(msg: string) {
    this.toastController.dismiss()
      .finally(() => {
        const options: ToastOptions = {};
        options.message = msg;
        options.duration = 6000;
        options.position = 'bottom';
        options.translucent = false;
        options.cssClass = 'customToastClass';
        this.toastController.create(options)
          .then(toastElement => {
            toastElement.present();
          });
      });
  }
  presentAlerts(options: AlertOptions) {
    return this.alertController.create(options);
  }

  async presentAlert(title: string, message: string) {
    const alert = await this.alertController.create({
      header: title,
      message,
      buttons: ['Aceptar']
    });
    await alert.present();
  }

  presentAlertRetry(seccionName: string, message?: string, buttons?: any) {
    const defaultOptions: AlertOptions = {};
    defaultOptions.header = environment.applicationInfo.name; // Nombre de la aplicación
    defaultOptions.subHeader = seccionName; // Nombre de la seccion
    if (message) {
      defaultOptions.message = message;
    } else {
      defaultOptions.message = 'Ocurrió un problema al procesar su solicitud, ¿desea reintentar?';
    }
    defaultOptions.backdropDismiss = false;
    if (buttons) {
      defaultOptions.buttons = buttons;
    } else {
      defaultOptions.buttons = [{
        text: 'NO',
        cssClass: 'secondary',
        handler: () => {
          this.alertElement.dismiss();
          return { opcion: false };
        }
      }, {
        text: 'Sí',
        handler: () => {
          this.alertElement.dismiss();
          return { opcion: true };
        }
      }];
    }
    return this.alertController.create(defaultOptions)
      .then(AlertEl => {
        this.alertElement = AlertEl;
        AlertEl.present();
        return AlertEl.onDidDismiss();
      });
  }

  presentPopoverWithEvent(message: string, evento?: any, customCssClass?: string  ) {
    const definition = this.sanitizer.bypassSecurityTrustHtml(message);
    this.popoverController.dismiss()
      .finally(() => {
        this.popoverController.create({
          component: PopoverComponent,
          cssClass: customCssClass,
          componentProps: { data: definition },
          mode: 'ios',
          event: evento,
          translucent: true,
        }).then(popoverElement => {
          popoverElement.present();
        });
      });
  }

}
