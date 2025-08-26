import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import {
  InAppBrowserService, 
  GlobalvarsService, 
  ControllersIonicService,
  PlmClientsEngineService, 
  PlmTrackingEngineService,
  //FirebaseAnalyticsService,
} from '../../../services/indexServices';
import { ElectronicInfo } from "src/app/interfaces/editorialContent";
import { InfoEntities, SearchType, IInfoTracking, InformationType } from 
'../../../interfaces/models';
import { BehaviorSubject, Subscription } from 'rxjs';

@Component({
  selector: 'app-cci',
  templateUrl: './cci.page.html',
  styleUrls: ['./cci.page.scss'],
  standalone: false,
})
export class CciPage implements OnInit, OnDestroy {

  successRequest = new BehaviorSubject<boolean>(false);
  exception = new BehaviorSubject<boolean>(false);
  infoDataInput: ElectronicInfo | undefined;
  getInformationSub: Subscription | undefined;
  showBanner: boolean | undefined;
  closeBanner : boolean;

  constructor(
    private router: Router,
    private trackingEngineService: PlmTrackingEngineService,
    public clientEngineService: PlmClientsEngineService,
    private globalVars: GlobalvarsService,
    private controllersIonicService: ControllersIonicService,
    //private fa: FirebaseAnalyticsService,
  ) {}

  ngOnInit() {
    this.addTrackingSectionAndEvent();
    if (this.clientEngineService.getInteractiveClinicalCase().length === 0) {
      this.getInformationByPrefixByType();
    } else {
      this.successRequest.next(true);
    }
  }

  ionViewDidLeave() {
    this.showBanner = false;
  }

  ionViewWillEnter() {
    this.showBanner = true;
  }

  ngOnDestroy() {
    if (this.getInformationSub) {
      this.getInformationSub.unsubscribe();
    }
  }

  getInformationByPrefixByType() {
    if (this.getInformationSub) {
      this.getInformationSub.unsubscribe();
    }
    this.controllersIonicService.showLoader().finally(() => {
      this.getInformationSub =
      this.clientEngineService.getInformationByPrefixByType(InformationType.Casos_clinicos_interactivos).subscribe({
        next: (data: any) => {
          console.log('>>>>> DATA CASOS CLINICOS INTERACTIVOS <<<<<', data);
          if (data.getInformationByPrefixByTypeResult.length > 0) {
            this.clientEngineService.getInteractiveClinicalCaseResult.next(data.getInformationByPrefixByTypeResult);
          }
          this.successRequest.next(true);
        },
        error: ex => {
          console.log(ex);
          this.controllersIonicService.hideLoader().finally(() => {
            this.retry();
          });
        },
        complete: () => {
          console.log('Complete');
          this.controllersIonicService.hideLoader();
        }
      });
    });

  }

  retry() {
    this.controllersIonicService.presentAlertRetry('CCI')
      .then((values: any) => {
        const reintentar: boolean = values.data.opcion;
        if (reintentar) {
          this.exception.next(false);
          this.getInformationByPrefixByType();
        } else {
          this.exception.next(true);
        }
      });
  }

  goToCCIView(elementData: any) {
    console.warn('init goToCCIView', elementData);
    this.infoDataInput = elementData;
    if (this.infoDataInput !== undefined) {
        this.addTrackingActivity(elementData);
      const navigationExtras: NavigationExtras = {
        state: {
          title: this.infoDataInput.ElectronicTitle,
          baseUrl: this.infoDataInput.BaseUrl,
          fileName: this.infoDataInput.FileName,
          link: this.infoDataInput.Link,
          electronicid: this.infoDataInput.ElectronicId,
          allData: this.infoDataInput
        }
      };
      //this.fa.trackFAEventClick('CasoClinicointeractivo ', this.infoDataInput.ElectronicTitle );
      this.router.navigate(['/ver-cci'], navigationExtras);
      console.log('NAV EXTRAS CCI', navigationExtras);
    }
  }

   bannerClose(event){
    console.log({close: event});
    this.closeBanner = event;
  }


  addTrackingActivity(electronicInformation: any) {
    console.log('addTrackingActivity - electronicInformation', electronicInformation);
    const today = new Date().getTime();
    let latitude = '';
    let longitude = '';
    let ip: '';
    const clientPosition = this.globalVars.getGeolocationClient();
    const clientAddress = this.globalVars.getClientAddressIp();
    if (clientPosition) {
      latitude = clientPosition.latitude.toString();
      longitude = clientPosition.longitude.toString();
    }
    if (clientAddress) {
      ip = clientAddress.ip;
    }
    const data: IInfoTracking = {
      BranchId: null,
      CodeString: this.globalVars.getClientInfoValue().codeString,
      Date: '\/Date(' + today.toString() + '+0200)\/',
      ElectronicId: electronicInformation.ElectronicId,
      EntityId: InfoEntities.CasosClinicosInteractivos,
      EventId: null,
      Label: 'Casos Clínicos Interactivos',
      LabelValue: electronicInformation.ElectronicTitle,
      SearchAddressIP: null,
      SearchLatitude: latitude,
      SearchLongitude: longitude,
      SearchText: null,
      SearchTypeId: SearchType.parametrizado,
      SourceId: this.globalVars.getInfoTrackingSource()
    };
    this.trackingEngineService.addInfoTracking(data);
    console.log('addTrackingActivity CCI - DATA', data);
  }

  async addTrackingSectionAndEvent(nameEvent?: string) {
    this.trackingEngineService.addTrackingBySection('Casos Clínicos Interactivos',nameEvent);
  }

}
