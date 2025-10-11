import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { DomSanitizer } from '@angular/platform-browser';
import { Platform } from "@ionic/angular";
import {
  //FirebaseAnalyticsService, 
  ControllersIonicService,
  PlmAssetsEngineService,
  SocialService,
  PlmTrackingEngineService,
  GlobalvarsService
} from 'src/app/services/indexServices'
import { environment } from "src/environments/environment";
import { InfoEntities, IInfoTracking, SearchType } from '../../../interfaces/models';
import { BehaviorSubject, Subscription } from "rxjs";

@Component({
  selector: 'app-ver-atlas',
  templateUrl: './ver-atlas.page.html',
  styleUrls: ['./ver-atlas.page.scss'],
   standalone: false,
})

export class VerAtlasPage implements OnInit, OnDestroy {

  protected pdfSrc: string = '';
  protected securityPDF: any;
  protected flgError: boolean = false;
  protected flgProgress: boolean = false;
  protected flgComplete: boolean = false;
  protected progressLoaded: any;
  protected progressTotal: any;
  protected msgError: string;

  link: string;
  title: any;
  baseUrl: any;
  name: any;
  electronicId: any;

  subQueryParams: Subscription;
  exception = new BehaviorSubject<boolean>(false);
  successRequest = new BehaviorSubject<boolean>(false);
  showBanner$ = new BehaviorSubject(false);
  getInformationSub: Subscription;
  
  protected intents = 0;

  constructor(
    private plt: Platform,
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer,
    private socialService: SocialService,
    private plmAssetsEngineService: PlmAssetsEngineService,
    private loaderServiceService: ControllersIonicService,
    //private fa: FirebaseAnalyticsService,
    private plmTrackingEngineService: PlmTrackingEngineService,
    private globalvarsService: GlobalvarsService,
  ) {
    this.getParams();
  }

  ngOnInit() {
    console.log('VerPdf', '***  ngOnInit  ***');
  }

  ionViewDidEnter() {
    console.warn('VerPdf', '*** ionViewDidEnter  ***');
  }

  ngOnDestroy(): void {
    console.log('VerPdf', '***  ngOnDestroy  ***');
    if (this.subQueryParams) {
      this.subQueryParams.unsubscribe();
    }
  }

  async getParams() {
    const params = this.router.getCurrentNavigation()?.extras.state;
    console.warn('VerPdf', '*** params: ', params);
    this.subQueryParams = this.route.queryParams.subscribe(() => {
      if (params && params['deeplinkId'] !== undefined) {
        console.log('params[deeplinkId]', params['deeplinkId']);
        let id = params['deeplinkId'];
        this.getInfomationByTypeDeeplink(id);
        this.title = 'Atlas'
      } else if (params) {
        this.baseUrl = params['baseUrl'];
        this.name = params['fileName'];
        this.link = params['link'];
        this.title = params['title'];
        this.electronicId = params['electronicId'];
        //this.pdfSrc = this.baseUrl + this.name;
        //this.pdfSrc = this.link;
        const srcPDF = (this.link ? this.link : this.baseUrl + this.name);
        const strPDFSrc = (srcPDF.includes('https:') ? srcPDF : srcPDF.replace('http:','https:'));
        this.pdfSrc = strPDFSrc;
        console.warn('VerAtlas', '**  pdfSrc: ' + this.pdfSrc);
        //this.securityPDF = this.sanitizer.bypassSecurityTrustResourceUrl(this.link);
        this.showBanner$.next(true);
        console.log('VerAtlas', 'ElectronicId: ' + this.electronicId);
        const titleReplace = this.title.split(' ').join('_');
        this.trackingFATitle(titleReplace);
        this.successRequest.next(true);
        this.exception.next(false);
      }
    });
  }

  getInfomationByTypeDeeplink(id: any) {
    console.log('getInfomationByTypeDeeplink - id', id);
    this.exception.next(false);
    this.loaderServiceService.showLoader().finally(() => {
      this.getInformationSub = this.plmAssetsEngineService
        .getElectronicInformationByIdDeepLink(id)
        .subscribe({
          next: (data: any) => {
            if (data) {
              console.log('VerPdf - data', data);
              this.baseUrl = data.BaseUrl;
              this.name = data.FileName;
              this.link = data.Link;
              this.title = data.ElectronicTitle;
              this.electronicId = data.ElectronicId;
              this.addTrackingActivity(data);
              //this.pdfSrc = this.baseUrl + this.name;
              //this.pdfSrc = this.link;
              //const srcPDF = (this.link ? this.link : this.baseUrl  + this.name);
              const srcPDF = ( this.baseUrl + 'portrait/' + this.name);
              const strPDFSrc = (srcPDF.includes('https:') ? srcPDF : srcPDF.replace('http:','https:'));
              //this.securityPDF = this.sanitizer.bypassSecurityTrustResourceUrl(this.link);
              this.pdfSrc = strPDFSrc;
              console.log('pdfSrc', this.pdfSrc);
              this.showBanner$.next(true);
              console.log('VerPdf', 'ElectronicId: ' + this.electronicId);
              this.successRequest.next(true);
            }
          },
          error: () => {
            this.loaderServiceService.hideLoader().finally(() => {
              if (this.intents < 1) {
                this.intents++;
                this.retry(id);
              } else {
                this.exception.next(true);
                this.msgError = 'Por el momento, el archivo no se encuentra disponible.';
              }
            });
          },
          complete: () => {
            this.loaderServiceService.hideLoader().finally(() => {
              if (this.title) {
                this.loaderServiceService.hideLoader();
                this.successRequest.next(true);
                const titleReplace = this.title.split(' ').join('_');
                this.trackingFATitle(titleReplace);
              } else {
                this.loaderServiceService.hideLoader();
                this.successRequest.next(false);
                this.exception.next(true);
                this.msgError = 'Por el momento, el archivo no se encuentra disponible.';
              }
            });
          },
        });
    });
  }
  
  addTrackingActivity(electronicInformation: any) {
    console.log('addTrackingActivity - electronicInformation', electronicInformation);
      const today = new Date().getTime();
      let latitude = '';
      let longitude = '';
      let ip = '';
      const clientPosition = this.globalvarsService.getGeolocationClient();
      const clientAddress = this.globalvarsService.getClientAddressIp();
      if (clientPosition) {
        latitude = clientPosition.latitude.toString();
        longitude = clientPosition.longitude.toString();
      }
      if (clientAddress) {
        ip = clientAddress.ip;
      }
      const data: IInfoTracking = {
        BranchId: null,
        CodeString: this.globalvarsService.getClientInfoValue().codeString,
        Date: '\/Date(' + today.toString() + '+0200)\/',
        ElectronicId: electronicInformation.ElectronicId,
        EntityId: InfoEntities.Atlas,
        EventId: null,
        Label: 'Atlas - Deeplink',
        LabelValue: electronicInformation.ElectronicTitle,
        SearchAddressIP: ip,
        SearchLatitude: latitude,
        SearchLongitude: longitude,
        SearchText: '',
        SearchTypeId: SearchType.parametrizado,
        SourceId: this.globalvarsService.getInfoTrackingSource()
      };
      this.plmTrackingEngineService.addInfoTracking(data);
      console.log('addTrackingActivity ATLAS DL - DATA', data);
    }

  retry(retryID: any) {
    setTimeout(() => {
      console.warn('***  retry - intents: ' + this.intents);
      if (this.intents <= 1) {
        console.warn('***  retry - getInfomationByTypeDeeplink()...');
        this.getInfomationByTypeDeeplink(retryID);
      } else {
        this.exception.next(true);
        this.msgError = 'Por el momento, el archivo no se encuentra disponible.';
      }
    }, 500);
  }

  share() {
    const subject = environment.applicationInfo.name + ': Atlas';
    this.socialService.share(
      this.title,
      subject,
      this.baseUrl + this.name
    );
  }

  trackingFATitle(title: string) {
    const titleReplace = title.split(' ').join('_');
    console.log('Atlas', { title: titleReplace });
    //this.fa.trackingFATitle(titleReplace);
  }
}
