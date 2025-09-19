import { Component, OnInit } from '@angular/core';
import { 
  InAppBrowserService, 
  PlmTrackingEngineService, 
  InteractionSearchEngineService, 
  InteractionsEngineService
} from '../../../services/indexServices';

@Component({
  selector: 'app-interactions-meal',
  templateUrl: './interactions-meal.page.html',
  styleUrls: ['./interactions-meal.page.scss'],
  standalone: false,
})
export class InteractionsMealPage implements OnInit {
  title: string = '';

  constructor(
    private _inAppBrowserService: InAppBrowserService,
    private _trackingEngineService: PlmTrackingEngineService,
    public interactionsEngineService: InteractionsEngineService
  ) {
  }


  ngOnInit() {
    this.addTrackingSectionAndEvent(this.title);
  }

  openUrl(reference: string) {
    this._inAppBrowserService.open(reference);
  }

  async addTrackingSectionAndEvent(nameEvent?: string) {
    this._trackingEngineService.addTrackingBySection('Interacciones-InteractionsMeal',nameEvent);
  }

}
