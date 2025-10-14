import { Component, OnInit, OnDestroy, ViewChild, ElementRef, HostListener } from '@angular/core';
import {
  MetadataEngineService, ControllersIonicService, ConnectionService,
  PlmTrackingEngineService, GlobalvarsService, InAppBrowserService, AutocompleteService,
} from '../../../services/indexServices';
import { InfoEntities, SearchType, IInfoTracking } from '../../../interfaces/models';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Router } from '@angular/router';



@Component({
  selector: 'app-pubmed',
  templateUrl: './pubmed.page.html',
  styleUrls: ['./pubmed.page.scss'],
  standalone: false,
})
export class PubmedPage implements OnInit , OnDestroy {

  @ViewChild('SearchBar', { static: false }) searchBar: ElementRef;
  
  @HostListener('click', ['$event', '$event.target']) onClick(event: any, target: any) {
    console.warn('HostListener: ', event);
    console.warn('HostListener: ', target);
    this.validateSearchIcon(event);
  }

  iconSrchX: any;
  iconSrchY: any;
  iconSrchR2: any;
  
  successRequest = new BehaviorSubject<boolean>(false);
  scientificArticlesSub: Subscription;
  searchText: string;

  showBanner: boolean;
  closeBanner : boolean;

  constructor(
    private router: Router,
    private globalVars: GlobalvarsService,
    private iabService: InAppBrowserService,
    private connectionService: ConnectionService,
    protected autocompleteService: AutocompleteService,
    protected metadataEngineService: MetadataEngineService,
    private trackingEngineService: PlmTrackingEngineService,
    private controllersIonicService: ControllersIonicService,
  ) {
  }

  ngOnInit() {
    this.addTrackingSectionAndEvent();
  }

  ngOnDestroy() {
    if (this.scientificArticlesSub) {
      this.scientificArticlesSub.unsubscribe();
    }
  }

  ngAfterViewInit(): void {
  }

  autoComplete(item: any) {
    this.autocompleteService.closeAutocomplete();
    this.metadataEngineService.searchText = item.EnglishDescription;
    this.getScientificArticles();
  }

  getResults(event: any) {
    console.log(event);
    if (event.key === 'Enter' && this.metadataEngineService.searchText !== undefined) {
      this.searchResults();
    }
  }

  searchResults() {
    console.warn('***  searchResults  ***');
    if (this.metadataEngineService.searchText && this.metadataEngineService.searchText.length > 0) {
      this.getScientificArticles();
    }
  }

  ionViewWillEnter() {
    console.log('***  ionViewWillEnter  ***');
    this.autocompleteService.checkData(true);

    this.showBanner = true;
  }
  
  ionViewDidEnter() {
    console.log('***  ionViewDidEnter  ***');
    console.warn({searchBar: this.searchBar});
    //const searchIcon: HTMLElement = this.searchBar.nativeElement.querySelector('.searchbar-search-icon');
    const searchIcon = document.querySelector('.searchbar-search-icon');
    if(searchIcon != undefined) {
      console.warn({searchIcon: searchIcon});
      this.iconSrchX = (searchIcon.clientHeight/2);
      this.iconSrchY = (searchIcon.clientWidth/2);
      const iconSrchR = Math.trunc(((this.iconSrchX+this.iconSrchY)/2)*0.8);
      console.log('***  iconSrchR: ' + iconSrchR);
      this.iconSrchR2 = Math.pow(iconSrchR,2);
      console.log('***  iconSrchX: '+ this.iconSrchX +', iconSrchY: '+ this.iconSrchY);
      //searchIcon.addEventListener('click', function(event) { console.warn(event);});
      //searchIcon.addEventListener('click', (event) => {console.warn(event);}, false);
      //this.renderer.listen(searchIcon, 'click' , (event) => { console.log(event); });
    }
  }
  
  ionViewDidLeave() {
    console.log('***  ionViewDidLeave  ***');
    this.metadataEngineService.searchText = '';

    this.showBanner = false;
  }

  validateSearchIcon(event: any) {
    console.log('***  validateSearchIcon  ***');
    const px = event.layerX;
    const py = event.layerY;
    console.log('***  px: '+ px +', py: '+ py);
    const x2 = Math.pow((px-this.iconSrchX),2);
    const y2 = Math.pow((py-this.iconSrchX),2);
    console.log('***  iconSrchR2: ' + this.iconSrchR2);
    if (x2+y2 <= this.iconSrchR2) {
      console.warn('***  isInsideCircle  ***');
      this.searchResults();
    }
  }

  getScientificArticles() {
    this.successRequest.next(false);
    if (this.scientificArticlesSub) {
      this.scientificArticlesSub.unsubscribe();
    }
    this.controllersIonicService.showLoader().finally(() => {
      this.scientificArticlesSub =
        this.metadataEngineService.getScientificArticlesRequest().subscribe({
          next: data => {
            this.searchText = this.metadataEngineService.searchText;
            this.metadataEngineService.searchText = '';
            if (data.getScientificArticlesResult.length > 0) {
              this.metadataEngineService.scientificArticleResult.next(data.getScientificArticlesResult);
            } else {
              this.metadataEngineService.scientificArticleResult.next([]);
            }
            this.successRequest.next(true);
          },
          error: ex => {
            console.log(ex);
            this.successRequest.next(true);
            this.metadataEngineService.scientificArticleResult.next([]);
            this.searchText = this.metadataEngineService.searchText;
            this.metadataEngineService.searchText = '';
            this.controllersIonicService.hideLoader().finally();
          },
          complete: () => {
            this.controllersIonicService.hideLoader().finally(() => {
              console.log('complete');
            });
          }
        });
    });
  }

  openArticle(electronicInformation: any) {
    if (this.connectionService.isConnected()) {
      this.addTrackingActivity(electronicInformation);
      this.iabService.open(electronicInformation.URL + electronicInformation.Linkpubmed, '_system');
    } else {
      this.connectionService.displayWarningMsg('PubMed');
    }
  }

  bannerClose(event){
    console.log({close: event});
    this.closeBanner = event;
  }

  addTrackingActivity(electronicInformation: any) {
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
      EntityId: InfoEntities.PubMed,
      Label: 'PubMed',
      LabelValue: electronicInformation.Title.trim(),
      SearchAddressIP: ip,
      SearchLatitude: latitude,
      SearchLongitude: longitude,
      SearchText: '',
      SearchTypeId: SearchType.parametrizado,
      SourceId: this.globalVars.getInfoTrackingSource()
    };
    this.trackingEngineService.addInfoTracking(data);
    console.log({ trackingPubMed: data });
  }

  addTrackingSectionAndEvent(nameEvent?: string) {
    console.log('addTrackingSectionAndEvent Pubmed');
    this.trackingEngineService.addTrackingBySection("Pubmed", nameEvent, this.globalVars);
  }
}
