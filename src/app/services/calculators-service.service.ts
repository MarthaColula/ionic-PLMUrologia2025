import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
//import { HTTP } from '@awesome-cordova-plugins/http/ngx';
import { environment } from '../../environments/environment';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { HttpFetchService } from './http-fetch-service';



@Injectable({
  providedIn: 'root'
})
export class CalculatorsServiceService {

  private dynamicSectionJsonResult = new BehaviorSubject<any>(null);
  mainSection = new BehaviorSubject<any>(null);
  PLMIdMainSection: any;

  avaliblePGCSection = new BehaviorSubject<Array<any>|null>(null);
  avaliblePGCSection$ = this.avaliblePGCSection.asObservable();

  private baseUrl: string;
  private fileName: string;
  private time: string;

  constructor(
    private ngxHttp: HttpFetchService,
    //private http: HTTP,
    private plt: Platform,
    private httpC: HttpClient,) {
    const { protocol, server, pathName, json } = environment.calculators;
    this.baseUrl = `${protocol}://${server}/${pathName}/`;
    this.fileName = json;
    if (!this.time) {
      this.time = '?t=' + new Date().getTime();
    }
  }
  getDynamicSectionJsonLocalRequest() {
    return this.httpC.get<any[]>('assets/data/dynamicSection.json').toPromise()
      .then(result => {
        this.dynamicSectionJsonResult.next(result);
        return result;
      })
      .catch(ex => {
        return ex;
      });
  }


  getDynamicSectionJsonFromServerRequest() {
    let finalUrl: string;
    if (this.plt.is('ios')) {
      finalUrl = this.baseUrl + this.fileName + this.time;
      console.log('finalUrlIf', finalUrl);
    } else {
      finalUrl = this.baseUrl + this.fileName;
      console.log('finalUrlElse', finalUrl);
    }
    return new Promise((resolve, reject) => {
      this.ngxHttp.get(finalUrl, {}, {})
        .then((result:any) => {
          let json: any;
          if (result.status >= 200 && result.status < 300) {
            json = JSON.parse(result.data);
            console.log('serviceJSON1', json); // add
            this.dynamicSectionJsonResult.next(json);
          }
          resolve(json);
        })
        .catch((ex:any) => {
          this.dynamicSectionJsonResult.next(null);
          reject(this.printErrorMsg(ex));
        });
    });
  }

  getDynamicSection() {
    return this.dynamicSectionJsonResult.getValue();
  }

  sectionExist(sectionName: string) {
    this.mainSection.next(null);
    this.PLMIdMainSection = undefined;
    const sections = this.dynamicSectionJsonResult.getValue();
    console.log('sections', sections);
    if (!Array.isArray(sections)) {
      return false;
    }
    let section: any = sections.find((element) => element.sectionName === sectionName);
    if (section) {
      this.mainSection.next(section);
      this.PLMIdMainSection = section.PLMId;
      return true;
    } else return false;
  }

  private printErrorMsg(ex: any) {
    return JSON.stringify(ex);
  }

}
