import { Component, OnInit } from '@angular/core';
import { ConnectionService, ControllersIonicService, PushNotificationsService } from '../../../services/indexServices';

@Component({
  selector: 'app-configuracion-notificaciones',
  templateUrl: './configuracion-notificaciones.page.html',
  styleUrls: ['./configuracion-notificaciones.page.scss'],
  standalone: false,
})
export class ConfiguracionNotificacionesPage implements OnInit {

  subscribed: boolean;
  public changed: boolean = false;

  constructor(
    private connectionService: ConnectionService,
    private controllersIonicService: ControllersIonicService,
    private pushNotificationsService: PushNotificationsService
  ) {
    this.subscribed = (this.pushNotificationsService.fcmInfo?.subscribed ? true : false);
  }

  ngOnInit() { }

  protected ionChangeionToggle() {
    console.warn('init ionChangeionToggle');
    console.warn(this.subscribed);
    console.warn(this.pushNotificationsService.fcmInfo.subscribed);
    if (this.subscribed !== this.pushNotificationsService.fcmInfo.subscribed) {
      this.changed = true;
    } else {
      this.changed = false;
    }
  }

  saveStatusNotificacion() {
    console.warn('init saveStatusNotificacion');
    if (this.connectionService.isConnected()) {
      console.warn(this.subscribed);
      console.warn(this.pushNotificationsService.fcmInfo.subscribed);
      this.controllersIonicService.showLoader().finally(() => {
        if (this.subscribed) {
          this.pushNotificationsService.fcmInfo.subscribed = true;
          this.ionChangeionToggle();
          this.controllersIonicService.hideLoader();
          /*
          this.pushNotificationsService.initSetupFirebase()
            .finally(() => {
              this.controllersIonicService.hideLoader();
            });
          */
        } else {
          this.pushNotificationsService.fcmInfo.subscribed = false
          this.ionChangeionToggle();
          this.pushNotificationsService.cancelSubscription()
            .finally(() => {
              this.controllersIonicService.hideLoader();
            });
        }
      });
    } else {
      this.connectionService.displayWarningMsg('Notificaciones Push')
    }
  }

}
