import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';

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

  async presentAlert(){
    const alert = await this.alertController.create({
      mode: "ios",
      header: "Lamentamos su partida",
      subHeader: "Para confirmar la cancelación de su cuenta, hemos enviado un email al correo que tiene registrado en la aplicación.",
      buttons: ["OK"]
    });
    await alert.present();
    let result = await alert.onDidDismiss();
  }
}