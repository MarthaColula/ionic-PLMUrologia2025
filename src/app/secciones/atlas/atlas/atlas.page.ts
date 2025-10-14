import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChildren,
} from "@angular/core";
import {
  PlmTrackingEngineService,
  GlobalvarsService,
  ControllersIonicService,
  SectionService,
  FirebaseAnalyticsService,
  ConnectionService,
} from "../../../services/indexServices";
import { NavigationExtras, Router } from "@angular/router";
import { Platform } from "@ionic/angular";
import {
  IInfoTracking,
  InfoEntities,
  SearchType,
} from "../../../interfaces/models";
import { BehaviorSubject, Subscription } from "rxjs";
import { CollapseElementListComponent } from "../../../componentes/collapse-element-list/collapse-element-list.component";


@Component({
  selector: 'app-atlas',
  templateUrl: './atlas.page.html',
  styleUrls: ['./atlas.page.scss'],
  standalone: false,
})
export class AtlasPage implements OnInit , AfterViewInit, OnDestroy {
  @ViewChildren(CollapseElementListComponent)
  accordionsQueryList: QueryList<CollapseElementListComponent>;
  successRequest = new BehaviorSubject<boolean>(false);
  public accordions: CollapseElementListComponent[];
  public exception = new BehaviorSubject<boolean>(false);
  public accordionChangeSub: Subscription;
  getInformationSub: Subscription;

  infoDataInput: any;
  closeBanner: boolean;
  sectionName: any;
  img: any;
  showBanner: boolean | undefined;


  constructor(
    private plt: Platform,
    private router: Router,
    private globalVars: GlobalvarsService,
    private fa: FirebaseAnalyticsService,
    public articlesService: SectionService,
    private connectionService: ConnectionService,
    private trackingEngineService: PlmTrackingEngineService,
    private controllersIonicService: ControllersIonicService,
    
  ) {}

  ngOnInit() {
    this.articlesService.section.next("atlas");

    if (this.articlesService.getDynamicSection() === null) {
      this.getDynamicSectionJsonFromServer();
    } else {
      this.successRequest.next(true);

      console.log("choosePlatform");
      this.choosePlatform();
    }
  }

  ngAfterViewInit(): void {
    this.accordions = this.accordionsQueryList.toArray();
    this.accordionChangeSub = this.accordionsQueryList.changes.subscribe(() => {
      this.accordions = this.accordionsQueryList.toArray();
    });
  }

  ngOnDestroy(): void {
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

  ionViewWillEnter() {
    this.showBanner = true;
  }

  ionViewDidLeave() {
    this.showBanner = false;
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
              .find((element) => element.sectionName === "atlas");// cci
            console.log({ section: section });
            this.articlesService.dynamicSectionJsonResult.next(
              section.atlasResources
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
          });
        })
        .finally(() => {
          this.controllersIonicService.hideLoader();
          console.log("successfull getDynamicSectionJsonLocalRequest");
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

   viewPDF(elementData: any) {
    console.warn('init goToImgView');
    //this.infoDataInput = elementData;
    if (elementData !== undefined) {
      this.addTrackingActivity(elementData);
      const navigationExtras: NavigationExtras = {
        state: {
          electronicId: elementData.ElectronicId,
          title: elementData.Title,
          fileName: elementData.FileName,
          baseUrl: elementData.BaseUrl,
          //link: (elementData.Link ? elementData.Link : elementData.BaseUrl + 'portrait/' + elementData.FileName)

          link: (elementData.BaseUrl + 'portrait/' + elementData.FileName)
        } //elementData.Link ? elementData.Link : 
      };
      console.log({navigationExtrasAtlas : navigationExtras});
      this.router.navigate(['/ver-atlas'], navigationExtras);
    }
  }

  public closeAccordion() {
    this.accordions.forEach((item) => {
      if (item.isMenuOpen) {
        item.isMenuOpen = false;
      }
    });
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
      EntityId: InfoEntities.Atlas,
      EventId: null,
      Label: 'Atlas',
      LabelValue: electronicInformation.ElectronicTitle,
      SearchAddressIP: null,
      SearchLatitude: latitude,
      SearchLongitude: longitude,
      SearchText: null,
      SearchTypeId: SearchType.parametrizado,
      SourceId: this.globalVars.getInfoTrackingSource()
    };
    this.trackingEngineService.addInfoTracking(data);
    console.log('addTrackingActivity Atlas', data);
  }

  async addTrackingSectionAndEvent(nameEvent?: string) {
    this.trackingEngineService.addTrackingBySection('Atlas',nameEvent);
  }
 
}
