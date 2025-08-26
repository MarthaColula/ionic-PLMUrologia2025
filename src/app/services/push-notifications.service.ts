import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Platform, ToastController } from '@ionic/angular';
import { Preferences } from '@capacitor/preferences';
import {
  ActionPerformed,
  PushNotificationSchema,
  PushNotifications,
  Token,
} from '@capacitor/push-notifications';
import { 
  GlobalvarsService, 
  InAppBrowserService, 
  PlmTrackingEngineService, 
} from './indexServices';
import { environment } from '../../environments/environment';
import { PushStatus } from '../interfaces/catalogs';
import { IPushTrackingInfo } from '../interfaces/PLMTrackingEngine';
import { IpushNotifications } from '../interfaces/models';
import { map } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PushNotificationsService {

  hasPermission: boolean;
  skippedNotifications = new BehaviorSubject<Array<any>>([]);
  notificationsLog = new BehaviorSubject<Array<any>>([]);

  fcmInfo: IpushNotifications;

  private apiUrl = '';
  private httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

  constructor(
    private router: Router,
    private platform: Platform,
    private http: HttpClient,
    public toastController: ToastController,
    private iabService: InAppBrowserService,
    private globalVars: GlobalvarsService,
    private trackingEngineService: PlmTrackingEngineService
  ) {
    //const { protocol, server, port, path, endPointName } = environment.restPLMClients;
    //this.apiUrl = `${protocol}://${server}:${port}/${path}/${endPointName}/${endPointName}.svc/`;
    const { protocol, server, path, endPointName } = environment.restPLMClients;
    this.apiUrl = `${protocol}://${server}/${path}/${endPointName}/${endPointName}.svc/`;
  }

  public async addSubscribedUser(token: string, subscription: boolean) {
    console.warn('PushNotifications', 'addSubscribedUser: ' + token);
    // if (!token) return;
    const webMethod = this.apiUrl + `addSubscribedUser?code=${this.globalVars.getClientInfoValue().codeString}`;
    console.warn('PushNotifications', 'webMethod: ' + webMethod);
    const dataInfo = {
      Token: token,
      SubscriptionStatus: subscription
    }
    return this.http
      .post<any>(webMethod, dataInfo, this.httpOptions).toPromise()
      .then(() => {
        console.warn('PushNotifications', 'succesful addSubscribedUser');
        this.saveToken(token, subscription);
      })
      .catch(ex => {
        console.warn('PushNotifications', 'addSubscribedUser Error: ' + JSON.stringify(ex));
      });
  }
  
  private async saveToken(token: string, subscription: boolean) {
    console.warn('PushNotifications', 'Saving token...', token, subscription);
    const data: IpushNotifications = {
      Token: token,
      CodeString: this.globalVars.getClientInfoValue().codeString,
      subscribed: subscription
    };
    console.log('saveToken - data', data);
      try {
        await Preferences.set({
          key: 'fcm',
          value: JSON.stringify(data)
        });
        this.fcmInfo = data;
        console.log('Se guardo correctamente la información en Preference', this.fcmInfo);
      } catch (error) {
        console.error('Error saving user info:', error);
        throw error;
      }
  }

  async loadTokenInfo() {
    console.warn('PushNotifications', '**  loadTokenInfo  **');
    try {
      const result = await Preferences.get({ key: 'fmc' });
      console.warn('PushNotifications', 'Token loaded successfully:', result);
      if (result) {
        console.warn('PushNotifications', 'Token loaded successfully:', result);
        return JSON.stringify(result);
      }
      return null;
    } catch (error) {
      console.error('Error retrieving user info:', error);
      this.fcmInfo = { Token: '' };
      throw error;
    }
  }

  receivedNotification(data: any) {
    //if (data.wasTapped) {
      console.warn('PushNotifications', 'Received in background');
      console.warn(data);
      //const option = + data.PushTypeId;
      const option = parseInt(''+data.PushTypeId);
      switch (option) {
        case 0:
          console.log('PushNotifications', 'NotificationType: 0');
          break;
        case 2:
          console.log('PushNotifications', 'NotificationType: 2');
          let newstr: string = data.Url_page;
          // this.globalVarsService.editionIdPushNotification = data.EditionId;
          let splits: any = [];
          newstr = newstr.replace(/[\/]/g, ' ');
          splits = newstr.split(' ');
          // this.router.navigate(['ippa', product.CategotyId, product.DivisionId, product.PharmaFormId, product.ProductId]);
          console.warn('PushNotifications', {splits: splits});
          //this.router.navigate([splits[0], splits[1], splits[2], splits[3], splits[4], splits[5]]);
          if (splits.length === 6) {
            this.router.navigate([splits[0], splits[1], splits[2], splits[3], splits[4], splits[5]]);
          } else if (splits.length === 5) {
            this.router.navigate([splits[0], splits[1], splits[2], splits[3], splits[4]]);
          }
          // }
          break;
        case 3:
          console.log('PushNotifications', 'NotificationType: 3');
          console.warn('PushNotifications', '***  data.Url_resource: ' + data.Url_resource);
          this.iabService.open(data.Url_resource, '_system');
          //window.open(data.Url_resource, "_system");
          break;
        default:
          console.log('PushNotifications', 'opcion no validad!');
          break;
      }
    /*} else {
      this.addPushTracking(data, PushStatus.Recibido);
      console.warn('PushNotifications', 'Received in foreground');
      console.warn('PushNotifications', data);
      const option = +data.PushTypeId;
      this.presentToastWithOptions(data);
    }*/
  }

  receivedNotificationOnMessage(data: any) {
    this.addPushTracking(data, PushStatus.Recibido);
    console.warn('PushNotifications', 'Received in foreground');
    console.log('PushNotifications', data);
    const option = +data.PushTypeId;
    this.presentToastWithOptions(data);
  }

  receivedNotificationBackground(data: any) {
    console.warn('PushNotifications', 'init receivedNotificationBackground');
    console.log('PushNotifications', data);
    this.addPushTracking(data, PushStatus.Recibido);
    this.addPushTracking(data, PushStatus.Leido);
    this.addPushNotificationViewedRequest(+data.PushNotificationId)
      .toPromise()
      .then(() => {
        this.getPushNotificationByClientRequest()
          .toPromise().finally(() => {
            console.warn('PushNotifications', 'se actualizaron las push notificacion');
          });
      });
    //const option = + data.PushTypeId;
    const option = parseInt(''+data.PushTypeId);
    switch (option) {
      case 0:
        console.log('PushNotifications', 'NotificationType: 0');
        break;
      case 2:
        console.log('PushNotifications', 'NotificationType: 2');
        let newstr: string = data.Url_page;
        // this.globalVarsService.editionIdPushNotification = data.EditionId;
        let splits: any = [];
        newstr = newstr.replace(/[\/]/g, ' ');
        splits = newstr.split(' ');
        // this.router.navigate(['ippa', product.CategotyId, product.DivisionId, product.PharmaFormId, product.ProductId]);
        console.warn('PushNotifications', {splits: splits});
        //this.router.navigate([splits[0], splits[1], splits[2], splits[3], splits[4], splits[5]]);
        if (splits.length === 6) {
          this.router.navigate([splits[0], splits[1], splits[2], splits[3], splits[4], splits[5]]);
        } else if (splits.length === 5) {
          this.router.navigate([splits[0], splits[1], splits[2], splits[3], splits[4]]);
        }
        // }
        break;
      case 3:
        console.log('PushNotifications', 'NotificationType: 3');
        console.warn('PushNotifications', '***  data.Url_resource: ' + data.Url_resource);
        this.iabService.open(data.Url_resource, '_system');
        break;
      default:
        console.log('PushNotifications', 'opción no válida!');
        break;
    }
  }

  showNotification(data: any) {
    this.addPushTracking(data, PushStatus.Leido);
    //const option = + data.PushTypeId;
    const option = parseInt(''+data.PushTypeId);
    switch (option) {
      case 0:
        console.log('PushNotifications', 'NotificationType: 0');
        break;
      case 2:
        console.log('PushNotifications', 'NotificationType: 2');
        let newstr: string = data.Url_page;
        // this.globalVarsService.editionIdPushNotification = data.EditionId;
        let splits: any = [];
        newstr = newstr.replace(/[\/]/g, ' ');
        splits = newstr.split(' ');
        // this.router.navigate(['ippa', product.CategotyId, product.DivisionId, product.PharmaFormId, product.ProductId]);
        console.warn('PushNotifications', {splits: splits});
        //this.router.navigate([splits[0], splits[1], splits[2], splits[3], splits[4], splits[5]]);
        if (splits.length === 6) {
          this.router.navigate([splits[0], splits[1], splits[2], splits[3], splits[4], splits[5]]);
        } else if (splits.length === 5) {
          this.router.navigate([splits[0], splits[1], splits[2], splits[3], splits[4]]);
        }
        // }
        break;
      case 3:
        console.log('PushNotifications', 'NotificationType: 3');
        console.warn('PushNotifications', '***  data.Url_resource: ' + data.Url_resource);
        this.iabService.open(data.Url_resource, '_system');
        break;
      default:
        console.log('PushNotifications', 'opción no valida!');
        break;
    }
  }

  async cancelSubscription() {
    await this.addSubscribedUser('', false);
    //await this.fcmPlugin.deleteInstanceId();
    return;
  }

  getPushNotificationByClientRequest() {
    console.warn('PushNotifications', 'init getPushNotificationByClientRequest');
    console.log('PushNotifications', 'getClientInfoValuecodeString' + this.globalVars.getClientInfoValue().codeString);
    const webMethod = this.apiUrl + `getPushNotificationByClient?code=${this.globalVars.getClientInfoValue().codeString}`;
    console.warn('PushNotifications', '***  webMethod: ' + webMethod);
    return this.http.get<any>(webMethod)
      .pipe(map((response: any) => {
        console.warn('PushNotifications', '***  response: ' + JSON.stringify(response));
        if (response.getPushNotificationByClientResult) {
          this.notificationsLog.next(response.getPushNotificationByClientResult);
          this.skippedNotifications.next([]);
          let skippedPushNotifications: any[] = [];
          let arrayPushNotification: any[] = response.getPushNotificationByClientResult;
          arrayPushNotification.forEach((item: any) => {
            if (!item.Viewed) {
              skippedPushNotifications.push(item);
            }
          });
          if (skippedPushNotifications.length > 0) {
            this.skippedNotifications.next(skippedPushNotifications);
          }
        } else {
          this.notificationsLog.next([]);
          this.skippedNotifications.next([]);
        }
        return this.notificationsLog.getValue();
      }));
  }

  async presentToastWithOptions(data: any) {
    let toastHeader = environment.applicationInfo.name;
    let toastMessage = 'Tienes una nueva notificación';
    let toastIcon = 'open-outline';
    let buttonsToPresent: any;
    if (data.title) {
      toastHeader = data.title;
    }
    if (data.body) {
      toastMessage = data.body;
    }
    if (data.toastIcon) {
      toastIcon = data.toastIcon;
    }
    const option = +data.PushTypeId;
    if (option === 2 || option === 3) {
      buttonsToPresent = [
        {
          text: '',
          side: 'start',
          icon: toastIcon,
          handler: () => {
            this.addPushTracking(data, PushStatus.Leido);
            this.addPushNotificationViewedRequest(+data.PushNotificationId)
              .toPromise()
              .then(() => {
                this.getPushNotificationByClientRequest()
                  .toPromise().finally(() => {
                    console.warn('PushNotifications', 'se actualizaron las push notificacion');
                  });
              });
            //data.wasTapped = true;
            this.receivedNotification(data);
          }
        }, {
          text: '',
          icon: 'close-circle-outline',
          role: 'cancel',
          handler: () => {
            this.getPushNotificationByClientRequest()
              .toPromise().finally(() => {
                console.warn('PushNotifications', 'se actualizaron las push notificacion');
              });
          }
        }
      ]
    } else {
      buttonsToPresent = [
        {
          text: '',
          icon: ''
        },
        {
          text: '',
          icon: 'close-circle-outline',
          role: 'cancel',
          handler: () => {
            this.addPushTracking(data, PushStatus.Leido);
            this.addPushNotificationViewedRequest(+data.PushNotificationId)
              .toPromise()
              .then(() => {
                this.getPushNotificationByClientRequest()
                  .toPromise().finally(() => {
                    console.warn('PushNotifications', 'se actualizaron las push notificacion');
                  });
              });
          }
        }
      ]
    }
    const toast = await this.toastController.create({
      header: toastHeader,
      message: toastMessage,
      position: 'top',
      buttons: buttonsToPresent,
      mode: 'md'
    });
    toast.present();
  }
  
  public validateData(data: any) {
    console.warn('PushNotifications', '**  validateData **');
    let vldtdData: any;
    if (data.PushTypeId) {
      console.warn('PushNotifications', '**  data: ' + JSON.stringify(data));
      vldtdData = data;
    } else {
      if (data.custom_data) {
        console.warn('PushNotifications', '**  custom_data: ' + JSON.stringify(data.custom_data));
        vldtdData = data.custom_data;
      } else if (data.data) {
        var dNotOne = data.data;
        console.warn('PushNotifications', '**  dNotOne: ' + JSON.stringify(dNotOne));
        if (dNotOne.PushTypeId) {
          vldtdData = dNotOne;
        } else if (dNotOne.custom_data) {
          vldtdData = dNotOne.custom_data;
        }
      } else if (data.notification) {
        var notTwo = data.notification;
        console.warn('PushNotifications', '**  notTwo: ' + JSON.stringify(notTwo));
        if (notTwo.data) {
          var dNotTwo = notTwo.data;
          console.warn('PushNotifications', '**  dNotTwo: ' + JSON.stringify(dNotTwo));
          if (dNotTwo.PushTypeId) {
            vldtdData = dNotTwo;
          } else if (dNotTwo.custom_data) {
            vldtdData = dNotTwo.custom_data;
          }
        }
      }
    }
    console.warn('PushNotifications D', '**  vldtdData: ' + JSON.stringify(data));
    return vldtdData;
  }
  
  initPushNotifications() {
    console.warn('PushNotifications', '***  initPushNotifications  ***');
    // Request permission to use push notifications
    // iOS will prompt user and return if they granted permission or not
    // Android will just grant without prompting
    PushNotifications.requestPermissions().then(result => {
      console.warn('PushNotifications', '**  result: ' + JSON.stringify(result));
      if (result.receive === 'granted') {
        // Register with Apple / Google to receive push via APNS/FCM
        console.warn('PushNotifications', '**  PushNotifications.register()...');
        PushNotifications.register();
      } else {
        // Show some error
      }
    });

    // On success, we should be able to receive notifications
    PushNotifications.addListener('registration',
      (token: Token) => {
        console.warn('PushNotifications', '**  token: ' + JSON.stringify(token));
        //alert('Push registration success, token: ' + token.value);
        console.warn('PushNotifications', '*** addSubscribedUser()...');
        this.addSubscribedUser(token.value, true);
      }
    );
    
    // Some issue with our setup and push will not work
    PushNotifications.addListener('registrationError',
      (error: any) => {
        console.error('PushNotifications', '**  error: ' + JSON.stringify(error));
        //alert('Error on registration: ' + JSON.stringify(error));
      }
    );
    
    // Show us the notification payload if the app is open on our device
    PushNotifications.addListener('pushNotificationReceived',
      (notification: PushNotificationSchema) => {
        console.warn('PushNotifications', '**  notification: ' + JSON.stringify(notification));
        //alert('Push received: ' + JSON.stringify(notification));
        console.warn('PushNotifications', '**  receivedNotificationBackground()...');
        this.receivedNotificationOnMessage(this.validateData(notification));
      }
    );
    
    // Method called when tapping on a notification
    PushNotifications.addListener('pushNotificationActionPerformed',
      (notification: ActionPerformed) => {
        console.warn('PushNotifications', '**  notification: ' + JSON.stringify(notification));
        //alert('Push action performed: ' + JSON.stringify(notification));
        console.warn('PushNotifications', '**  receivedNotificationBackground()...');
        this.receivedNotificationBackground(this.validateData(notification));
      }
    );
  }
  /*
  async initSetupFirebase() {
    console.warn('PushNotifications', 'start initSetupFirebase');
    await this.platform.ready();
    //this.hasPermission = await this.fcmPlugin.requestPushPermission();
    console.log('PushNotifications', 'requestPermission()...');
    await this.fcmPlugin.requestPermission({forceShow: false}).then(PermissionStatus => {
      console.warn('PushNotifications', {Status: PermissionStatus});
      this.hasPermission = true;
    });
    console.log('PushNotifications', 'CHECK hasPermission: ' + this.hasPermission);
    console.log('PushNotifications', 'getToken()...');
    const token = await this.fcmPlugin.getToken();
    console.warn('PushNotifications', 'getToken finish');
    console.warn('PushNotifications', 'TOKEN: ' + token);
    if (this.fcmInfo) {
      if (this.fcmInfo.Token !== token) {
        console.warn('PushNotifications', '*** addSubscribedUser()...');
        this.addSubscribedUser(token, true);
      }
      console.warn('PushNotifications', 'TOKEN IGUAL: ' + this.fcmInfo);
    } else {
      this.addSubscribedUser(token, true);
    }
    //this.fcmPlugin.onNotification().subscribe(data => {
    console.log('PushNotifications', 'onMessage.subscribe()...');
    this.fcmPlugin.onMessage().subscribe(data => {
      console.warn('PushNotifications', '*** onMessage --> this.fcmInfo: ' + JSON.stringify(this.fcmInfo));
      if (this.fcmInfo) {
        if (this.fcmInfo.subscribed) {
          console.warn('PushNotifications', '*** receivedNotificationBackground()...');
          this.receivedNotificationOnMessage(data);
        }
      }
    });
    this.fcmPlugin.onBackgroundMessage().subscribe(data => {
      console.warn('PushNotifications', '*** onBackgroundMessage --> this.fcmInfo: ' + JSON.stringify(this.fcmInfo));
      if (this.fcmInfo) {
        if (this.fcmInfo.subscribed) {
          console.warn('PushNotifications', '*** receivedNotificationBackground()...');
          this.receivedNotificationBackground(data);
        }
      }
    });
  }
  */
  addPushNotificationViewed(pushNotificationId: number) {
    this.addPushNotificationViewedRequest(pushNotificationId)
      .toPromise()
      .then(() => {
        console.warn('PushNotifications', 'addPushNotificationViewedRequest.then');
        this.getPushNotificationByClientRequest().toPromise().finally(() => {
          console.warn('PushNotifications', 'actualizando notificaciones');
        });
      })
      .catch(ex => {
        console.warn('PushNotifications', 'addPushNotificationViewedRequest.catch');
        console.warn('PushNotifications', ex);
        const arrayPushNotification = this.skippedNotifications.getValue();
        let skippedPushNotifications: any[] = [];
        arrayPushNotification.forEach((notification: any) => {
          if (pushNotificationId !== notification.PushNotificationId) {
            skippedPushNotifications.push(notification);
          }
        })
        if (skippedPushNotifications.length > 0) {
          this.skippedNotifications.next(skippedPushNotifications);
        }
      });
  }

  private addPushNotificationViewedRequest(pushNotificationId: number) {
    // tslint:disable-next-line:max-line-length
    const webMethod = this.apiUrl + `addPushNotificationViewed?code=${this.globalVars.getClientInfoValue().codeString}&pushNotificationId=${pushNotificationId}`;
    return this.http.get<any>(webMethod)
      .pipe(map(result => {
        return result;
      }));
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