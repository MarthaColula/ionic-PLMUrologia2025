import { Component, OnInit } from '@angular/core';
import { SearchType, InfoEntities, IInfoTracking } from 'src/app/interfaces/models';
import { environment } from 'src/environments/environment';
import { GlobalvarsService, PlmTrackingEngineService } from 'src/app/services/indexServices';
import { NavigationExtras, Router } from '@angular/router';

import { ProductInfo } from 'src/app/interfaces/models';
import { FavouritesService } from 'src/app/services/favourites.service';


@Component({
  selector: 'app-favoritos',
  templateUrl: './favoritos.page.html',
  styleUrls: ['./favoritos.page.scss'],
  standalone: false,
})
export class FavoritosPage implements OnInit {

  public nameApp = '';
   showBanner!: boolean;
  closeBanner : boolean;

  constructor(
    public favoritesService: FavouritesService,
    private router: Router,
    private trackingEngineService: PlmTrackingEngineService,
    private globalVars: GlobalvarsService
  ) { }

  ngOnInit() {
    this.nameApp = environment.applicationInfo.name;
  }

   ionViewDidLeave() {
    this.showBanner = false;
  }

  ionViewWillEnter() {
    this.addTrackingSectionAndEvent();
    this.showBanner = true;
  }

  async addTrackingSectionAndEvent(nameEvent?: string) {
    console.log('addTrackingSectionAndEvent - Buscador')
    this.trackingEngineService.addTrackingBySection("Buscador", nameEvent, this.globalVars);
  }
  
  /*detailDrug(drug) {
    console.log('product: ', drug);
    this.addTrackingActivity();

    this.router.navigate(['/ippa', drug.categoryId, drug.divisionId, drug.pharmaFormId, drug.productId]);
  }*/

  detailDrug(drug: ProductInfo) {
    const navigationExtras: NavigationExtras = {
      state: { favoriteProduct: drug }
    };
    this.router.navigate(['ippa', drug.categoryId, drug.divisionId, drug.pharmaFormId, drug.productId], navigationExtras);
    console.log('navigationExtras', navigationExtras);
  }


   bannerClose(event){
    console.log({close: event});
    this.closeBanner = event;
  }

/*  this.addTrackingActivity();
  addTrackingActivity() {

    const today = new Date().getTime();

    console.warn(today);

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
      BranchId: environment.applicationInfo.branchId,
      CodeString: environment.applicationInfo.prefix,
      Date: '\/Date(' + today.toString() + '+0200)\/',
      ElectronicId: null,
      EntityId: InfoEntities.Atlas,
      EventId: null,
      Label: 'Favoritos',
      LabelValue: '',       // falta info   this.infoDataInput.Title,
      SearchAddressIP: null,
      SearchLatitude: latitude,
      SearchLongitude: longitude,
      SearchText: null,
      SearchTypeId: SearchType.parametrizado,
      SourceId: this.globalVars.getInfoTrackingSource()
    };
    console.warn(data);

    this.trackingEngineService.addInfoTracking(data);
  }
  */

}
