import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { environment } from "src/environments/environment";
import {
  PlmPharmaSearchEngineService,
  ControllersIonicService,
  PlmTrackingEngineService
} from "src/app/services/indexServices";
import { Subscription } from "rxjs";

@Component({
  selector: 'app-interaction-icd',
  templateUrl: './interaction-icd.page.html',
  styleUrls: ['./interaction-icd.page.scss'],
  standalone: false,
})
export class InteractionIcdPage implements OnInit, OnDestroy {

  searchText: string;
  getICD11ByTextResult: any;
  drugsByICD11Sub: Subscription;
  ICD11ByTextSub: Subscription;

  constructor(
    private router: Router,
    public pharmaSearchEngine: PlmPharmaSearchEngineService,
    public controllersIonicService: ControllersIonicService,
    private plmTrackingEngineService: PlmTrackingEngineService
  ) { }

  ngOnInit() {
    this.addTrackingSectionAndEvent();
    this.getICD();
  }

  ngOnDestroy(): void {
    if (this.ICD11ByTextSub) {
      this.ICD11ByTextSub.unsubscribe();
    }
    if (this.drugsByICD11Sub) {
      this.drugsByICD11Sub.unsubscribe();
    }
  }

  getICD() {
    if (this.ICD11ByTextSub) {
      this.ICD11ByTextSub.unsubscribe();
    }
    this.controllersIonicService.showLoader().finally(() => {
      this.ICD11ByTextSub =
        // tslint:disable-next-line: max-line-length
        this.pharmaSearchEngine
          .getICDByText(
            this.pharmaSearchEngine.interactionsSearchText,
            environment.applicationInfo.interactionsEdition
          )
          .subscribe({
            next: (data: any) => {
              this.getICD11ByTextResult = data.getICD11ByTextResult;
            },
            error: (ex) => {
              console.log(ex);
              this.controllersIonicService.hideLoader().finally(() => {
                this.controllersIonicService.presentAlert(
                  "CIE-11",
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

  getDrugsByICD(icdId: number) {
    console.log('icdId',icdId );
    if (this.drugsByICD11Sub) {
      this.drugsByICD11Sub.unsubscribe();
    }
    this.controllersIonicService.showLoader().finally(() => {
      this.drugsByICD11Sub = this.pharmaSearchEngine
        .getDrugsByICD(icdId, environment.applicationInfo.interactionsEdition)
        .subscribe({
          next: (data: any) => {
            console.log('data', data);
            this.pharmaSearchEngine.getDrugsResult.next(data.getDrugsByICD11Result); //getICD11ByTextResult
            this.router.navigateByUrl("/interaction-products");
          },
          error: (err) => {
            this.controllersIonicService.hideLoader().finally(() => {
              this.controllersIonicService.presentAlert(
                "CIE-11",
                "Error al recuperar CIE-11"
              );
            });
          },
          complete: () => this.controllersIonicService.hideLoader(),
        });
    });
  }

  async addTrackingSectionAndEvent(nameEvent?: string) {
    this.plmTrackingEngineService.addTrackingBySection('Interacciones-CIE-11', nameEvent);
  }
}
