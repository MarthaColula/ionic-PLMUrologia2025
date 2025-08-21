import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modal-info',
  templateUrl: './modal-info.page.html',
  styleUrls: ['./modal-info.page.scss'],
  standalone: false,
})
export class ModalInfoPage implements OnInit {


  // @Input() interactionByEvidency;
  // @Input() interactionDetail;
  status = 'laboratorio';
  constructor(private modalController: ModalController,
              private sanitizer: DomSanitizer) { }

  ngOnInit() {
    // console.log(this.interactionDetail);
    // console.error(this.interactionByEvidency);
  }

  closeModal() {
    this.modalController.dismiss();
  }

  salirSinArgumentos() {
    this.modalController.dismiss();
  }

//  getColorClassName(color) {
//     let className = '';

//     switch (color) {
//       case 'Amarillo':
//         className = 'yellow';
//         break;
//       case 'Blanco':
//         className = 'white';
//         break;
//       case 'Gris':
//         className = 'gray';
//         break;
//       case 'Negro':
//         className = 'black';
//         break;
//       case 'Rojo':
//         className = 'red';
//         break;
//       case 'Verde':
//         className = 'green';
//         break;
//     }
//     return className;
//   }

  openBlank(url: string) {
    window.open(url, '_blank');
  }


}
