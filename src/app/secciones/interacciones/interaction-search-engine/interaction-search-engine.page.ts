import { Component, OnInit, OnDestroy } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { GlobalvarsService, PlmPharmaSearchEngineService, ControllersIonicService } from './../../../services/indexServices';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-interaction-search-engine',
  templateUrl: './interaction-search-engine.page.html',
  styleUrls: ['./interaction-search-engine.page.scss'],
  standalone: false,
})
export class InteractionSearchEnginePage implements OnInit, OnDestroy {

  searchText: string;
  title: any;
  getResultsSub: Subscription;
  getDrugsSub: Subscription;
  backup: string;

  constructor(
    public pharmaSearchEngine: PlmPharmaSearchEngineService,
    private controllersIonicService: ControllersIonicService,
    public globalVars: GlobalvarsService,
    public router: Router) {
    const params = this.router.getCurrentNavigation()?.extras.state;
    if (params) {
      this.title = params.title;
    } else {
      this.title = 'Interacciones medicamentosas';
    }
  }

  ngOnInit() { }

  ionViewWillEnter() {
    if (this.pharmaSearchEngine.getResultsv2Result) {
      if (this.pharmaSearchEngine.interactionsSearchText !== undefined && this.backup !== undefined) {
        if (this.backup !== this.pharmaSearchEngine.interactionsSearchText) {
          this.backup = this.pharmaSearchEngine.interactionsSearchText;
          this.getResultsService();
        }
      }
    }
  }

  ngOnDestroy() {
    this.pharmaSearchEngine.interactionsSearchText = '';
    this.pharmaSearchEngine.getResultsv2Result.next(null);
    if (this.globalVars.interactionType === 'mealInteraction') {
      this.pharmaSearchEngine.interactionsSearchText = undefined;
    }
    if (this.getResultsSub) {
      this.getResultsSub.unsubscribe();
    }
    if (this.getDrugsSub) {
      this.getDrugsSub.unsubscribe();
    }
  }

  getResults(event: any) {
    if (event.key === 'Enter' && this.searchText !== undefined) {
      if (this.searchText.length >= 3) {
        this.backup = this.searchText;
        this.pharmaSearchEngine.interactionsSearchText = this.searchText;
        this.getResultsService();
      } else {
        this.controllersIonicService.presentToast('Ingrese un mínimo de 3 caracteres para continuar.');
      }
    }
  }

  getResultsService() {
    this.searchText = undefined;
    if (this.getResultsSub) {
      this.getResultsSub.unsubscribe();
    }
    this.controllersIonicService.showLoader().finally(() => {
      this.getResultsSub =
        // tslint:disable-next-line:max-line-length
        this.pharmaSearchEngine.getResultsService(this.pharmaSearchEngine.interactionsSearchText, environment.applicationInfo.interactionsEdition).subscribe({
          next: (data: any) => {
            this.pharmaSearchEngine.getResultsv2Result.next(data.getResultsv2Result);
          },
          error: () => {
            this.controllersIonicService.hideLoader().finally(() => {
              this.controllersIonicService.presentAlert('Sustancias', 'Error al recuperar sustancias');
            });
          },
          complete: () => {
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
          // tslint:disable-next-line:max-line-length
          this.pharmaSearchEngine.getDrugs(this.pharmaSearchEngine.interactionsSearchText, environment.applicationInfo.interactionsEdition).subscribe({
            next: (data: any) => {
              this.pharmaSearchEngine.getDrugsResult.next(data.getDrugsResult);
              this.router.navigateByUrl('/interaction-products');
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
        this.router.navigateByUrl('/interaction-substances');
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
        this.router.navigateByUrl('/interaction-labs');
      } else {
        this.emptyResult();
      }
    } else {
      this.doit();
    }
  }

  getICD() {
    const results: any = this.pharmaSearchEngine.getResultsv2Result.getValue();
    console.log('resultsICD', results);
    if (results) {
      if (results.ICD11 > 0) {
        this.router.navigateByUrl('/interaction-icd');
      } else {
        this.emptyResult();
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

}
