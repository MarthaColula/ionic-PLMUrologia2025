import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { 
  PlmTrackingEngineService,
  ControllersIonicService,
  GeolocationService
} from './indexServices';
import { INSUserInfo, ICurrentPosition, IGVDeviceInfo, ILocalMenuJsonInfo } from '../interfaces/models';

import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GlobalvarsService {

  private readonly _endPointTools = environment.appTools;
  private navigationHamburgerMenuHomeResultBehaviorSubject = new BehaviorSubject<ILocalMenuJsonInfo[]>([]);

  private navigationTriggerDeeplinksBehaviorSubject = new BehaviorSubject<boolean>(false);
  
  public clientInfo = new BehaviorSubject<INSUserInfo>({email:'', codeString:''});
  private trackingSourceId = new BehaviorSubject<number>(2);
  private infoTrackingSourceId = new BehaviorSubject<number>(0);
  private geolocationClient = new BehaviorSubject<ICurrentPosition>({latitude: 0, longitude: 0, altitude: 0, accuracy: 0, altitudeAccuracy: 0, heading: 0, speed: 0, timestamp: 0});
  private clientAddressIp = new BehaviorSubject<any>('');
  deviceInfo = new BehaviorSubject<IGVDeviceInfo>({TargetName: '', TargetId: 0, ResolutionKey: 0});
  private countryKey = new BehaviorSubject<string>('');
  public interactionType: string = '';
  public shareInformation = null;

  constructor(
    private controllersIonicService: ControllersIonicService,
    private trackingEngine: PlmTrackingEngineService,
    private geolocationService: GeolocationService,
    private platform: Platform,
  ) { }

  public getCountryKey() {
    return (this.countryKey.getValue() ? this.countryKey.getValue() : '');
  }

  public setCountryKey(value: string) {
    this.countryKey.next(value);
  }

  public getClientInfoValue() {
    return this.clientInfo.getValue();
  }

  public setClientInfo(data: any) {
    this.clientInfo.next(data);
  }

  public getInfoTrackingSource() {
    return this.infoTrackingSourceId.getValue();
  }

  public setInfoTrackingSource(id: number) {
    this.infoTrackingSourceId.next(id);
  }

  public getTrackingSource() {
    return this.trackingSourceId.getValue();
  }

  public setTrackingSource(id: number) {
    this.trackingSourceId.next(id);
  }

  public getGeolocationClient() {
    return this.geolocationClient.getValue();
  }

  public setGeolocationClient(data: any) {
    this.geolocationClient.next(data);
  }

  public getClientAddressIp() {
    return this.clientAddressIp.getValue();
  }

  public setClientAddressIp(data: any) {
    this.clientAddressIp.next(data);
  }

  public getSavedNavigationHamburgerMenuHomeResult() {
    return this.navigationHamburgerMenuHomeResultBehaviorSubject.getValue();
  }

  public setDeeplinksTriger(value: boolean){
    this.navigationTriggerDeeplinksBehaviorSubject.next(value);
  }
  
  public getDeeplinksTriger(){
    return this.navigationTriggerDeeplinksBehaviorSubject.getValue();
  }
  
  public getDeviceInfo() {
    console.log('GlobalVars - getDeviceInfo Init')
    if (this.deviceInfo.getValue()) {
      console.log('getDeviceinfo - this.deviceInfo', this.deviceInfo.getValue());
      return this.deviceInfo.getValue();
    } else {
      const webTes: IGVDeviceInfo = {
        TargetName: 'Android',
        TargetId: 3,
        ResolutionKey: 240
      };
      console.log('getDeviceinfo - webTes', webTes);
      return webTes;
    }
  }

  initialize(): Promise<any> {
    console.warn('GlobalvarsService', '***  initialize  ***');
    console.warn('GlobalvarsService', '***  controllersIonicService.showLoader()...');
    return this.controllersIonicService.showLoader()
      .finally(() => {
        if (environment.applicationInfo.availableCountries.length === 0) {
          console.warn('GlobalvarsService', '***  this.countryKey.next('+ environment.applicationInfo.countryKey +')...');
          this.countryKey.next(environment.applicationInfo.countryKey);
        }
        console.warn('GlobalvarsService', '***  INIT-trackingEngine.getIpClient()...');
        this.trackingEngine.getIpClient()
          .subscribe({
            next: (result: any) => this.setClientAddressIp(result),
            error: (ex: any) => console.error(JSON.stringify(ex)),
            complete: () => console.log('GlobalvarsService', 'successfullgetIpClient')
          });
          this.controllersIonicService.hideLoader();
          this.loadDeviceInfo()
        console.warn('GlobalvarsService', '***  END-trackingEngine.getIpClient()...');
        return new Promise<void>((resolve) => {
          console.warn('GlobalvarsService', '***  geolocationService.getClientCurrentPosition()...');
          this.geolocationService
            .getClientCurrentPosition()
            .then((result: any) => {
              console.warn('GlobalvarsService - getClientCurrentPosition', '***  result: ', result);
              this.setGeolocationClient(result)
            })
            .catch((ex: any) => {
              console.error('GlobalvarsService', ex)
              this.controllersIonicService.hideLoader();
            })
            .finally(() => {
              this.controllersIonicService.hideLoader();
              console.warn('GlobalvarsService', '***  loadDeviceInfo()...');
                resolve();
            });
        });
      });
  }

  private loadDeviceInfo() {
    console.warn('GlobalvarsService', '***  loadDeviceInfo  ***');
    return this.platform.ready()
      .then(() => {
        console.warn('GlobalvarsService', '***  plt: ' + this.platform);
        if (this.platform.is('capacitor')) {
          if (this.platform.is('android')) {
            this.infoTrackingSourceId.next(2);
            this.deviceInfo.next({
              TargetName: 'Android',
              TargetId: 3,
              ResolutionKey: 240
            });
          } else if (this.platform.is('ios')) {
            this.infoTrackingSourceId.next(3);
            this.deviceInfo.next({
              TargetName: 'iOS_iPhone',
              TargetId: 5,
              ResolutionKey: 160
            });
          }
        } else {
          this.infoTrackingSourceId.next(1);
          this.deviceInfo.next({
            TargetName: 'Android',
            TargetId: 3,
            ResolutionKey: 240
          });
        }
      });
  }

}
