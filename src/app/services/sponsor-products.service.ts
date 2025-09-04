import { Platform } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SponsorProductsService {

  private baseUrl: string;
  private fileName: string;
  private time: string;
  sponsorProduct = new BehaviorSubject<any>(null);
  withoutProductShotresult = new BehaviorSubject<any>(null);
  withoutProductShot$ = this.withoutProductShotresult.asObservable();

  constructor(
    private http: HttpClient,
    private plt: Platform
  ) {
    const { protocol, server, pathName, json } = environment.sponsorProducts;
    this.baseUrl = `${protocol}://${server}/${pathName}/`;
    this.fileName = json;
    if (!this.time) {
      this.time = '?t=' + new Date().getTime();
    }
  }

  getJsonData(): Promise<any> {
    let finalUrl: string;
    if (this.plt.is('ios')) {
      finalUrl = this.baseUrl + this.fileName + this.time;
    } else {
      finalUrl = this.baseUrl + this.fileName;
    }

    return new Promise((resolve, reject) => {
      this.http.get(finalUrl).subscribe(
        (result: any) => {
          console.log('getJsonDataSponsorProducts RESULT', result);
          let json: any;
          json = result;
          resolve(json);
        },
        (error) => {
          reject(this.printErrorMsg(error));
        }
      );
    });
  }

  printErrorMsg(ex: any) {
    return JSON.stringify(ex);
  }

  getProductswithoutProductShot() {
    return this.withoutProductShotresult.getValue();
  }

}
