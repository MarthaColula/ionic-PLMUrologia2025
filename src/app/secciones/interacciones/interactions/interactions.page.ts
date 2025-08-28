import { Component, OnInit } from '@angular/core';
import { 
  InteractionsService, 
  ControllersIonicService,
  PlmTrackingEngineService 
} from '../../../services/indexServices';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-interactions',
  templateUrl: './interactions.page.html',
  styleUrls: ['./interactions.page.scss'],
  standalone: false,
})
export class InteractionsPage implements OnInit {

 interactionList: any;
  showMessage = new BehaviorSubject<boolean>(false);

  constructor(
    public alertService: ControllersIonicService,
    private interactionsService: InteractionsService,
    private plmTrackingEngineService: PlmTrackingEngineService,
    private router: Router
  ) {
  }

  ngOnInit() { }

  getInteractionList() {
    const products = this.interactionsService.getListProduct();
    if (products && products.length === 0) {
      this.showMessage.next(true);
    } else {
      this.showMessage.next(false);
    }
    return products;
  }

  searchDrugs() {
    this.router.navigateByUrl('/interaction-search-engine');
  }

  deleteProductInteraction(data: any) {
    this.interactionsService.removeProduct(data.CategotyId, data.CategoryName, data.DivisionId, data.DivisionName,
      data.ProductId, data.Brand, data.PharmaFormId, data.PharmaForm).then(result => {
        console.warn(JSON.stringify(result));
      })
      .catch(ex => {
        this.alertService.presentAlert('Interacciones', 'Error al eliminar medicamento');
        console.warn(JSON.stringify(this.interactionsService.getListProduct()));
        console.warn(JSON.stringify(ex));
      });
  }

  async addTrackingSectionAndEvent(nameEvent?: string) {
    this.plmTrackingEngineService.addTrackingBySection('Interacciones-Interactions',nameEvent);
  }

}
