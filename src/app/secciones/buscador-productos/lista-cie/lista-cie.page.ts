import { Component, OnInit, OnDestroy } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { AutocompleteService, ControllersIonicService, PlmPharmaSearchEngineService } from '../../../services/indexServices';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-lista-cie',
  templateUrl: './lista-cie.page.html',
  styleUrls: ['./lista-cie.page.scss'],
  standalone: false,
})

export class ListaCiePage implements OnInit, OnDestroy {

  getICD11ByTextResult: any;
  searchText: string;
  drugsByICDSub: Subscription;
  ICDByTextSub: Subscription;

  constructor(
    protected pharmaSearchEngine: PlmPharmaSearchEngineService,
    protected autocompleteService: AutocompleteService,
    protected controllersIonicService: ControllersIonicService,
    private router: Router) { }

  ngOnInit() {
    console.warn('***   getICD11()...');
    this.getICD();
  }

  ngOnDestroy(): void {
    if (this.ICDByTextSub) {
      this.ICDByTextSub.unsubscribe();
    }
    if (this.drugsByICDSub) {
      this.drugsByICDSub.unsubscribe();
    }
  }

  getICD() {
    if (this.ICDByTextSub) {
      this.ICDByTextSub.unsubscribe();
    }
    this.controllersIonicService.showLoader().finally(() => {
      console.warn('***   productsSearchText: ' + this.pharmaSearchEngine.productsSearchText);
      this.ICDByTextSub =
        this.pharmaSearchEngine.getICDByText(this.pharmaSearchEngine.productsSearchText, environment.applicationInfo.editionId)
          .subscribe({
          next: (data: any) => {
            console.warn('***   data: ' + JSON.stringify(data));
            this.getICD11ByTextResult = data.getICD11ByTextResult;
          },
          error: () => {
            this.controllersIonicService.hideLoader().finally(() => {
              this.controllersIonicService.presentAlert('CIE-11', 'Error al recuperar CIE-11');
            });
          },
          complete: () => {
            console.log('successful getICDByText');
            this.controllersIonicService.hideLoader();
          }
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

  getDrugsByICD(icdId: number) {
    if (this.drugsByICDSub) {
      this.drugsByICDSub.unsubscribe();
    }
    this.controllersIonicService.showLoader()
      .finally(() => {
        this.drugsByICDSub =
          this.pharmaSearchEngine.getDrugsByICD(icdId, environment.applicationInfo.editionId).subscribe({
            next: (data: any) => {
              console.warn(data.getDrugsByICDResult);
              this.pharmaSearchEngine.getDrugsResult.next(data.getDrugsByICD11Result);
              this.controllersIonicService.hideLoader();
              this.router.navigateByUrl('/lista-productos');
            },
            error: ex => {
              this.controllersIonicService.hideLoader().finally(() => {
                this.controllersIonicService.presentAlert('CIE-11', 'Error al recuperar los productos asociados al CIE-11');
              });
            },
            complete: () => console.log('successful getDrugsByICD')
          });
      });
  }

  ionViewWillEnter() {
    this.autocompleteService.closeAutocomplete();
  }

  ionViewDidLeave() {
    this.autocompleteService.closeAutocomplete();
  }

}
