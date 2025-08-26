import { Component, OnInit, OnDestroy } from '@angular/core';
import { environment } from '../../../../environments/environment';
import {
  PlmPharmaSearchEngineService,
  ControllersIonicService,
  AutocompleteService
} from '../../../services/indexServices';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-lista-sustancias',
  templateUrl: './lista-sustancias.page.html',
  styleUrls: ['./lista-sustancias.page.scss'],
  standalone: false,
})
export class ListaSustanciasPage implements OnInit, OnDestroy {

  getSubstancesResult: any;
  searchText: string;
  getSubstancesSub: Subscription;
  getDrugsBySubstanceSub: Subscription;

  constructor(
    private controllersIonicService: ControllersIonicService,
    protected autocompleteService: AutocompleteService,
    protected pharmaSearchEngine: PlmPharmaSearchEngineService,
    private router: Router) { }

  ngOnInit() {
    console.warn('***   getSubstances()...');
    this.getSubstances();
  }

  ngOnDestroy(): void {
    if (this.getSubstancesSub) {
      this.getSubstancesSub.unsubscribe();
    }
    if (this.getDrugsBySubstanceSub) {
      this.getDrugsBySubstanceSub.unsubscribe();
    }
  }

  ionViewWillEnter() {
    this.autocompleteService.closeAutocomplete();
  }

  ionViewDidLeave() {
    this.autocompleteService.closeAutocomplete();
  }

  getSubstances() {
    this.controllersIonicService.showLoader().finally(() => {
      console.warn('***   productsSearchText: ' + this.pharmaSearchEngine.productsSearchText);
      this.getSubstancesSub =
        this.pharmaSearchEngine.getSubstances(this.pharmaSearchEngine.productsSearchText, environment.applicationInfo.editionId)
          .subscribe({
            next: (data: any) => {
              console.warn('***   data: ' + JSON.stringify(data));
              this.getSubstancesResult = data.getSubstancesResult;
              this.controllersIonicService.hideLoader();
            },
            error: () => {
              this.controllersIonicService.hideLoader();
              this.controllersIonicService.presentAlert('Sustancias', 'Error al recuperar sustancias');
            },
            complete: () => console.log('Successful getLabs')
          });
    });
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

  getDrugsBySubstance(activeSubstanceId: number) {
    this.controllersIonicService.showLoader().finally(() => {
      this.getDrugsBySubstanceSub =
        this.pharmaSearchEngine.getDrugsBySubstance(activeSubstanceId, environment.applicationInfo.editionId).subscribe({
          next: (data: any) => {
            this.pharmaSearchEngine.getDrugsResult.next(data.getDrugsBySubstanceResult);
            this.controllersIonicService.hideLoader();
            this.router.navigateByUrl('/lista-productos');
          },
          error: () => {
            this.controllersIonicService.hideLoader().finally(() => {
              this.controllersIonicService.presentAlert('Sustancias', 'Error al recuperar los productos asociados a la sustancia.');
            });
          },
          complete: () => console.log('successful getDrugsBySubstance')
        });
    });
  }

}
