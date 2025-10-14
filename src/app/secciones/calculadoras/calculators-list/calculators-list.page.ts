import { AfterViewInit, Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
//import { IonContent, IonVirtualScroll, Platform } from "@ionic/angular";
import { IonContent, Platform } from "@ionic/angular";
//import { GoogleAnalytics } from '@awesome-cordova-plugins/google-analytics/ngx';
import { CalculatorsDynamicService } from '../../../services/calculators-dynamic.service';

import { ConnectionService, ControllersIonicService, DynamicScriptLoaderService, FirebaseAnalyticsService, GlobalvarsService, PlmClientsEngineService, PlmTrackingEngineService, SectionService } from '../../../services/indexServices';
import { InAppBrowserService } from '../../../services/in-app-browser.service';
import { PlmAssetsEngineService } from '../../../services/plm-assets-engine.service';
import { RestPlmAssetsEngineService } from '../../../services/rest-plm-assets-engine.service';
import { UtilitiesCalculator } from '../../../interfaces/utilities-calculator';
//import { ElectronicInformationContent } from "../../../interfaces/content";
import { IInfoTracking } from '../../../interfaces/PLMTrackingEngine';
import { InfoEntities, SearchType } from '../../../interfaces/catalogs';
import { InformationType } from '../../../interfaces/catalogs';
import { BehaviorSubject, Subscription } from 'rxjs';
import { CollapseElementListComponent } from 'src/app/componentes/collapse-element-list/collapse-element-list.component';
import { ElectronicInfo } from 'src/app/interfaces/editorialContent';

@Component({
  selector: 'app-calculators-list',
  templateUrl: './calculators-list.page.html',
  styleUrls: ['./calculators-list.page.scss'],
  standalone: false,
})

export class CalculatorsListPage implements OnInit, AfterViewInit {

  @ViewChildren(CollapseElementListComponent) accordionsQueryList: QueryList<CollapseElementListComponent>;
  public accordions: CollapseElementListComponent[];
  public accordionChangeSub: Subscription;


  @ViewChild(IonContent) content: IonContent;
  //@ViewChild("vScroll") public virtualScroll: IonVirtualScroll;
 
  calculators: any[] = [];
  successRequest = new BehaviorSubject<boolean>(false);
  exception = new BehaviorSubject<boolean>(false);
  getInformationSub: Subscription;
  showBanner: boolean;
  closeBanner: boolean;
  img: any;
  sectionName: any;
  infoDataInput: any;


  constructor(
    private router: Router,
    private plt: Platform,
    private globalVars: GlobalvarsService,
    protected clientEngineService: PlmClientsEngineService,
    private calculatorsDynamicService: CalculatorsDynamicService,
    private iabService: InAppBrowserService,
    private dynamicScriptLoaderServiceService: DynamicScriptLoaderService,
    private controllersIonicService: ControllersIonicService,
    private restPlmAssetsEngineService: RestPlmAssetsEngineService,
    private plmAssetsEngineService: PlmAssetsEngineService,
    private trackingEngineService: PlmTrackingEngineService,
    private connectionService: ConnectionService,
    private fa: FirebaseAnalyticsService,
    public articlesService: SectionService,
  ) {
   
  }

  ngOnInit() {
    this.articlesService.section.next("calculators");

    this.addTrackingSectionAndEvent();
    this.loadCalculatorSolutionsScript();

    if (this.articlesService.getDynamicSection() === null) {
      this.getDynamicSectionJsonFromServer();
      //this.getCalculatorsFromHttp();  //TODO: Test Local
    } else {
      this.successRequest.next(true);

      console.log("choosePlatform");
      this.choosePlatform();
    }
   
  }

  ionViewDidLeave() {
    this.showBanner = false;
  }

  ionViewWillEnter() {
    this.showBanner = true;
  }

  ngAfterViewInit(): void {
    this.accordions = this.accordionsQueryList.toArray();
    this.accordionChangeSub = this.accordionsQueryList.changes.subscribe(() => {
      this.accordions = this.accordionsQueryList.toArray();
    });
  }


  ngOnDestroy() {
    if (this.accordionChangeSub) {
      this.accordionChangeSub.unsubscribe();
    }

    if (this.getInformationSub) {
      this.getInformationSub.unsubscribe();
    }

    this.articlesService.dynamicSectionJsonResult.next(null);
    console.log(
      "dynamicSectionJsonResult",
      this.articlesService.dynamicSectionJsonResult
    );

    this.articlesService.section.next(null);
  }

  bannerClose(event) {
    console.log({ close: event });
    this.closeBanner = event;
  }


  public choosePlatform() {
    this.exception.next(false);

    if (this.plt.is("cordova")) {
      console.log("getDynamicSectionJsonFromServer");
      this.getDynamicSectionJsonFromServer();
    } else {
      console.log("getDynamicSectionJsonLocal");
      this.getDynamicSectionJsonLocal();
    }
  }

  public getDynamicSectionJsonFromServer() {
    console.log('getDynamicSectionJsonFromServer');
    this.controllersIonicService.showLoader().finally(() => {
      this.articlesService
        .getDynamicSectionJsonFromServerRequest()
        .then(() => {
          console.log('getDynamicSectionJsonFromServerRequest');
          console.log('this.articlesService.dynamicSectionJsonResult.getValue()', this.articlesService.dynamicSectionJsonResult.getValue());
          if (this.articlesService.dynamicSectionJsonResult.getValue()) {
            let section: any = this.articlesService.dynamicSectionJsonResult
              .getValue()
              .find((element) => element.sectionName === "calculators");// cci
            console.log({ section: section });
            this.articlesService.dynamicSectionJsonResult.next(
              section.calculatorsResources
            );
            console.log('dynamicSectionJsonResult', this.articlesService.dynamicSectionJsonResult.getValue());
            this.sectionName = section.sectionName;
            this.img = "/assets/images/iconoThumbnailArticulos.svg";
            this.successRequest.next(true);

          } else {
            this.articlesService.dynamicSectionJsonResult.next([]);
          }
        })
        .catch(() => {
          this.controllersIonicService.hideLoader().finally(() => {
            this.exception.next(true);
             this.retry();
          });
        })
        .finally(() => {
          this.controllersIonicService.hideLoader();
          console.log("successfull getDynamicSectionJsonFromServer");
        });
    });
  }

  public getDynamicSectionJsonLocal() {
    this.controllersIonicService.showLoader().finally(() => {
      this.articlesService
        .getDynamicSectionJsonLocalRequest()
        .then(() => {
          //this.preparePodcastsSection();
        })
        .catch(() => {
          this.controllersIonicService.hideLoader().finally(() => {
            this.exception.next(true);
           
          });
        })
        .finally(() => {
          this.controllersIonicService.hideLoader();
          console.log("successfull getDynamicSectionJsonLocalRequest");
        });
    });
  }



  retry() {
    this.controllersIonicService.presentAlertRetry('Calculadoras')
      .then((values: any) => {
        const reintentar: boolean = values.data.opcion;
        if (reintentar) {
          this.exception.next(false);
          this.getDynamicSectionJsonFromServer();
        } else {
          this.exception.next(true);
        }
      });
  }

  async getCalculatorsFromHttp() { // LOCAL
    //this.controllersIonicService.showLoader();
    this.calculatorsDynamicService.getCalculatorsFromHttpClient('MedicV2')
      .then((result: any) => {
        console.log('result', result);
        const data = this.calculatorsDynamicService.getCalculatorListJson();
        console.warn({ dataResult: data });
        data.forEach(calculator => {
          this.calculators = calculator.calculatorsResources;
          console.log({ calculators: this.calculators });
        });

        if (data.getInformationByPrefixByTypeResult && data.getInformationByPrefixByTypeResult.length > 0) {
          console.warn('CalculadorasPage', '***  getInformationByPrefixByTypeResult  ***');
          this.clientEngineService.getCalculatorsResult.next(data.getInformationByPrefixByTypeResult);
        } else if (data.length && data[0].Contents && data[0].Contents.length > 0) {
          console.warn('CalculadorasPage', '***  Contents  ***');
          this.clientEngineService.getCalculatorsResult.next(data[0].Contents);
        } else {
          console.warn('CalculadorasPage', '***  Empty  ***');
          this.clientEngineService.getCalculatorsResult.next([]);
        }
      })
      .catch(ex => {
        //this.controllersIonicService.hideLoader();
        console.error('CalculadorasPage', ex);
        this.exception.next(true);
      })
      .finally(() => {
        console.warn('CalculadorasPage', 'Complete getCalculatorListJsonFromService...');
        //this.controllersIonicService.hideLoader();
      });
  }

  async loadCalculatorSolutionsScript() {
    console.warn('CalculadorasPage', 'called loadCalculatorSolutionsScript method from CalculadorasPage');
    return await this.dynamicScriptLoaderServiceService
      .loadScript('calculatorBusinessLogic')
      .then(result => {
        console.warn('CalculadorasPage', result);
        return true;
      })
      .catch(result => {
        return false;
      });
  }


  showCalculators(item: any) {
    //if (this.connectionService.isConnected() === true) {
    this.addTrackingActivity(item);
    //}
    this.fa.trackFAEventClick('calculator', item.ElectronicTitle);
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



  public closeAccordion() {
    this.accordions.forEach((item) => {
      if (item.isMenuOpen) {
        item.isMenuOpen = false;
      }
    });
  }

  addTrackingActivity(item: any) {
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
      BranchId: null,
      CodeString: this.globalVars.getClientInfoValue().codeString,
      Date: '\/Date(' + today.toString() + '+0200)\/',
      ElectronicId: null,
      EntityId: InfoEntities.Calculator,
      EventId: null,
      Label: 'Calculadora',
      LabelValue: item.ElectronicTitle,
      SearchAddressIP: ip,
      SearchLatitude: latitude,
      SearchLongitude: longitude,
      SearchText: '',
      SearchTypeId: SearchType.parametrizado,
      SourceId: this.globalVars.getInfoTrackingSource()
    };
    this.trackingEngineService.addInfoTracking(data);
    console.warn('addTrackingActivity',data );
  }

  async addTrackingSectionAndEvent(nameEvent?: string) {
    console.warn('CalculadorasPage', '**  addTrackingSectionAndEvent');
    this.trackingEngineService.addTrackingBySection('Calculadoras', nameEvent);
  }


}
