import { Component, OnInit, OnDestroy } from "@angular/core";
import { environment } from "src/environments/environment";
import {
  ControllersIonicService,
  PlmPharmaSearchEngineService,
  PlmTrackingEngineService
} from "src/app/services/indexServices";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";

@Component({
  selector: 'app-interaction-labs',
  templateUrl: './interaction-labs.page.html',
  styleUrls: ['./interaction-labs.page.scss'],
  standalone: false,
})
export class InteractionLabsPage implements OnInit, OnDestroy {

  searchText: string;
  labsSub: Subscription;
  drugsByLab: Subscription;
  getLabsResult: any;

  constructor(
    private router: Router,
    public pharmaSearchEngine: PlmPharmaSearchEngineService,
    public controllersIonicService: ControllersIonicService,
    private plmTrackingEngineService: PlmTrackingEngineService
  ) { }

  ngOnInit() {
    this.getLabs();
  }

  ngOnDestroy(): void {
    if (this.labsSub) {
      this.labsSub.unsubscribe();
    }
    if (this.drugsByLab) {
      this.drugsByLab.unsubscribe();
    }
  }

  getLabs() {
    if (this.labsSub) {
      this.labsSub.unsubscribe();
    }
    this.controllersIonicService.showLoader().finally(() => {
      this.labsSub =
        // tslint:disable-next-line:max-line-length
        this.pharmaSearchEngine
          .getLabs(
            this.pharmaSearchEngine.interactionsSearchText,
            environment.applicationInfo.interactionsEdition
          )
          .subscribe({
            next: (data: any) => {
              this.getLabsResult = data.getLabsResult;
            },
            error: () => {
              this.controllersIonicService.hideLoader().finally(() => {
                this.controllersIonicService.presentAlert(
                  "Laboratorios",
                  "Error al recuperar laboratorios"
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

  getDrugsByLab(labId: number) {
    if (this.drugsByLab) {
      this.drugsByLab.unsubscribe();
    }
    this.controllersIonicService.showLoader().finally(() => {
      this.drugsByLab = this.pharmaSearchEngine
        .getDrugsByLab(labId, environment.applicationInfo.interactionsEdition)
        .subscribe({
          next: (data: any) => {
            this.pharmaSearchEngine.getDrugsResult.next(
              data.getDrugsByLabResult
            );
            this.router.navigateByUrl("/interaction-products");
          },
          error: () => this.controllersIonicService.hideLoader(),
          complete: () => this.controllersIonicService.hideLoader(),
        });
    });
  }

  async addTrackingSectionAndEvent(nameEvent?: string) {
    this.plmTrackingEngineService.addTrackingBySection('Interacciones-Laboratorios', nameEvent);
  }

}
