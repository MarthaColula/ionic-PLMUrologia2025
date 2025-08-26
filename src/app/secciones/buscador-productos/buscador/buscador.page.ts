import { Component, OnInit, ElementRef, ViewChild, Renderer2, OnDestroy } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';
import {
  AutocompleteService,
  ControllersIonicService,
  GlobalvarsService,
  PlmPharmaSearchEngineService,
  PlmTrackingEngineService,
  UserStorageService
} from '../../../services/indexServices';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-buscador',
  templateUrl: './buscador.page.html',
  styleUrls: ['./buscador.page.scss'],
  standalone: false,
})
export class BuscadorPage implements OnInit, OnDestroy {

  searchText: string;
  backup: string;
  showBanner: boolean;
  getResultsSub: Subscription;
  getDrugsSub: Subscription;

  closeBanner: boolean;

  constructor(
    protected router: Router,
    private render: Renderer2,
    protected globalVars: GlobalvarsService,
    protected autocompleteService: AutocompleteService,
    protected pharmaSearchEngine: PlmPharmaSearchEngineService,
    private controllersIonicService: ControllersIonicService,
    private trackingEngineService: PlmTrackingEngineService,
    private userStorageService: UserStorageService
  ) { }

  ionViewWillEnter() {
    console.warn('***   ionViewWillEnter   ***');
    this.addTrackingSectionAndEvent();
    this.autocompleteService.checkData(false);
    this.autocompleteService.showList.next(false);
    this.showBanner = true;
    if (this.pharmaSearchEngine.getResultsv2Result.getValue()) {
      if (this.pharmaSearchEngine.productsSearchText !== undefined && this.backup !== undefined) {
        if (this.backup !== this.pharmaSearchEngine.productsSearchText) {
          this.backup = this.pharmaSearchEngine.productsSearchText;
          this.getResultsService();
        }
      }
    }
  }

  ngOnInit() {
    const codestring = this.globalVars.getClientInfoValue().codeString;
    console.log('codestring', codestring);
  }

  ionViewDidLeave() {
    console.warn('***   ionViewDidLeave   ***');
    this.searchText = '';
    this.showBanner = false;
  }

  ngOnDestroy() {
    this.pharmaSearchEngine.productsSearchText = '';
    this.pharmaSearchEngine.getResultsv2Result.next(null);
    if (this.getResultsSub) {
      this.getResultsSub.unsubscribe();
    }
    if (this.getDrugsSub) {
      this.getDrugsSub.unsubscribe();
    }
  }

  getResults(event: any) {
    console.warn('***   getResults   ****');
    if (event.key === 'Enter' && this.searchText !== undefined) {
      console.warn('***   searchText: ' + this.searchText);
      if (this.searchText.length >= 3) {
        this.backup = this.searchText;
        this.pharmaSearchEngine.productsSearchText = this.searchText;
        this.getResultsService();
      } else {
        this.controllersIonicService.presentToast('Para continuar, ingrese un mínimo de 3 caracteres ');
      }
    }
  }

  getResultsService() {
    this.searchText = '';
    if (this.getResultsSub) {
      this.getResultsSub.unsubscribe();
    }
    this.controllersIonicService.showLoader().finally(() => {
      this.getResultsSub =
        this.pharmaSearchEngine.getResultsService(this.pharmaSearchEngine.productsSearchText, environment.applicationInfo.editionId)
          .subscribe({
            next: (data: any) => {
              console.log('>>>>> DATA BUSCADOR <<<<<', data);
              this.pharmaSearchEngine.getResultsv2Result.next(data.getResultsv2Result);
            },
            error: (ex: any) => {
              console.log(ex);
              this.controllersIonicService.hideLoader().finally(() => {
                this.autocompleteService.closeAutocomplete();
                this.controllersIonicService.presentAlert('Buscador', 'Error al recuperar resultados.');
              });
            },
            complete: () => {
              this.autocompleteService.closeAutocomplete();
              this.controllersIonicService.hideLoader();
            }
          });
    });
  }

  getDrugs() {
    if (this.getDrugsSub) {
      this.getDrugsSub.unsubscribe();
    }
    const results: any = this.pharmaSearchEngine.getResultsv2Result.getValue();
    if (results) {
      if (results.Products > 0) {
        this.controllersIonicService.showLoader().finally(() => {
          this.getDrugsSub =
            this.pharmaSearchEngine.getDrugs(this.pharmaSearchEngine.productsSearchText,
              environment.applicationInfo.editionId).subscribe({
                next: (data: any) => {
                  this.pharmaSearchEngine.getDrugsResult.next(data.getDrugsResult);
                  this.router.navigateByUrl('/lista-productos');
                },
                error: () => {
                  this.controllersIonicService.hideLoader().finally(() => {
                    this.controllersIonicService.presentAlert('Medicamentos', 'Error al recuperar resultados');
                  });
                },
                complete: () => {
                  this.controllersIonicService.hideLoader();
                }
              });
        });
      } else {
        this.emptyResult();
      }
    } else {
      this.doit();
    }
  }

  getSubstances() {
    const results: any = this.pharmaSearchEngine.getResultsv2Result.getValue();
    if (results) {
      if (results.Substances > 0) {
        this.router.navigateByUrl('/lista-sustancias');
      } else {
        this.emptyResult();
      }
    } else {
      this.doit();
    }
  }

  getLabs() {
    const results: any = this.pharmaSearchEngine.getResultsv2Result.getValue();
    if (results) {
      if (results.Labs > 0) {
        this.router.navigateByUrl('/lista-laboratorios');
      } else {
        this.emptyResult();
      }
    } else {
      this.doit();
    }
  }

  getICD() {
    const results: any = this.pharmaSearchEngine.getResultsv2Result.getValue();
    if (results) {
      if (results.ICD11 > 0) {
        this.router.navigateByUrl('/lista-cie');
      } else {
        this.controllersIonicService.presentToast('Su búsqueda,no generó resultados.');
      }
    } else {
      this.doit();
    }
  }

  private emptyResult() {
    this.controllersIonicService.presentToast('No hay resultados para su búsqueda!');
  }

  private doit() {
    this.controllersIonicService.presentToast('Realiza una busqueda antes de continuar.');
  }

  protected hideBanner() {
    console.warn('***   hideBanner   ****');
  }
  protected ShowBanner() {
    console.warn('***   hideBanner   ****');

  }

  async addTrackingSectionAndEvent(nameEvent?: string) {
    console.log('addTrackingSectionAndEvent - Buscador')
    this.trackingEngineService.addTrackingBySection("Buscador", nameEvent, this.globalVars);
  }

  bannerClose(event) {
    console.log({ close: event });
    console.log({ close: event });
    this.closeBanner = event;
  }

}
