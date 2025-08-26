import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { InAppBrowserService } from 'src/app/services/in-app-browser.service';

@Component({
  selector: 'app-modal-info',
  templateUrl: './modal-info.component.html',
  styleUrls: ['./modal-info.component.scss'],
  standalone: false,
})
export class ModalInfoComponent implements OnInit {

  @Input() interactionByEvidency: any;
  @Input() interactionDetail: any;
  status = 'laboratorio';

  constructor(
    public modalController: ModalController,
    public iabService: InAppBrowserService
  ) { }

  ngOnInit() {
  }

  public segmentChanged(ev: any) {
    this.status = ev.detail.value;
  }

  public closeModal() {
    this.modalController.dismiss();
  }

  public salirSinArgumentos() {
    this.modalController.dismiss();
  }

  public getColorClassName(color: any) {
    let className = '';
    switch (color) {
      case 'Amarillo':
        className = 'yellow';
        break;
      case 'Blanco':
        className = 'white';
        break;
      case 'Gris':
        className = 'gray';
        break;
      case 'Negro':
        className = 'black';
        break;
      case 'Rojo':
        className = 'red';
        break;
      case 'Verde':
        className = 'green';
        break;
    }
    return className;
  }

  public showIppa() {
    this.status = 'ippa';
  }

}
