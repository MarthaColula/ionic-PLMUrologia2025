import { Component, OnInit } from '@angular/core';
import { AlertController} from '@ionic/angular';

@Component({
  selector: 'app-ver-cci',
  templateUrl: './ver-cci.page.html',
  styleUrls: ['./ver-cci.page.scss'],
  standalone: false,
})
export class VerCciPage implements OnInit {

  constructor(
    private alertController: AlertController,
  ) { }

  ngOnInit() {
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      mode: 'ios',
      header: 'Respuesta incorrecta',
      buttons: ['Vuelve a intentarlo'],
      message: `<img src="/assets/images/iconoRespuestaIncorrecta.svg"  class="imgInsignia mx-auto">`,
      cssClass: 'alertCasosClicos'
    });
    await alert.present();
  }

}
