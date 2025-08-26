import { Component, OnInit } from '@angular/core';
import { PushStatus } from './../../../interfaces/catalogs';
import { GlobalvarsService } from './../../../services/globalvars.service';
import { IPushTrackingInfo } from './../../../interfaces/PLMTrackingEngine';
import { PlmTrackingEngineService } from './../../../services/plm-tracking-engine.service';
import { ToastController } from '@ionic/angular';
import { PushNotificationsService } from '../../../services/indexServices';
import { environment } from '../../../../environments/environment';


@Component({
  selector: 'app-notificaciones-push',
  templateUrl: './notificaciones-push.page.html',
  styleUrls: ['./notificaciones-push.page.scss'],
  standalone: false,
})
export class NotificacionesPushPage implements OnInit {

 protected appName: string;
  protected baseUrlIcon = environment.pushNotificationSponsorIcons;

  constructor(
    public toastController: ToastController,
    private trackingEngineService: PlmTrackingEngineService,
    private globalVars: GlobalvarsService,
    protected pushNotificationsService: PushNotificationsService) {
    this.appName = environment.applicationInfo.name;
  }

  ngOnInit() {
    console.warn('HOME', '***  notificationsLog-length: ' + this.pushNotificationsService.notificationsLog.getValue().length);
    if (this.pushNotificationsService.notificationsLog.getValue().length === 0) {
      console.warn('HOME', '***  getPushNotificationByClient()...');
      this.getPushNotificationByClient();
    }
  }
  
  pushClick(item: any) {
    console.warn('init pushClick');
    console.warn(item);
    item.wasTapped = true;
    const option = +item.PushTypeId;
    if (option === 2 || option === 3) {
      this.pushNotificationsService.showNotification(item);
    } else {
      this.presentToastWithOptions(item);
    }
    if (!item.Viewed) {
      this.pushNotificationsService.addPushNotificationViewed(item.PushNotificationId);
    } else {
      console.warn('la notificacions ya se ha visto anteriormente');
    }
  }

  private async getPushNotificationByClient() {
    console.warn('HOME', '***   getPushNotificationByClientRequest()...');
    await this.pushNotificationsService.getPushNotificationByClientRequest()
      .toPromise()
      .then((result) => {
        console.warn('HOME', 'then --> getPushNotificationByClientRequest');
        console.warn('HOME', result);
      })
      .catch((ex) => {
        console.warn('HOME', 'catch --> getPushNotificationByClientRequest');
        console.warn('HOME', ex);
      });
  }

  async presentToastWithOptions(data: any) {
    let toastHeader = 'PLM CTGINECOLOGIA';
    let toastMessage = 'Tienes una nueva notificación';
    let buttonsToPresent: any;
    if (data.PushName) {
      toastHeader = data.PushName;
    }
    if (data.CampaignDescription) {
      toastMessage = data.CampaignDescription;
    }
    const option = +data.PushTypeId;
    this.addPushTracking(data, PushStatus.Leido);
    buttonsToPresent = [
      {
        text: '',
        icon: ''
      },
      {
        text: '',
        icon: 'close-circle-outline',
        role: 'cancel'
      }
    ]
    const toast = await this.toastController.create({
      header: toastHeader,
      message: toastMessage,
      position: 'top',
      buttons: buttonsToPresent,
      mode: 'md'
    });
    toast.present();
  }

  addPushTracking(pushInfo: any, pushStatus: PushStatus) {
    const today = new Date().getTime();
    const data: IPushTrackingInfo = {
      CodeString: this.globalVars.getClientInfoValue().codeString,
      PushDate: '\/Date(' + today.toString() + '+0200)\/',
      PushNotificationId: pushInfo.PushNotificationId,
      PushStatusId: pushStatus,
      PushTrackId: 0,
      UserPushId: 0
    };
    this.trackingEngineService.addPushTracking(data);
  }

}
