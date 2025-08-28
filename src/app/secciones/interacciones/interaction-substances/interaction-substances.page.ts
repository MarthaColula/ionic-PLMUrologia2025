import { Component, OnInit, OnDestroy } from "@angular/core";
import { environment } from "src/environments/environment";
import {
  ControllersIonicService,
  GlobalvarsService,
  PlmPharmaSearchEngineService,
  PlmTrackingEngineService
} from "src/app/services/indexServices";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";

@Component({
  selector: 'app-interaction-substances',
  templateUrl: './interaction-substances.page.html',
  styleUrls: ['./interaction-substances.page.scss'],
  standalone: false,
})
export class InteractionSubstancesPage implements OnInit, OnDestroy {

  searchText: string;
  getSubstancesResult: any;
  getSubstancesSub: Subscription;
  getDrugsBySubstanceSub: Subscription;

  constructor(
    private router: Router,
    public globalVarService: GlobalvarsService,
    public pharmaSearchEngine: PlmPharmaSearchEngineService,
    private controllersIonicService: ControllersIonicService,
    private plmTrackingEngineService: PlmTrackingEngineService
  ) { }

  ngOnInit() {
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

  getSubstances() {
    if (this.getSubstancesSub) {
      this.getSubstancesSub.unsubscribe();
    }
    this.controllersIonicService.showLoader().finally(() => {
      this.getSubstancesSub =
        // tslint:disable-next-line:max-line-length
        this.pharmaSearchEngine
          .getSubstances(
            this.pharmaSearchEngine.interactionsSearchText,
            environment.applicationInfo.interactionsEdition
          )
          .subscribe({
            next: (data: any) => {
              this.getSubstancesResult = data.getSubstancesResult;
            },
            error: () => {
              this.controllersIonicService.hideLoader().finally(() => {
                this.controllersIonicService.presentAlert(
                  "Sustancias",
                  "Error al recuperar sustancias"
                );
              });
            },
            complete: () => this.controllersIonicService.hideLoader(),
          });
    });
  }

  getResults(event: any) {
    if (event.key === "Enter" && this.searchText !== undefined) {
      if (this.searchText.length >= 3) {
        this.pharmaSearchEngine.interactionsSearchText = this.searchText;
        this.router.navigateByUrl("/interaction-search-engine");
      } else {
        this.controllersIonicService.presentToast(
          "Ingrese un mínimo de 3 caracteres para continuar."
        );
      }
    }
  }

  getDrugsBySubstance(activeSubstanceId: number) {
    if (this.getDrugsBySubstanceSub) {
      this.getDrugsBySubstanceSub.unsubscribe();
    }
    this.controllersIonicService.showLoader().finally(() => {
      this.getDrugsBySubstanceSub = this.pharmaSearchEngine
        .getDrugsBySubstance(
          activeSubstanceId,
          environment.applicationInfo.interactionsEdition
        )
        .subscribe({
          next: (data: any) => {
            this.pharmaSearchEngine.getDrugsResult.next(
              data.getDrugsBySubstanceResult
            );
            this.router.navigateByUrl("/interaction-products");
          },
          error: () => {
            this.controllersIonicService.hideLoader().finally(() => {
              this.controllersIonicService.presentAlert(
                "Sustancias",
                "Error al recuperar Sustancias"
              );
            });
          },
          complete: () => {
            this.controllersIonicService.hideLoader();
          },
        });
    });
  }

  async addTrackingSectionAndEvent(nameEvent?: string) {
    this.plmTrackingEngineService.addTrackingBySection('Interacciones-Sustancias', nameEvent);
  }

}
