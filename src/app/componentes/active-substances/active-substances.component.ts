import { Component, OnInit, Input } from '@angular/core';
import { ControllersIonicService } from '../../services/indexServices';

@Component({
  selector: 'app-active-substances',
  templateUrl: './active-substances.component.html',
  styleUrls: ['./active-substances.component.scss'],
  standalone: false,
})
export class ActiveSubstancesComponent implements OnInit {

  @Input() substances: any[] = [];
  //@Input() substances: any
  popOverMessage = '';

  constructor(private controllersIonicService: ControllersIonicService) { }

  ngOnInit() {
    console.log('this.substances',this.substances)
   }

  showPopOver() {
    if (this.popOverMessage === '') {
      let finalString = '';
      this.substances.forEach(subtance => {
        if (finalString !== '') {
          finalString = finalString
            + '<ion-item class="listaResultadosBusqueda" color="pev-primary">'
            + '<p class="pharmaForm"><em>'
            + subtance.Description +
            '</em></p>'
            + '</ion-item>';
        } else {
          finalString = '<ion-item class="listaResultadosBusqueda" color="pev-primary">'
            + '<p class="pharmaForm"><em>'
            + subtance.Description + '</em></p>'
            + '</ion-item>';
        }
      });
      this.popOverMessage = '<ion-card class="sustancia-activa">'
        + '<ion-card-header>'
        + '<ion-card-subtitle>'
        + '<h2 class="titSustancia">Sustancia(s) activa(s)</h2>'
        + '</ion-card-subtitle>'
        + '</ion-card-header>'
        + '<ion-card-content>'
        + '<ion-list class="ion-no-padding">'
        + finalString
        + '</ion-list>'
        + '</ion-card-content>'
        + '</ion-card>';
    }
    this.controllersIonicService.presentPopoverWithEvent(this.popOverMessage, null, 'custom-popover');
  }

}
