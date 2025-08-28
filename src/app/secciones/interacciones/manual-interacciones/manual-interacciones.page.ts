import { Component, OnInit } from '@angular/core';
import { PlmTrackingEngineService } from '../../../services/indexServices';

@Component({
  selector: 'app-manual-interacciones',
  templateUrl: './manual-interacciones.page.html',
  styleUrls: ['./manual-interacciones.page.scss'],
  standalone: false,
})
export class ManualInteraccionesPage implements OnInit {

  constructor( 
    private plmTrackingEngineService: PlmTrackingEngineService,
  ) { }

  ngOnInit() {
    this.addTrackingSectionAndEvent();
  }

  async addTrackingSectionAndEvent(nameEvent?: string) {
    this.plmTrackingEngineService.addTrackingBySection('Interacciones-ManualInteracciones',nameEvent);
  }

}
