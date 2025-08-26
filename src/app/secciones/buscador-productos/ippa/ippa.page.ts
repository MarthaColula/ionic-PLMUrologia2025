import { Component, OnInit, QueryList, ViewChildren, AfterViewInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { EasyAccordionComponent } from '../../../componentes/easy-accordion/easy-accordion.component';
import {
  ControllersIonicService,
  PlmTrackingEngineService,
  PlmPharmaSearchEngineService,
  GlobalvarsService,
} from '../../../services/indexServices';
import { Entities, ITrackingInfo, SearchType } from '../../../interfaces/models';
//import { FirebaseAnalyticsService } from '../../../services/firebase-analytics.service';
import { environment } from '../../../../environments/environment';
import { Subscription, of, Observable } from 'rxjs';
import { FavouritesService } from 'src/app/services/favourites.service';


@Component({
  selector: 'app-ippa',
  templateUrl: './ippa.page.html',
  styleUrls: ['./ippa.page.scss'],
  standalone: false,
})
export class IppaPage implements OnInit, OnDestroy, AfterViewInit {

  @ViewChildren(EasyAccordionComponent) accordionsQueryList: QueryList<EasyAccordionComponent>;

  private accordions: EasyAccordionComponent[];
  accordionChangeSub: Subscription;
  private getAllAttributesByProductSub: Subscription;
  protected attributes: any;
  protected productActiveSubstances = [];
  productActiveSubstances$: Observable<string>;
  protected productShot: string;
  protected brand: '';
  protected pharmaForm: '';
  product: any = {
    brand: '',
    categoryId: 0,
    categoryName: '',
    divisionId: 0,
    divisionName: '',
    productId: 0,
    pharmaFormId: 0,
    pharmaFormName: ''
  };
  protected showFavoriteProduct = false;
  productFromSearchEngine = false;
  protected intents = 0;

  
  constructor(
    private router: Router,
    private platform: Platform,
    private activatedRoute: ActivatedRoute,
    private globalVars: GlobalvarsService,
    private loadingService: ControllersIonicService,
    private controllersIonicService: ControllersIonicService,
    private pharmaSearchEngine: PlmPharmaSearchEngineService,
    private trackingEngineService: PlmTrackingEngineService,
    private favoriteService: FavouritesService,
    //private fa: FirebaseAnalyticsService
  ) {
    const params = this.router.getCurrentNavigation()?.extras.state;
    if (params) {
      console.warn('***  params: ' + JSON.stringify(params));
      if (params['product']) {
        this.productFromSearchEngine = true;
        this.product.brand = params['product']['Brand'];
        this.product.categoryId = params['product']['CategotyId'];
        this.product.categoryName = params['product']['CategoryName'];
        this.product.divisionId = params['product']['DivisionId'];
        this.product.divisionName = params['product']['DivisionName'];
        this.product.pharmaFormId = params['product']['PharmaFormId'];
        this.product.pharmaFormName = params['product']['PharmaForm'];
        this.product.productId = params['product']['ProductId'];
        this.showFavoriteProduct = true;
      } else if (params['favoriteProduct']) {
        this.product = params['favoriteProduct'];
        this.showFavoriteProduct = true;
        this.productFromSearchEngine = false;
      }
    } else {
      console.warn('***  snapshot-productId - params: ' + this.activatedRoute.snapshot.params);
      console.warn('***  snapshot-productId: ' + this.activatedRoute.snapshot.params['productId']);
      this.product.categoryId = this.activatedRoute.snapshot.params['categoryId'];
      this.product.divisionId = this.activatedRoute.snapshot.params['divisionId'];
      this.product.pharmaFormId = this.activatedRoute.snapshot.params['pharmaFormId'];
      this.product.productId = this.activatedRoute.snapshot.params['productId'];
      this.showFavoriteProduct = true;
    }
    console.log('this.product', this.product)
  }

  ngOnInit() {
    console.warn('***  ngOnInit  ***');
    this.platform.ready()
      .then(() => {
        console.warn('***  getProductDetail()...');
        this.getProductDetail();
      });
  }

  ngOnDestroy(): void {
    if (this.getAllAttributesByProductSub) {
      this.getAllAttributesByProductSub.unsubscribe();
    }
  }

  getProductDetail() {
    console.warn('***  getProductDetail  ***');
    this.loadingService.showLoader().finally(() => {
      console.warn('***  codeString: ' + this.globalVars.getClientInfoValue().codeString);
      console.warn('*** pharmaSearchEngine.getAllAttributesByProduct()...');
      this.getAllAttributesByProductSub =
        // tslint:disable-next-line: max-line-length
        this.pharmaSearchEngine.getAllAttributesByProduct(this.product.divisionId, this.product.categoryId, this.product.productId, this.product.pharmaFormId, environment.applicationInfo.editionId).subscribe({
          next: (data: any) => {
            console.log('getPrdocutDetail - data', data)
            this.pharmaSearchEngine.getAllAttributesByProductResult.next(data.getAllAttributesByProductResult);
            if (this.pharmaSearchEngine.getAllAttributesByProductResult.getValue()) {
              this.productActiveSubstances =
                this.pharmaSearchEngine.getAllAttributesByProductResult.getValue().Substances;

              console.log("productActiveSubstances", this.productActiveSubstances);
              /*for (const substance of this.pharmaSearchEngine.getAllAttributesByProductResult.getValue().Substances) {
                if (this.productActiveSubstances !== '') {
                  this.productActiveSubstances = this.productActiveSubstances + ', ';
                }
                this.productActiveSubstances = this.productActiveSubstances + substance.Description;
              }
              this.productActiveSubstances$ = of(this.productActiveSubstances); */
              this.attributes = this.pharmaSearchEngine.getAllAttributesByProductResult.getValue().Attributes;
              this.brand = this.pharmaSearchEngine.getAllAttributesByProductResult.getValue().Brand;
              this.pharmaForm = this.pharmaSearchEngine.getAllAttributesByProductResult.getValue().PharmaForm;
              this.productShot = this.pharmaSearchEngine.getAllAttributesByProductResult.getValue().BaseUrl
                + this.pharmaSearchEngine.getAllAttributesByProductResult.getValue().ProductShot;
              console.warn('*** productShot: ' + this.productShot);
            }
            if (this.product.divisionName === '') {
              this.product.divisionName = this.pharmaSearchEngine.getAllAttributesByProductResult.getValue().DivisionName;
            }
            if (this.product.brand === '') {
              this.product.brand = this.brand;
            }
            if (this.product.pharmaFormName === '') {
              this.product.pharmaFormName = this.pharmaForm;
            }
            if (this.product.categoryName === '') {
              this.product.categoryName = this.pharmaSearchEngine.getAllAttributesByProductResult.getValue().CategoryName;
            }
          },
          error: () => {
            this.loadingService.hideLoader().finally(() => {
              if (this.intents < 1) {
                this.intents++;
                this.retry();
              } else {
                this.loadingService.presentAlert('Medicamentos', 'Error al recuperar detalle del medicamento');
              }
            });
          },
          complete: () => {
            this.loadingService.hideLoader().finally(() => {
              this.loadingService.hideLoader();
              this.addTrackingSectionAndEvent(this.product.categoryId + '/' + this.product.divisionId + '/' + this.product.pharmaFormId + '/' + this.product.productId);
            });
          }
        });
    });
  }

  retry() {
    setTimeout(() => {
      console.warn('***  retry - intents: ' + this.intents);
      if (this.intents <= 1) {
        console.warn('***  retry - getProductDetail()...');
        this.getProductDetail();
      } else {
        this.loadingService.presentAlert('Medicamentos', 'Error al recuperar detalle del medicamento');
      }
    }, 500);
  }

  ngAfterViewInit(): void {
    //this.deepLinksService.deeplinksSubscribe();
    this.accordions = this.accordionsQueryList.toArray();
    this.accordionChangeSub =
      this.accordionsQueryList.changes.subscribe(() => {
        this.accordions = this.accordionsQueryList.toArray();
      });
  }

  ionViewWillEnter() {
    this.productActiveSubstances = [];
  }

  captureName(event: any): void {
    this.accordions.forEach((item) => {
      if (item['isMenuOpen']) {
        item['isMenuOpen'] = false;
      }
    });
    this.addTrackingActivity(event);
  }

  addTrackingActivity(informationToTrack: any) {
    console.log('addTrackingActivity - electronicInformation', informationToTrack);
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
    const data: ITrackingInfo = {
      AttributeGroupId: informationToTrack.AttributeId,
      CategoryId: informationToTrack.CategoryId,
      CodeString: this.globalVars.getClientInfoValue().codeString,
      Date: '\/Date(' + today.toString() + '+0200)\/',
      DivisionId: informationToTrack.DivisionId,
      EditionId: environment.applicationInfo.editionId,
      EntityId: Entities.ContenidoporAtributo,
      PharmaFormId: informationToTrack.PharmaFormId,
      ProductId: informationToTrack.ProductId,
      SearchAddressIP: ip,
      SearchLatitude: latitude,
      SearchLongitude: longitude,
      SearchText: '',
      SearchTypeId: SearchType.parametrizado,
      SourceId: this.globalVars.getInfoTrackingSource()
    };
    this.trackingEngineService.addPLMTrackingActivity(data);
    console.log('addTrackingActivity IPPA - DATA', data);
  }

  async addTrackingSectionAndEvent(nameEvent?: string) {
    this.trackingEngineService.addTrackingBySection('Ippa', nameEvent, this.globalVars);
    console.warn(this.router.getCurrentNavigation);
    //this.fa.trackingFATitle(this.router.url);
  }

  trackingFATitle(title: string) {
    const titleReplace = title.split(' ').join('_');
    console.log({ title: titleReplace });
    //this.fa.trackingFATitle(titleReplace);
  }


  addProductFavourite(product: any) {
    console.log('AddFavourite', product);
    this.favoriteService.addProduct(product.categoryId, product.categoryName,
      product.divisionId, product.divisionName, product.productId, product.brand,
      product.pharmaFormId, product.pharmaFormName, environment.applicationInfo.countryKey).then()
      .catch(() => {
        this.controllersIonicService.presentAlert('Favoritos', 'Error al agregar a favoritos');
      });
  }

  removeProductFavourite(product: any) {
    console.log('RemoveFavourite', product);
    this.favoriteService.removeProduct(product.categoryId, product.categoryName,
      product.divisionId, product.divisionName, product.productId, product.brand,
      product.pharmaFormId, product.pharmaFormName, environment.applicationInfo.countryKey).then()
      .catch(() => {
        this.controllersIonicService.presentAlert('Favoritos', 'Error al eliminar de favoritos');
      });
  }

  checkFavoriteProduct(product: any) {
    return this.favoriteService.checkProduct(product.categoryId, product.categoryName, product.divisionId,
      product.divisionName, product.productId, product.brand,
      product.pharmaFormId, product.pharmaFormName, environment.applicationInfo.countryKey);
  }

}
