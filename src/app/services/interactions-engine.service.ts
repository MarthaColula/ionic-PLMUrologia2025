import { GlobalvarsService } from '../services/globalvars.service';
import { environment } from 'src/environments/environment';
import { ProductInfo } from '../interfaces/interaction';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, forkJoin, BehaviorSubject } from 'rxjs';
//import { AlertServiceService } from './alert-service.service';
import { ControllersIonicService } from './controllers-ionic.service';

@Injectable({
  providedIn: 'root'
})
export class InteractionsEngineService {

  public MealInteractionsResult: any;
  private apiUrl = '';

  constructor(
    private http: HttpClient,
    private globalVarsService: GlobalvarsService,
    private controllersIonicService: ControllersIonicService,
    //public alertService: AlertServiceService
  ) {
    const { protocol, server, path, endPointName } = environment.RestPLMInteractions;
    this.apiUrl = `${protocol}://${server}:/${path}/${endPointName}/RestInteractions.svc/`;
    console.warn(this.apiUrl);
  }

  public getInteractionsByEditionProducts(products: ProductInfo[], editionId: number) {
    // tslint:disable-next-line:max-line-length
    const request = this.apiUrl + `getInteractionsByProducts/${environment.applicationInfo.countryId}`;
    console.log('request getInteractionsByEditionProducts', request);
    // tslint:disable-next-line:max-line-length
    return this.http.post(request, products);
  }

  public getIMDDIProductInteractionSubstances(products: ProductInfo[], editionId: number) {
    // tslint:disable-next-line:max-line-length
    const request = this.apiUrl + `getIMDDIProductInteractionSubstances/${this.globalVarsService.getClientInfoValue()?.codeString},${environment.applicationInfo.countryId},${editionId}`;
    // tslint:disable-next-line:max-line-length
    return this.http.post(request, products);
  }

  public getMealInteractionsByProducts(products: ProductInfo[], editionId: number) {
    // tslint:disable-next-line:max-line-length
    const request = this.apiUrl + `getMealInteractionsByProducts/${this.globalVarsService.getClientInfoValue()?.codeString},${environment.applicationInfo.countryId},${editionId}`;
    // tslint:disable-next-line:max-line-length
    return this.http.post(request, products);
  }

  getInteractions(products: ProductInfo[], editionId: number): Observable<any> {
    const response1 = this.getInteractionsByEditionProducts(products, editionId);
    const response2 = this.getIMDDIProductInteractionSubstances(products, editionId);
    return forkJoin([response1, response2]);
  }

  getInteractionResults(products: ProductInfo[], editionId: number) {
    this.controllersIonicService.showLoader();
    // await this.loadingService.presentLoading('Loading...');
    this.getInteractions(products, editionId)
      .subscribe(res => {
        console.log(res);
        // this.loadingService.loading.dismiss();
        this.controllersIonicService.hideLoader();
      }, err => {
        console.log(err);
        // this.loadingService.loading.dismiss();
        this.controllersIonicService.presentAlert('Interacciones', 'Error al recuperar interacciones');
        this.controllersIonicService.hideLoader();
      });
  }

}