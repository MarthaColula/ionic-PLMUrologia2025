import { Component, OnInit, OnDestroy } from '@angular/core';
import { environment } from '../../../../environments/environment';
import {
  ControllersIonicService, AutocompleteService,
  PlmPharmaSearchEngineService
} from '../../../services/indexServices';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-lista-laboratorios',
  templateUrl: './lista-laboratorios.page.html',
  styleUrls: ['./lista-laboratorios.page.scss'],
  standalone: false,
})
export class ListaLaboratoriosPage implements OnInit, OnDestroy {

  searchText: string;
  getLabsResult: any;
  getLabsSub: Subscription;
  getDrugsByLabSub: Subscription;

  constructor(
    protected pharmaSearchEngine: PlmPharmaSearchEngineService,
    protected autocompleteService: AutocompleteService,
    protected controllersIonicService: ControllersIonicService,
    private router: Router) { }

  ngOnInit() {
    console.warn('***   getLabs()...');
    this.getLabs();
  }

  ngOnDestroy(): void {
    if (this.getLabsSub) {
      this.getLabsSub.unsubscribe();
    }
    if (this.getDrugsByLabSub) {
      this.getDrugsByLabSub.unsubscribe();
    }
  }

  ionViewWillEnter() {
    this.autocompleteService.closeAutocomplete();
  }

  ionViewDidLeave() {
    this.autocompleteService.closeAutocomplete();
  }

  getLabs() {
    this.controllersIonicService.showLoader().finally(() => {
      console.warn('***   productsSearchText: ' + this.pharmaSearchEngine.productsSearchText);
      this.getLabsSub =
        this.pharmaSearchEngine.getLabs(this.pharmaSearchEngine.productsSearchText, environment.applicationInfo.editionId)
          .subscribe({
            next: (data: any) => {
              console.warn('***   data: ' + JSON.stringify(data));
              this.getLabsResult = data.getLabsResult;
              this.controllersIonicService.hideLoader();
            },
            error: () => {
              this.controllersIonicService.hideLoader().finally(() => {
                this.controllersIonicService.presentAlert('Laboratorios', 'Error al recuperar laboratorios');
              });
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

  getDrugsByLab(labId: number) {
    this.controllersIonicService.showLoader()
      .finally(() => {
        this.getDrugsByLabSub =
          this.pharmaSearchEngine.getDrugsByLab(labId, environment.applicationInfo.editionId).subscribe({
            next: (data: any) => {
              this.pharmaSearchEngine.getDrugsResult.next(data.getDrugsByLabResult);
              this.controllersIonicService.hideLoader();
              this.router.navigateByUrl('/lista-productos');
            },
            error: () => {
              this.controllersIonicService.hideLoader().finally(() => {
                this.controllersIonicService.presentAlert('Laboratorios', 'Error al recuperar los productos asociados al laboratorio');
              });
            },
            complete: () => console.log('Successful getDrugsByLab')
          });
      });
  }

}
