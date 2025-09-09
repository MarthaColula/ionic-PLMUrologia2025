import { AfterViewInit, Component, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { PlmTrackingEngineService, GlobalvarsService, ControllersIonicService, CalculatorsServiceService, FirebaseAnalyticsService } from '../../../services/indexServices';
import { Router, NavigationExtras } from '@angular/router';
import { Platform } from '@ionic/angular';
import { ElectronicInfo, IInfoTracking, InfoEntities, SearchType } from '../../../interfaces/models';
import { BehaviorSubject, Subscription } from 'rxjs';
import { CollapseElementListComponent } from '../../../componentes/collapse-element-list/collapse-element-list.component';
import { InAppBrowserService } from 'src/app/services/in-app-browser.service';
import { ConnectionService } from "../../../services/connection.service";

@Component({
  selector: 'app-calculators-list',
  templateUrl: './calculators-list.page.html',
  styleUrls: ['./calculators-list.page.scss'],
  standalone: false,
})

export class CalculatorsListPage implements OnInit ,AfterViewInit, OnDestroy {

  @ViewChildren(CollapseElementListComponent) accordionsQueryList: QueryList<CollapseElementListComponent>;
  public accordions: CollapseElementListComponent[];
  public accordionChangeSub: Subscription;
  public avalibleCalculatorsResources = new BehaviorSubject<boolean>(true);
  public exception = new BehaviorSubject<boolean>(false);
  calculators: any[] = [];
  PLMId: string;
  showBanner: boolean;
  infoDataInput: any;
  closeBanner : boolean;

  constructor(
    private connectionService: ConnectionService,
    private plt: Platform,
    private router: Router,
    private globalVars: GlobalvarsService,
    private iabService: InAppBrowserService,
    private fa: FirebaseAnalyticsService,
    private calculatorsService: CalculatorsServiceService,
    private trackingEngineService: PlmTrackingEngineService,
    private controllersIonicService: ControllersIonicService,) { }

  ngOnInit() {
    this.addTrackingSectionAndEvent();
    
    const resultDynamicSection = this.calculatorsService.getDynamicSection();
    if (Array.isArray(resultDynamicSection)) {
      console.log({resultDynamicSection: resultDynamicSection});
      this.prepareCalculatorsSection();
    } else {
      console.log('choosePlatform');
      this.choosePlatform();
    }
  }

  ngAfterViewInit(): void {
    this.accordions = this.accordionsQueryList.toArray();
    this.accordionChangeSub =
      this.accordionsQueryList.changes.subscribe(() => {
        this.accordions = this.accordionsQueryList.toArray();
      });
  }

  ngOnDestroy(): void {
    if (this.accordionChangeSub) {
      this.accordionChangeSub.unsubscribe();
    }
  }

  ionViewWillEnter() {
    if (!this.calculatorsService.PLMIdMainSection) {
      return;
    }
    /*this.PLMId = this.calculatorsService.PLMIdMainSection;
    if (this.calculatorsService.PLMIdMainSection.length > 3) {
      this.showBanner = true;
    } else {
      this.showBanner = false;
    }*/

    this.showBanner = true;
  }

  ionViewDidLeave() {
    this.showBanner = false;
  }

  bannerClose(event){
    console.log({close: event});
    this.closeBanner = event;
  }

  public choosePlatform() {
    this.exception.next(false);
    
      if (this.plt.is('cordova')) {
        this.getDynamicSectionJsonFromServer();
      } else {
        this.getDynamicSectionJsonLocal();
      } 
  }

  public getDynamicSectionJsonFromServer() {
    this.controllersIonicService.showLoader().finally(() => {
      this.calculatorsService.getDynamicSectionJsonFromServerRequest()
        .then(() => {
          this.prepareCalculatorsSection();
        })
        .catch(() => {
          this.controllersIonicService.hideLoader().finally(() => {
            this.exception.next(true);
          });
        }).finally(() => {
          this.controllersIonicService.hideLoader();
        });
    });
  }

  public getDynamicSectionJsonLocal() {
    this.controllersIonicService.showLoader().finally(() => {
      this.calculatorsService.getDynamicSectionJsonLocalRequest()
        .then(() => {
          this.prepareCalculatorsSection();
        })
        .catch(() => {
          this.controllersIonicService.hideLoader().finally(() => {
            this.exception.next(true);
          });
        })
        .finally(() => {
          this.controllersIonicService.hideLoader();
          console.log('successfull getDynamicSectionJsonLocalRequest');
        });
    });
  }

  prepareCalculatorsSection() {
    const found = this.calculatorsService.sectionExist('calculators');
    if (found === true) {
     /* if (this.calculatorsService.PLMIdMainSection.length > 3) {
        this.PLMId = this.calculatorsService.PLMIdMainSection;
        this.showBanner = true;
      }*/
        this.showBanner = true;
      this.calculators = this.calculatorsService.mainSection.getValue().calculatorsResources;
      console.error({calculators:this.calculators});
      this.avalibleCalculatorsResources.next(true);
    } else {
      this.avalibleCalculatorsResources.next(false);
    }
  }

  public openExternalLink(event: any) {
    this.infoDataInput = event;
    this.addTrackingActivity(event);
    this.iabService.open(event.Link, '_system');
  }

  public closeAccordion() {
    this.accordions.forEach((item) => {
      if (item.isMenuOpen) {
        item.isMenuOpen = false;
      }
    });
  }

  addTrackingActivity(electronicInformation: any) {
    const today = new Date().getTime();
    let latitude = '';
    let longitude = '';
    let ip= '';
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
      CodeString: this.globalVars.getClientInfoValue()?.codeString,
      Date: '\/Date(' + today.toString() + '+0200)\/',
      ElectronicId: electronicInformation.ElectronicId,
      EntityId: InfoEntities.Calculator,
      EventId: null,
      Label: 'Calculadoras',
      LabelValue: electronicInformation.ElectronicTitle,
      SearchAddressIP: ip,
      SearchLatitude: latitude,
      SearchLongitude: longitude,
      SearchText: '',
      SearchTypeId: SearchType.parametrizado,
      SourceId: this.globalVars.getInfoTrackingSource()
    };
    console.log({trackdata: data});
    this.trackingEngineService.addInfoTracking(data);
  }

  showCalculators(item: ElectronicInfo) {
    //if (this.connectionService.isConnected() === true) {
      this.addTrackingActivity(item);
    //}
    this.fa.trackFAEventClick('Algoritmos',item.ElectronicTitle);
    if (item.Link) {
      console.warn('CalculadorasPage', '***  data.Url_resource: ' + item.Link);
      this.iabService.open(item.Link, '_system');
    } else if (item.FileName) {
      let navigationExtras: NavigationExtras = {
        state: {
          calculator: item
        }
      };
      let caseItem = (item.FileName.includes('PWA.json') ? 'PWA' : 'Dynamic');
      switch (caseItem) {
        case 'Dynamic':
          this.router.navigate(['/calculator-overview'], navigationExtras);
          break;
        case 'PWA':
          this.router.navigate(['/calculator-pwa'], navigationExtras);
          break;
        default:
          break;
      }
    }
  }

    public goCalculatorView(item: any) {
    //if (this.connectionService.isConnected() === true) {
      this.addTrackingActivity(item);
    //}
    let navigationExtras: NavigationExtras = {
      state: {
        calculator: item
      }
    };
    let caseItem = (item.FileName ? 'Dynamic' : 'Informative');
    switch (caseItem) {
      case 'Dynamic':
        this.fa.trackFAEventClick("Calculadora", item.ElectronicTitle);
        this.router.navigate(['/calculator-overview'], navigationExtras);
        break;
      case 'Informative':
        //TODO: Implementar...
        break;
      default:
        break;
    }
  }

  addTrackingSectionAndEvent(nameEvent?: string) {
    console.log('addTrackingSectionAndEvent Calculadoras');
    this.trackingEngineService.addTrackingBySection("Calculadoras", nameEvent, this.globalVars);
  }


}
