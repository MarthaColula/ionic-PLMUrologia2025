import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import {
  InAppBrowserService, GlobalvarsService, ControllersIonicService,
  PlmClientsEngineService, PlmTrackingEngineService, ConnectionService,
  FirebaseAnalyticsService
} from '../../../services/indexServices';
import { ElectronicInfo, InfoEntities, SearchType, IInfoTracking } from '../../../interfaces/models';
import { InformationType } from '../../../interfaces/models';
import { BehaviorSubject, Subscription } from 'rxjs';

@Component({
  selector: 'app-abstracts',
  templateUrl: './abstracts.page.html',
  styleUrls: ['./abstracts.page.scss'],
  standalone: false,
})
export class AbstractsPage implements OnInit , OnDestroy {

  successRequest = new BehaviorSubject<boolean>(false);
  exception = new BehaviorSubject<boolean>(false);

  getInformationSub: Subscription;
  infoDataInput: ElectronicInfo;

  showBanner: boolean;
  closeBanner : boolean;

  constructor(
    public router: Router,
    //private ga: GoogleAnalyticsService,
    private globalVars: GlobalvarsService,
    private iabService: InAppBrowserService,
    private connectionService: ConnectionService,
    protected clientEngineService: PlmClientsEngineService,
    private trackingEngineService: PlmTrackingEngineService,
    private controllersIonicService: ControllersIonicService,
    private fa: FirebaseAnalyticsService
   ) { }

  ngOnInit() {
    this.addTrackingSectionAndEvent();
    
    if (this.clientEngineService.getAbstracts().length === 0) {
      this.getInformationByPrefixByType();
    } else {
      this.successRequest.next(true);
    }
  }

  ngAfterViewInit(): void {
   
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
    this.exception.next(false);
    this.controllersIonicService.showLoader().finally(() => {
      this.getInformationSub =
        this.clientEngineService.getInformationByPrefixByType(InformationType.Abstracts).subscribe({
          next: (data: any) => {
            if (data.getInformationByPrefixByTypeResult.length > 0) {
              this.clientEngineService.getAbstractsResult.next(data.getInformationByPrefixByTypeResult);
            } else {
              this.clientEngineService.getAbstractsResult.next([]);
            }
            this.successRequest.next(true);
          },
          error: () => {
            this.controllersIonicService.hideLoader().finally(() => {
              this.exception.next(true);
            });
          },
          complete: () => {
            this.controllersIonicService.hideLoader();
          }
        });
    });
  }
  /*
  openArticle(electronicInformation: any) {
    console.warn('init openArticle');
    console.warn(electronicInformation);
    if (this.connectionService.isConnected()) {
      this.addTrackingActivity(electronicInformation);
      this.iabService.open(electronicInformation.Link, '_system');
    } else {
      this.connectionService.displayWarningMsg('Abstracts');
    }
  }
  */
  showAbstract(elementData: any) {
    console.warn({elementData: elementData});
    this.infoDataInput = elementData;
    if (this.infoDataInput !== undefined) {
      this.addTrackingActivity();
      console.warn({infoDataInput: this.infoDataInput});
      const navigationExtras: NavigationExtras = {
        state: {
          title: this.infoDataInput.ElectronicTitle,
          description: this.infoDataInput.ElectronicDescription,
          link: this.infoDataInput.Link,
          electronicid: this.infoDataInput.ElectronicId
        }
      };

      this.fa.trackFAEventClick('Abstract', this.infoDataInput.ElectronicTitle );
      this.router.navigate(['/resumen-abstract'], navigationExtras);
    }
  }

  bannerClose(event){
    console.log({close: event});
    this.closeBanner = event;
  }
  

  //addTrackingActivity(electronicInformation: any) {
  addTrackingActivity() {
    const today = new Date().getTime();
    let latitude = '';
    let longitude = '';
    let ip = '';
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
      CodeString: this.globalVars.getClientInfoValue().codeString,
      Date: '\/Date(' + today.toString() + '+0200)\/',
      ElectronicId: this.infoDataInput.ElectronicId,
      EntityId: InfoEntities.Abstracts,
      Label: 'Abstracts',
      LabelValue: this.infoDataInput.ElectronicTitle.trim(),
      SearchAddressIP: ip,
      SearchLatitude: latitude,
      SearchLongitude: longitude,
      SearchText: '',
      SearchTypeId: SearchType.parametrizado,
      SourceId: this.globalVars.getInfoTrackingSource()
    };
    this.trackingEngineService.addInfoTracking(data);
    console.log({ trackdataAbstract: data });
  }

  addTrackingSectionAndEvent(nameEvent?: string) {
    console.log('addTrackingSectionAndEvent Abstracts');
    this.trackingEngineService.addTrackingBySection("Abstracts", nameEvent, this.globalVars);
  }

}
