import { Component, OnInit, OnDestroy } from "@angular/core";
import { environment } from "src/environments/environment";
import { ModalController } from "@ionic/angular";
import {
  InteractionsService,
  InteractionsEngineService,
  ControllersIonicService,
  PlmTrackingEngineService
} from "src/app/services/indexServices";
import { ModalInfoComponent } from "src/app/componentes/modal-info/modal-info.component";
import { Subscription, BehaviorSubject } from "rxjs";

@Component({
  selector: 'app-interaction-results',
  templateUrl: './interaction-results.page.html',
  styleUrls: ['./interaction-results.page.scss'],
  standalone: false,
})
export class InteractionResultsPage implements OnInit, OnDestroy {

  interactionByLabResults: any[] = [];
  interactionByEvidencyResults: any;
  successRequest = new BehaviorSubject<boolean>(false);
  getInteractionsSub: Subscription;

  constructor(
    private modalController: ModalController,
    private interactionService: InteractionsService,
    private interactionsEngine: InteractionsEngineService,
    private controllersIonicService: ControllersIonicService,
    private plmTrackingEngineService: PlmTrackingEngineService
  ) { }

  ngOnInit() {
    this.getInteractionResults();
  }

  ngOnDestroy(): void {
    if (this.getInteractionsSub) {
      this.getInteractionsSub.unsubscribe();
    }
  }

  getInteractionResults() {
    if (this.getInteractionsSub) {
      this.getInteractionsSub.unsubscribe();
    }
    this.controllersIonicService.showLoader().finally(() => {
      this.getInteractionsSub =
        // tslint:disable-next-line:max-line-length
        this.interactionsEngine
          .getInteractions(
            this.interactionService.getListProduct(),
            environment.applicationInfo.interactionsEdition
          )
          .subscribe({
            next: (data: any) => {
              let foundInteraction = false;
              this.interactionByLabResults = data[0];
              this.interactionByEvidencyResults = data[1];
              if (this.interactionByLabResults.length > 0) {
                this.interactionByLabResults.forEach((item) => {
                  if (
                    item.InteractionSubstances.length > 0 ||
                    item.PharmacologicalGroups.length > 0
                  ) {
                    foundInteraction = true;
                  }
                });
              }
              if (foundInteraction === false) {
                this.interactionByLabResults = [];
              }
            },
            error: (err) => {
              console.log(err);
              this.controllersIonicService.hideLoader().finally(() => {
                this.controllersIonicService.presentAlert(
                  "Interacciones Medicamentosas",
                  "Error al recuperar interacciones"
                );
              });
            },
            complete: () => {
              this.successRequest.next(true);
              this.controllersIonicService.hideLoader();
            },
          });
    });
  }

  async interactionDetail(interactionData: any) {
    const modal = await this.modalController.create({
      component: ModalInfoComponent,
      componentProps: {
        interactionDetail: interactionData,
        interactionByEvidency: this.interactionByEvidencyResults.filter(
          (item: any) =>
            item.ProductId === interactionData.ProductId &&
            item.PharmaFormId === interactionData.PharmaFormId &&
            item.CategoryId === interactionData.CategoryId &&
            item.DivisionId === interactionData.DivisionId
        )[0],
      },
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
  }

  async addTrackingSectionAndEvent(nameEvent?: string) {
    this.plmTrackingEngineService.addTrackingBySection('Interacciones-Results', nameEvent);
  }

}
