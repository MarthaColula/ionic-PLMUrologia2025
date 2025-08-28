import { Component, OnInit, OnDestroy } from "@angular/core";
import { environment } from "src/environments/environment";
import { ProductInfo } from "src/app/interfaces/interaction";
import {
  GlobalvarsService,
  InteractionsEngineService,
  ControllersIonicService,
  InteractionsService,
  PlmPharmaSearchEngineService,
  PlmTrackingEngineService
} from "src/app/services/indexServices";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";

@Component({
  selector: 'app-interaction-products',
  templateUrl: './interaction-products.page.html',
  styleUrls: ['./interaction-products.page.scss'],
  standalone: false,
})
export class InteractionProductsPage implements OnInit, OnDestroy {

  productSelected: boolean;
  searchText: string;
  mealInteractionsByProductsSub: Subscription;

  constructor(
    private router: Router,
    public globalVars: GlobalvarsService,
    private interactionsService: InteractionsService,
    public pharmaSearchEngine: PlmPharmaSearchEngineService,
    private controllersIonicService: ControllersIonicService,
    private interactionsEngineService: InteractionsEngineService,
    private plmTrackingEngineService: PlmTrackingEngineService

  ) { }

  ngOnInit() { }

  ngOnDestroy(): void {
    if (this.mealInteractionsByProductsSub) {
      this.mealInteractionsByProductsSub.unsubscribe();
    }
  }

  getResults(event: any) {
    if (event.key === "Enter" && this.searchText !== undefined) {
      if (this.searchText.length >= 3) {
        this.pharmaSearchEngine.interactionsSearchText = this.searchText;
        this.router.navigateByUrl("/interaction-search-engine");
      } else {
        this.controllersIonicService.presentToast(
          "Para continuar, ingrese mínimo 3 caracteres."
        );
      }
    }
  }

  checkMealInteraction(product: any) {
    if (this.mealInteractionsByProductsSub) {
      this.mealInteractionsByProductsSub.unsubscribe();
    }
    const products: ProductInfo[] = [];
    products.push(product);
    this.controllersIonicService.showLoader().finally(() => {
      this.mealInteractionsByProductsSub = this.interactionsEngineService
        .getMealInteractionsByProducts(
          products,
          environment.applicationInfo.interactionsEdition
        )
        .subscribe({
          next: (data: any) => {
            if (data.length > 0) {
              this.interactionsEngineService.MealInteractionsResult = data;
              this.router.navigateByUrl("/interactions-meal");
            } else {
              this.controllersIonicService.hideLoader().finally(() => {
                this.controllersIonicService.presentToast(
                  "¡No se halló la interacción!"
                );
              });
            }
          },
          error: () => {
            this.controllersIonicService.hideLoader().finally(() => {
              this.controllersIonicService.presentAlert(
                "Interacciones Medicamentosas",
                "Error al recuperar interacciones"
              );
            });
          },
          complete: () => {
            this.controllersIonicService.hideLoader();
          },
        });
    });
  }

  validateProduct(data: any) {
    return this.interactionsService.checkProduct(
      data.CategotyId,
      data.CategoryName,
      data.DivisionId,
      data.DivisionName,
      data.ProductId,
      data.Brand,
      data.PharmaFormId,
      data.PharmaForm
    );
  }

  addProductInteraction(data: any, e: any) {
    if (e.detail.checked) {
      this.interactionsService
        .addProduct(
          data.CategotyId,
          data.CategoryName,
          data.DivisionId,
          data.DivisionName,
          data.ProductId,
          data.Brand,
          data.PharmaFormId,
          data.PharmaForm
        )
        .then((result) => {
          console.warn("---->", JSON.stringify(result));
        })
        .catch((ex) => {
          this.controllersIonicService.presentAlert(
            "Interacciones",
            "Error al agregar medicamento"
          );
          console.warn(
            JSON.stringify(this.interactionsService.getListProduct())
          );
          console.warn(JSON.stringify(ex));
        });
    } else {
      this.interactionsService
        .removeProduct(
          data.CategotyId,
          data.CategoryName,
          data.DivisionId,
          data.DivisionName,
          data.ProductId,
          data.Brand,
          data.PharmaFormId,
          data.PharmaForm
        )
        .then((result) => {
          console.warn(JSON.stringify(result));
        })
        .catch((ex) => {
          this.controllersIonicService.presentAlert(
            "Interacciones",
            "Error al eliminar medicamento"
          );
          console.warn(
            JSON.stringify(this.interactionsService.getListProduct())
          );
          console.warn(JSON.stringify(ex));
        });
    }
  }

  async addTrackingSectionAndEvent(nameEvent?: string) {
    this.plmTrackingEngineService.addTrackingBySection('Interacciones-Productos', nameEvent);
  }


}
