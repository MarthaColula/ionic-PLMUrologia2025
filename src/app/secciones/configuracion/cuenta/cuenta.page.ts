import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-cuenta',
  templateUrl: './cuenta.page.html',
  styleUrls: ['./cuenta.page.scss'],
  standalone: false
})
export class CuentaPage implements OnInit {

  constructor(
    public alertController: AlertController
  ) { }

  ngOnInit() {
  }

  async presentConfirm() {
    const alertConfirm = await this.alertController.create({
      mode: "ios",
      header: environment.applicationInfo.name,
      subHeader: "¿Está seguro que desea eliminar su cuenta?",
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            console.log('Acción cancelada');
          }
        },
        {
          text: 'Sí',
          handler: () => {
            this.presentAlert();
          }
        }
      ]
    });
    await alertConfirm.present();
  }

  async presentAlert() {
    const alertOk = await this.alertController.create({
      mode: "ios",
      header: "Lamentamos su partida",
      subHeader: "Para confirmar la cancelación de su cuenta, hemos enviado un mensaje al correo que tiene registrado en la aplicación.",
      buttons: ["OK"]
    });
    await alertOk.present();
    let result = await alertOk.onDidDismiss();
  }
}