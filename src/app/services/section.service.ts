import { Injectable } from "@angular/core";
import { Platform } from "@ionic/angular";
import { environment } from "../../environments/environment";
import { BehaviorSubject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { HttpFetchService } from './http-fetch-service';


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
  private atlasList: any = [];

  constructor(
    private http: HttpFetchService,
    private plt: Platform,
    private httpC: HttpClient
  ) {
    this.section.subscribe((a) => {
      let sectionValue = a;
      console.log({ sectioName: a });

      if (sectionValue === "atlas") {
        const { protocol, server, pathName, json } = environment.atlas;
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
      this.http
        .get(finalUrl, {}, {})
        .then((result: any) => {
           console.log('result', result.data);
           this.atlasList = result.data;
          /*for (const sub of result.data) {
             console.log('sub', sub);
             this.atlasList = sub.AtlasList;
            console.log('this.atlasList', this.atlasList);
          }*/
          /*let json: any;
          if (result.status >= 200 && result.status < 300) {
            json = JSON.parse(result.data.AtlasList);
            console.log("JSON", JSON.stringify(json)); // add
    
            this.dynamicSectionJsonResult.next(this.atlasList);
          }*/

          this.dynamicSectionJsonResult.next(this.atlasList);
          
          resolve(this.atlasList);
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


  getAtlasListJson() {
    return this.atlasList;
  }

  getDynamicSectionJsonLocalRequest() {
    console.log("LOCAL");
    return this.httpC
      .get<any[]>("assets/data/discusiones.json")
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
