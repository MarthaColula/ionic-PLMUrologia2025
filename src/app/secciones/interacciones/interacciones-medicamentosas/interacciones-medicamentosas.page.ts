import { Component, OnInit } from "@angular/core";
import { NavigationExtras, Router } from "@angular/router";
import {
  PlmPharmaSearchEngineService,
  GlobalvarsService,
  //FirebaseAnalyticsService, 
  PlmTrackingEngineService
} from "src/app/services/indexServices";
import { BehaviorSubject } from "rxjs";


@Component({
  selector: 'app-interacciones-medicamentosas',
  templateUrl: './interacciones-medicamentosas.page.html',
  styleUrls: ['./interacciones-medicamentosas.page.scss'],
  standalone: false,
})
export class InteraccionesMedicamentosasPage implements OnInit {

  ShowBanner: boolean;
  closeBanner: boolean;

  constructor(
    private router: Router,
    private globalVars: GlobalvarsService,
    private pharmaSearchEngine: PlmPharmaSearchEngineService,
    //private fa: FirebaseAnalyticsService,
    private plmTrackingEngineService: PlmTrackingEngineService
  ) { }

  ngOnInit() {
    this.addTrackingSectionAndEvent();
  }

  ionViewDidLeave() {
    this.ShowBanner = false;
  }

  ionViewWillEnter() {
    this.ShowBanner = true;
  }

  mealInteractions() {
    const navigationExtras: NavigationExtras = {
      state: {
        title: "Interacciones alimenticias",
      },
    };
    this.globalVars.interactionType = "mealInteraction";
    this.pharmaSearchEngine.interactionsSearchText = '';
    this.pharmaSearchEngine.getResultsv2Result = new BehaviorSubject<any>(null);
    this.router.navigate(["/interaction-search-engine"], navigationExtras);
  }

  drugInteractions() {
    this.globalVars.interactionType = "drugInteraction";
    this.pharmaSearchEngine.interactionsSearchText = '';
    this.pharmaSearchEngine.getResultsv2Result = new BehaviorSubject<any>(null);
    this.router.navigateByUrl("/interactions");
  }

  async addTrackingSectionAndEvent(nameEvent?: string) {
    this.plmTrackingEngineService.addTrackingBySection('Interacciones Medicamentosas', nameEvent);
  }

  bannerClose(event) {
    console.log({ close: event });
    this.closeBanner = event;
  }


}
