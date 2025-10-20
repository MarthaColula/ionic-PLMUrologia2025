import { Component, OnInit, AfterViewInit, ViewChild, Input, OnDestroy, Renderer2, ElementRef, EventEmitter, Output } from '@angular/core';
import {
  PlmClientsEngineService, PlmTrackingEngineService,
  GlobalvarsService,
  InAppBrowserService
} from '../../services/indexServices';
import { IInfoTracking, InfoEntities, SearchType, INSUserInfo, ICurrentPosition } from '../../interfaces/models';
import { IonicSlides, Platform } from '@ionic/angular';
import { Observable, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';

import { register } from 'swiper/element/bundle';
register();

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss'],
   standalone: false,
})
export class BannerComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() PLMId: string;

  @Output() showBannerEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() hideshowBannerEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();

  @ViewChild('bannerElementRef', { static: false }) bannerElementRef: ElementRef;
  @Output() close: EventEmitter<any> = new EventEmitter<any>();
  private bannerListener: EventListener;

  bannerResult: Observable<any[]>;
  private bannersValues: any[];
  private intervalNextSlide: any;
  private subBannerBySeccionRequest: Subscription;
  private subDeviceInfo: Subscription;
  private subIpClientRequest: Subscription;
  private clientPosition: ICurrentPosition;
  private clientAddress: any;
  private deviceInfo: any;
  private clientData: INSUserInfo = {
    email: '',
    codeString: ''
  };

  prefix: string;
  swiperModules = [IonicSlides];
  images: any[] = [];

  constructor(public clientEngineService: PlmClientsEngineService,
    public trackingEngine: PlmTrackingEngineService,
    public plt: Platform,
    public globalVars: GlobalvarsService,
    public renderer: Renderer2,
    public iabService: InAppBrowserService) {
    window.addEventListener('orientationchange', this.bannerListener);
  }

  ngOnInit() { }

  ngAfterViewInit(): void {
    console.log('PLMI', this.PLMId);
    if (this.PLMId) {
      if (this.globalVars.deviceInfo.getValue()) {
        this.getBanner();
      } else {
        this.subDeviceInfo =
          this.globalVars.deviceInfo.subscribe({
            next: value => {
              if (value) { this.getBanner(); }
            }
          });
      }
    } else {
      this.closeBanner();
      console.warn('PLMId Empty');
    }
  }

  getBanner() {
    environment.applicationInfo.availableCountries.forEach(info => { // add
      if (this.globalVars.getCountryKey() === info.countryKey) {
        this.prefix = info.prefix;
      }
    });

    if (this.subDeviceInfo) {
      this.subDeviceInfo.unsubscribe();
    }
    this.deviceInfo = this.globalVars.getDeviceInfo();
    this.subBannerBySeccionRequest =
      this.clientEngineService
        .getBannerBySeccionRequest(environment.applicationInfo.prefix,
          this.deviceInfo.TargetName,
          this.globalVars.getCountryKey(),
          this.PLMId,
          this.deviceInfo.ResolutionKey)
        .subscribe({
          next: result => this.bannerResult = result,
          error: ex => {
            console.error(ex);
            this.closeBanner();
          },
          complete: () => {
            console.log('Successfull getBannerBySeccionRequest');
            if (this.clientEngineService.getBannerBySeccion().getValue().length > 0) {
              this.bannersValues = this.clientEngineService.getBannerBySeccion().getValue();
              this.images = this.bannersValues;
              console.log('IMAGES', this.images);


              // this.showBannerEmitter.emit(true);



              this.trackingPrint(0);
              this.checkGlobalVars();
            } else {
              this.closeBanner();
            }
          }
        });
  }

  ngOnDestroy(): void {
    if (this.subBannerBySeccionRequest) {
      this.subBannerBySeccionRequest.unsubscribe();
    }

    if (this.subDeviceInfo) {
      this.subDeviceInfo.unsubscribe();
    }

    if (this.subIpClientRequest) {
      this.subIpClientRequest.unsubscribe();
    }

    if (this.intervalNextSlide) {
      clearInterval(this.intervalNextSlide);
    }

    if (this.bannerListener) {
      window.removeEventListener('orientationchange', this.bannerListener);
    }

  }

  checkGlobalVars() {
    if (this.plt.is('cordova')) {
      this.clientData = this.globalVars.getClientInfoValue();
      this.clientPosition = this.globalVars.getGeolocationClient();
    }
    if (this.globalVars.getClientAddressIp()) {
      this.clientAddress = this.globalVars.getClientAddressIp();
      //this.prepareBannerCarrusel();
    } else {
      this.subIpClientRequest =
        this.trackingEngine.getIpClient().subscribe({
          next: result => this.clientAddress = result,
          error: ex => console.error(ex),
          complete: () => {
            console.log('Successfull getIpClient');
            //this.prepareBannerCarrusel();
          }
        });
    }
  }

  onSlideChange(event: any) {
    const activeIndex = event?.detail?.[0]?.activeIndex
    console.log('activeIndex', activeIndex);

    if (this.images.length > 0) {
      let currentImage = this.images[activeIndex];
      this.trackingPrint(activeIndex);
      console.log('Imagen actual:', currentImage);
    } else {
      console.log('No hay imágenes disponibles');
    }
  }

  trackingPrint(index: number) {
    console.log('TRACKING PRINT', index);
    const data = this.DataPreparation('Print', this.images[index].ElectronicId);
    this.trackingEngine.addInfoTracking(data);
  }

  trackingClick(banner: any) {
    console.log('TRACKING CLICK', banner);
    console.log('BANNER LINK', banner.Link);
    if (banner.Link) {
      const data = this.DataPreparation('Click', banner.ElectronicId);
      console.log({bannerLink:banner.Link});
      this.iabService.open(banner.Link);
      this.trackingEngine.addInfoTracking(data);
    }
  }

  private DataPreparation(type: 'Print' | 'Click', electronicId: number,) {
    const today = new Date().getTime();

    let ip = '';
    let latitude = '';
    let longitude = '';

    if (this.clientPosition) {
      latitude = this.clientPosition.latitude.toString();
      longitude = this.clientPosition.longitude.toString();
    }

    if (this.clientAddress) {
      ip = this.clientAddress.ip.toString();
    }


    const data: IInfoTracking = {
      BranchId: null,
      CodeString: this.globalVars.getClientInfoValue().codeString,
      Date: '\/Date(' + today.toString() + '+0200)\/',
      ElectronicId: electronicId,
      EntityId: InfoEntities.Banners,
      EventId: null,
      Label: 'Banner ' + this.PLMId,
      LabelValue: 'Banner_' + type,
      SearchAddressIP: ip,
      SearchLatitude: latitude,
      SearchLongitude: longitude,
      SearchText: '',
      SearchTypeId: SearchType.parametrizado,
      SourceId: this.globalVars.getInfoTrackingSource()
    };
    console.log('data', data);
    return data;
  }

  closeBanner() {
    console.log('Cerrando banner');
    this.renderer.addClass(this.bannerElementRef.nativeElement, 'ion-hide');
    this.close.emit(true);
    
    this.showBannerEmitter.emit(false);
    this.ngOnDestroy();
  }



}
