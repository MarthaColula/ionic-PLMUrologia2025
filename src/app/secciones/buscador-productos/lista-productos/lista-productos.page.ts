import { Component, OnInit } from '@angular/core';
import {
  PlmPharmaSearchEngineService,
  AutocompleteService,
  ControllersIonicService
} from '../../../services/indexServices';
import { AlertController } from '@ionic/angular';
import { Router, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-lista-productos',
  templateUrl: './lista-productos.page.html',
  styleUrls: ['./lista-productos.page.scss'],
  standalone: false,
})
export class ListaProductosPage implements OnInit {

  productSelected: boolean;
  searchText: string;

  constructor(
    private router: Router,
    protected alertController: AlertController,
    protected autocompleteService: AutocompleteService,
    private controllersIonicService: ControllersIonicService,
    protected pharmaSearchEngine: PlmPharmaSearchEngineService
  ) { }

  ngOnInit() {
    console.log(this.pharmaSearchEngine.getDrugsResult);
    console.warn('***   getDrugsResult: ' + JSON.stringify(this.pharmaSearchEngine.getDrugsResult?.getValue()));
  }

  getResults(event: any) {
    if (event.key === 'Enter' && this.searchText !== undefined) {
      if (this.searchText.length >= 3) {
        this.pharmaSearchEngine.productsSearchText = this.searchText;
        this.router.navigateByUrl('/buscador');
      } else {
        this.controllersIonicService.presentToast('Ingrese un mínimo de 3 caracteres para continuar.');
      }
    }
  }

  ionViewWillEnter() {
    this.autocompleteService.closeAutocomplete();
  }

  ionViewDidLeave() {
    this.autocompleteService.closeAutocomplete();
  }

  productDetail(productInfo: any) {
    console.warn(productInfo);
    const navigationExtras: NavigationExtras = {
      state: { product: productInfo }
    };
    this.router.navigate(['ippa', productInfo.CategotyId,
      productInfo.DivisionId, productInfo.PharmaFormId, productInfo.ProductId], navigationExtras);
  }

}
