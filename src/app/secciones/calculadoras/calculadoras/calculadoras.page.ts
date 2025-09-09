import { AfterViewInit, Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
//import { IonContent, IonVirtualScroll, Platform } from "@ionic/angular";
import { IonContent, Platform } from "@ionic/angular";
//import { GoogleAnalytics } from '@awesome-cordova-plugins/google-analytics/ngx';
import { CalculatorsDynamicService } from '../../../services/calculators-dynamic.service';

import { ConnectionService, ControllersIonicService, DynamicScriptLoaderService, FirebaseAnalyticsService, GlobalvarsService, PlmClientsEngineService, PlmTrackingEngineService } from '../../../services/indexServices';
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
  selector: 'app-calculadoras',
  templateUrl: './calculadoras.page.html',
  styleUrls: ['./calculadoras.page.scss'],
  standalone: false,
})
export class CalculadorasPage implements OnInit, AfterViewInit {

  @ViewChildren(CollapseElementListComponent) accordionsQueryList: QueryList<CollapseElementListComponent>;
  public accordions: CollapseElementListComponent[];
  public accordionChangeSub: Subscription;


  @ViewChild(IonContent) content: IonContent;
  //@ViewChild("vScroll") public virtualScroll: IonVirtualScroll;
  
  public valueSelected: string = "1";
  
  public alphabet: string[] = [];

  public electronicInfo: any[] = [];
  public filterData: any[] = [];
  public tmpfilterData: any[] = [];
  public data: any[] = [];
  public results = [...this.data];

  public contentTop: number;
  public contentHeight: number;
  
  successRequest = new BehaviorSubject<boolean>(false);
  exception = new BehaviorSubject<boolean>(false);

  getInformationSub: Subscription;

  filterTerm: string;

  searcher: boolean;

  public resultsCalculators = [...this.data];

  mUtilities: UtilitiesCalculator;

  calculators: any[] = [];
  
  showBanner: boolean;
  closeBanner : boolean;
  
  constructor(
    private router: Router,
    private platform: Platform,
    //private ga: GoogleAnalytics,
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
    private fa: FirebaseAnalyticsService
  ) {
    this.alphabet.push(String.fromCharCode(35));
    for (let i = 0; i < 26; i++) {
      this.alphabet.push(String.fromCharCode(65 + i));
    }
  }

  ngOnInit() {
    this.addTrackingSectionAndEvent();
    //this.getCalculatorsList();
    this.loadCalculatorSolutionsScript();
    if (this.clientEngineService.getCalculators().length === 0) {
      this.getCalculatorsFromHttp();  //TODO: Test Local
      //this.getInformationByPrefixByType();
    } else {
      //this.mergeElectronicInfo(this.plmAssetsEngineService.getCalculators());
      this.successRequest.next(true);
    }
    this.searcher = false;
    //this.ga.trackView(this.router.url);
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

    if (this.accordionChangeSub) {
      this.accordionChangeSub.unsubscribe();
    }
  }

  bannerClose(event){
    console.log({close: event});
    this.closeBanner = event;
  }


  ngAfterViewInit() {
    this.content.getScrollElement().then((res: HTMLElement) => {
      this.contentTop = res.getBoundingClientRect().top;
      this.contentHeight = res.getBoundingClientRect().height;
      console.log('CalculadorasPage', this.contentTop);
      console.log('CalculadorasPage', this.contentHeight);
    });


    this.accordions = this.accordionsQueryList.toArray();
    this.accordionChangeSub =
      this.accordionsQueryList.changes.subscribe(() => {
        this.accordions = this.accordionsQueryList.toArray();
      });
  }

  accordionGroupChange(event: any) {
    if(event.detail.value) {
      const selectedValue = parseInt(event.detail.value);
      const crrntTherapeuticLine = this.plmAssetsEngineService.getCalculators().find(element => element.TherapeuticLineId === selectedValue);
      if (crrntTherapeuticLine) {
        this.addTrackingSectionAndEvent(crrntTherapeuticLine?.Description);
      }
    }
  }
  
  getInformationByPrefixByType() {
    console.warn('CalculadorasPage', '***  getInformationByPrefixByType  ***');
    if (this.getInformationSub) {
      this.getInformationSub.unsubscribe();
    }
    this.controllersIonicService.showLoader().finally(() => {
      this.getInformationSub =
      this.clientEngineService.getInformationByPrefixByType(InformationType.Calculadora).subscribe({
        next: (data: any) => {
          if (data.getInformationByPrefixByTypeResult.length > 0) {
            this.clientEngineService.getCalculatorsResult.next(data.getInformationByPrefixByTypeResult);
          } else {
            this.clientEngineService.getCalculatorsResult.next([]);
          }
          this.successRequest.next(true);
        },
        error: (ex: any) => {
          console.log('CalculadorasPage', ex);
          this.controllersIonicService.hideLoader().finally(() => {
            this.retry();
          });
        },
        complete: () => {
          console.log('CalculadorasPage', 'Complete');
          this.controllersIonicService.hideLoader();
        }
      });
    });
  }

  retry() {
    this.controllersIonicService.presentAlertRetry('Calculadoras')
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

  async getCalculatorsFromHttp() {
    //this.controllersIonicService.showLoader();
    this.calculatorsDynamicService.getCalculatorsFromHttpClient('MedicV2')
      .then((result: any) => {
        console.log('result', result);
        const data = this.calculatorsDynamicService.getCalculatorListJson();
        console.warn( {dataResult: data});
        data.forEach(calculator => {
          this.calculators = calculator.calculatorsResources;
          console.log({calculators: this.calculators});
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
  
  cancelButton() {
    this.searcher = false;
  }

  checkFocus() {
    this.searcher = true;
  }
  
  unCheckFocus() {
    console.log('CalculadorasPage', 'unCheckFocus');
    // this.searcher = false;
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



  handleChange(event: any) {
    const query: string = event.target.value.toLowerCase();
    console.log('CalculadorasPage', query);
    if(query.length>0){
      this.valueSelected="2";
      this.searcher = true;
    }else{
      this.tmpfilterData=this.results;
    }
    this.tmpfilterData = this.results.filter(
      (d) => d.ElectronicTitle.toLowerCase().indexOf(query) > -1
    );
  }

  onClear(event: any) {
    console.log('CalculadorasPage', '***  onClear  ***');
    console.log('CalculadorasPage', event);
    this.searcher = false;
  }

  segmentChanged(event: CustomEvent) {
    this.valueSelected = event.detail.value;
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
      Label: 'Calculator',
      LabelValue: item.ElectronicTitle,
      SearchAddressIP: ip,
      SearchLatitude: latitude,
      SearchLongitude: longitude,
      SearchText: '',
      SearchTypeId: SearchType.parametrizado,
      SourceId: this.globalVars.getInfoTrackingSource()
    };
    //TODO: Descomentar en produccion!!!
    //console.warn('CalculadorasPage', '**  addInfoTracking()...');
    //this.trackingEngineService.addInfoTracking(data);
  }

  async addTrackingSectionAndEvent(nameEvent?: string) {
    console.warn('CalculadorasPage', '**  addTrackingSectionAndEvent');
    this.trackingEngineService.addTrackingBySection('Calculadoras',nameEvent);
  }

}