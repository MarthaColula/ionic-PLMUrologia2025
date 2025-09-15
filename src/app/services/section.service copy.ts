import { Injectable } from "@angular/core";
import { Platform } from "@ionic/angular";
import { HttpFetchService } from './http-fetch-service';
import { environment } from "../../environments/environment";
import { BehaviorSubject } from "rxjs";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})

export class SectionService {
  public dynamicSectionJsonResult = new BehaviorSubject<Array<any>>(null);
  public sectionJsonResult$ = this.dynamicSectionJsonResult.asObservable();
  mainSection = new BehaviorSubject<any>(null);
  PLMIdMainSection: any;

  private baseUrl: string;
  private fileName: string;
  private time: string;
  section = new BehaviorSubject<string>(null);

  constructor(
    private ngxHttp: HttpFetchService,
    private plt: Platform,
    private httpC: HttpClient
  ) {
    this.section.subscribe((a) => {
      let sectionValue = a;
      console.log({ sectioName: a });

      if (sectionValue === "podcast") {
        /*const { protocol, server, pathName, json } = environment.podcast;
        this.baseUrl = `${protocol}://${server}/${pathName}/`;
        this.fileName = json;
        */
      } else if (sectionValue === "cci") {
        const { protocol, server, pathName, json } = environment.cci;
        this.baseUrl = `${protocol}://${server}/${pathName}/`;
        this.fileName = json;
      } else if (sectionValue === "atlas") {
        const { protocol, server, pathName, json } = environment.atlas;
        this.baseUrl = `${protocol}://${server}/${pathName}/`;
        this.fileName = json;
      } else if (sectionValue === "calculators") {
          const { protocol, server, pathName, json } = environment.calculators;
          this.baseUrl = `${protocol}://${server}/${pathName}/`;
          this.fileName = json;
      }

      if (!this.time) {
        this.time = "?t=" + new Date().getTime();
      }
    });
  }

  getDynamicSectionJsonFromServerRequest() {
    let finalUrl: string;
    if (this.plt.is("ios")) {
      finalUrl = this.baseUrl + this.fileName + this.time;
      console.log("finalUrL1", finalUrl);
    } else {
      finalUrl = this.baseUrl + this.fileName;
      console.log("finalUrl", finalUrl);
    }
    /*const webMethod = finalUrl;    // request1
    return this.httpC.get<any>(webMethod);*/


    return new Promise((resolve, reject) => {   // request2
      this.ngxHttp
        .get(finalUrl, {}, {})
        .then((result: any) => {
          let json: any;
          if (result.status >= 200 && result.status < 300) {
            json = JSON.parse(result.data);
            console.log("JSON", json); // add
            this.dynamicSectionJsonResult.next(json);
          }
          resolve(json);
        })
        .catch((ex: any) => {
          this.dynamicSectionJsonResult.next(null);
          reject(this.printErrorMsg(ex));
        });
    });
  }

  getDynamicSection() {
    //console.log('getDynamicSection()', this.dynamicSectionJsonResult.getValue());
    return this.dynamicSectionJsonResult.getValue();
  }

  getDynamicSectionJsonLocalRequest() {
    console.log("LOCAL");
    return this.httpC
      .get<any[]>("assets/data/cciList.json")
      .toPromise()
      .then((result) => {
        this.dynamicSectionJsonResult.next(result);
        return result;
      })
      .catch((ex) => {
        return ex;
      });
  }

  printErrorMsg(ex: any) {
    return JSON.stringify(ex);
  }

}
