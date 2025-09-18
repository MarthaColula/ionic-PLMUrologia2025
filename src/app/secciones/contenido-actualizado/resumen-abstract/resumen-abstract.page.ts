import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ControllersIonicService, GlobalvarsService,
  PlmAssetsEngineService, PlmTrackingEngineService
} from '../../../services/indexServices';
import { FirebaseAnalyticsService } from '../../../services/firebase-analytics.service';
import { InAppBrowserService } from '../../../services/in-app-browser.service';
import { InfoEntities, IInfoTracking, SearchType } from '../../../interfaces/models';
import { BehaviorSubject, Subscription } from 'rxjs';

@Component({
  selector: 'app-resumen-abstract',
  templateUrl: './resumen-abstract.page.html',
  styleUrls: ['./resumen-abstract.page.scss'],
  standalone: false,
})
export class ResumenAbstractPage implements OnInit , OnDestroy{

  mTitle: any;
  mDescription: any;
  mUrl: any;
  electronicId: any;
  case: any;

  subQueryParams: Subscription;
  getInfoSub: Subscription;
  successRequest = new BehaviorSubject<boolean>(false);
  exception = new BehaviorSubject<boolean>(false);
  showBanner$ = new BehaviorSubject(false);

  navigationSubscription: any;
  
  protected intents = 0;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private inAppBrowserService: InAppBrowserService,
    private plmAssetsEngineService: PlmAssetsEngineService,
    private trackingEngineService: PlmTrackingEngineService,
    private loaderServiceService: ControllersIonicService,
    private globalVars: GlobalvarsService,
    private fa: FirebaseAnalyticsService
  ) {
    route.params.subscribe(val => {
      console.log('VAL: ', val)
    });
    this.getParams();
  }

  ngOnDestroy() {
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
    if (this.subQueryParams) {
      this.subQueryParams.unsubscribe();
    }
    if (this.getInfoSub) {
      this.getInfoSub.unsubscribe();
    }
  }

  ngOnInit() {
    console.log('***  ngOnInit()  ***');
  }

  async ngAfterViewInit() {
  
  }

  getParams() {
    const params = this.router.getCurrentNavigation()?.extras.state;
    console.log('>>> Params', params);
    this.subQueryParams = this.route.queryParams.subscribe(() => {
      if (params && params['deeplink'] !== undefined) {
        let id = params['deeplink'].id;
        console.warn('***  getInfomationByTypeDeeplink('+ id +')...');
        this.getInfomationByTypeDeeplink(id);
      } else if (params) {
        this.mUrl = params['link'];
        this.mTitle = params['title'];
        this.mDescription = params['description'];
        this.successRequest.next(true);
        this.exception.next(false);
        this.electronicId = params['electronicid']
        this.showBanner$.next(true);
        console.log('ElectronicId ', this.electronicId);
        const titleReplace = this.mTitle.split(' ').join('_');
        this.trackingFATitle(titleReplace);
      }
    });
  }
  
  showOriginalArticle() {
    if (this.mUrl) {
      this.inAppBrowserService.open(this.mUrl, '_system');
    }
  }

  getInfomationByTypeDeeplink(id: any) {
    this.exception.next(false);
    this.loaderServiceService.showLoader().finally(() => {
      this.plmAssetsEngineService
        .getElectronicInformationByIdDeepLink(id)
        .subscribe({
          next: (cases: any) => {
            console.log({case: cases});
            if (cases) {
              this.mUrl = cases.Link;
              this.mTitle = cases.ElectronicTitle;
              this.mDescription = cases.ElectronicDescription;
              this.electronicId= cases.ElectronicId;
              this.showBanner$.next(true);
              console.log('ElectronicId ', this.electronicId);
              this.trackingFATitle(this.mTitle);
            }
            this.addTrackingActivity();
          },
          error: () => {
            this.loaderServiceService.hideLoader().finally(() => {
              if (this.intents < 1) {
                this.intents++;
                this.retry(id);
              } else {
                this.exception.next(true);
              }
            });
          },
          complete: () => {
            this.loaderServiceService.hideLoader().finally(() => {
              if (this.mTitle) {
                this.successRequest.next(true);
                const titleReplace = this.mTitle.split(' ').join('_');
                this.trackingFATitle(titleReplace);
              } else {
                this.successRequest.next(false);
                this.exception.next(true);
              }
              //console.log('Abstracts Hide loader...', this.loaderServiceService.isLoading);
            });
          },
        });
    });
  }

  retry(retryID: any) {
    setTimeout(() => {
      console.warn('***  retry - intents: ' + this.intents);
      if (this.intents <= 1) {
        console.warn('***  retry - getInfomationByTypeDeeplink()...');
        this.getInfomationByTypeDeeplink(retryID);
      } else {
        this.exception.next(true);
      }
    }, 500);
  }

  trackingFATitle(title: string) {
    const titleReplace = title.split(' ').join('_');
    console.log('Resumen abstrac', { title: titleReplace });
    this.fa.trackingFATitle(titleReplace);
  }


  addTrackingActivity() {
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
      ElectronicId: this.electronicId,
      EntityId: InfoEntities.Abstracts,
      EventId: null,
      Label: 'Abstract - Deeplink',
      LabelValue: this.mTitle,
      SearchAddressIP: null,
      SearchLatitude: latitude,
      SearchLongitude: longitude,
      SearchText: null,
      SearchTypeId: SearchType.parametrizado,
      SourceId: this.globalVars.getInfoTrackingSource()
    };
    this.trackingEngineService.addInfoTracking(data);
    console.log('TrackingActivity Abstract DL', data);
  }
}
