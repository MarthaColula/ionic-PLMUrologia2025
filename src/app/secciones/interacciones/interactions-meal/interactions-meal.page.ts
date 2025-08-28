import { Component, OnInit } from '@angular/core';
import { 
  InAppBrowserService, 
  PlmTrackingEngineService, 
  InteractionSearchEngineService 
} from '../../../services/indexServices';

@Component({
  selector: 'app-interactions-meal',
  templateUrl: './interactions-meal.page.html',
  styleUrls: ['./interactions-meal.page.scss'],
  standalone: false,
})
export class InteractionsMealPage implements OnInit {

  mealInteractionsResult: any;
  title: string = '';

  constructor(
    private _inAppBrowserService: InAppBrowserService,
    private _interactionSearchEngineService: InteractionSearchEngineService,
    private _trackingEngineService: PlmTrackingEngineService
  ) {
      this.getMealInteractionsResult();
      this.getPageTitle();
  }

  private getPageTitle() {
    this.title = this._interactionSearchEngineService.getInteractionsPagesTitle();
  }

  private getMealInteractionsResult(){
    this.mealInteractionsResult = this._interactionSearchEngineService.getMealInteractionsResult();
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
