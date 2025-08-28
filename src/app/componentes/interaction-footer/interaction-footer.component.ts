import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { InteractionsService } from '../../services/interactions.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-interaction-footer',
  templateUrl: './interaction-footer.component.html',
  styleUrls: ['./interaction-footer.component.scss'],
  standalone: false,
})
export class InteractionFooterComponent  implements OnInit {

 constructor(
    private router: Router,
    public interactionsService: InteractionsService,
    public alertController: AlertController) {
  }

  ngOnInit() { }

  searchDrugs() {
    this.router.navigateByUrl('/interaction-search-engine');
  }

  async deleteInteractionProducts() {
    const alert = await this.alertController.create({
      header: 'Interacciones Medicamentosas',
      message: '¿Desea eliminar todos los medicamentos agregados?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
          }
        }, {
          text: 'Aceptar',
          handler: () => {
            this.interactionsService.removeAllProduct();
            this.router.navigateByUrl('/interactions');
          }
        }
      ]
    });

    await alert.present();
  }

  getInteractionResult() {
    this.router.navigateByUrl('/interaction-results');
  }

  async showInformation() {
    const alert = await this.alertController.create({
      header: 'Interacciones Medicamentosas',
      message: 'Las interacciones medicamentosas se obtuvieron a partir del documento llamado ' +
        'información para prescribir (IPP) de cada producto; éstas se encuentran ' +
        'descritas en el apartado  "Interacciones medicamentosas y de otro género". ' +
        'La IPP es aprobada por la Comisión Federal para la Protección contra Riesgos ' +
        'Sanitarios (COFEPRIS), entidad de regulación sanitaria en México. ' +
        'En ese rubro de la IPP se indican  las interacciones entre sustancias activas y/o grupos ' +
        'farmacológicos, los cuales fueron tomadas para mostrar en este módulo. ' +
        'Es indispensable que los profesionales de la salud verifiquen esta información ' +
        'antes de recomendar algún fármaco, ya que será responsabilidad única ' +
        'y exclusiva del médico tomar la mejor decisión para efectuar una adecuada prescripción.',
      buttons: [
        {
          text: 'Aceptar',
          cssClass: 'secondary',
          handler: () => {
          }
        }
      ]
    });
    await alert.present();
  }

}
