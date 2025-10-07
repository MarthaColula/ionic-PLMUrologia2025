import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
//import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CalculatorsDynamicService {
  /*
  private baseUrl: string;
  private listData: string;
  */
  private time: string;

  private calculatorsList: any = [];
  private calculatorDetail: any;
  protected subfolder: string;

  constructor(
    private httpClient: HttpClient
  ) {
    /*const { protocol, server, pathName, listData } = environment.calculatorsData;
    this.listData = listData;
    this.baseUrl = `${protocol}://${server}/${pathName}/`;
    if (!this.time) {
      this.time = '?t=' + new Date().getTime();
    }]*/
    this.time = '?t=' + new Date().getTime();
    console.log('CalculatorsDynamicService', { time: this.time });
  }

  getCalculatorListJson() {
    return this.calculatorsList;
  }

  getCalculatorDetail() {
    return this.calculatorDetail;
  }

  /* get list palne
  getCalculatorsFromHttpClient() {
    //modif LOCAL
    const webMethod = '/assets/data/calculators/calculatorsList.json';
    //const webMethod = this.baseUrl + this.listData;
    console.warn('CalcDynamicService getCalculatorsFromHttpClient webMethod: ' + webMethod);
    return new Promise((resolve, reject) => {
      this.httpClient.get<any>(webMethod)
      .subscribe(data => {
        console.warn('CalculatorsDynamicService', data);
        console.warn('CalculatorsDynamicService', {calculators: data});
        this.calculatorsList = data;
        resolve(data);
      }, err => {
        reject({ MethodFailed: 'getCalculatorsFromHttpClient', Message: this.printErrorMsg(err) });
      });
    });
  }*/


  //get list collapse

  getCalculatorsFromHttpClient(subfolder?: string) {
    //TODO: Test Local
    const webMethod = '/assets/data/calculators/' + (subfolder ? subfolder + '/' : '') + 'calculatorsList.json';
    this.subfolder = (subfolder ? subfolder + '/' : '');
    //const webMethod = this.baseUrl + this.listData;
    return new Promise((resolve, reject) => {
      this.httpClient.get<any>(webMethod)
        .subscribe(data => {
          console.warn(data);
          console.warn({ calculators: data });
          this.calculatorsList = data;
          resolve(data);
        }, err => {
          reject({ MethodFailed: 'getCalculatorsFromHttpClient', Message: this.printErrorMsg(err) });
        });
    });
  }



  getJsonLocalDataFromHttpClient(fileName: string) {
    const webMethod = `/assets/data/calculators/MedicV2/${fileName}`;
    console.warn('CalculatorsDynamicService', 'webMethod: ' + webMethod);
    return new Promise((resolve, reject) => {
      this.httpClient.get<any>(webMethod)
        .subscribe(data => {
          console.warn('CalculatorsDynamicService', { data2: data });
          this.calculatorDetail = data;
          resolve(data);
        }, err => {
          reject({ MethodFailed: 'getJsonLocalDataFromHttpClient', Message: this.printErrorMsg(err) });
        });
    });
  }

  getJsonDataFromHttpClient(fileName: string, baseUrl?: any) {
    //const cors = 'https://cors-anywhere.herokuapp.com/';
    const webMethod = baseUrl + fileName + this.time;
    //const webMethod = `/assets/data/calculators/${fileName}`; //Local
    console.warn('CalculatorsDynamicService', 'webMethod: ' + webMethod);
    return new Promise((resolve, reject) => {
      this.httpClient.get<any>(webMethod)
        .subscribe(data => {
          console.warn('CalculatorsDynamicService', { data2: data });
          this.calculatorDetail = data;
          resolve(data);
        }, err => {
          reject({ MethodFailed: 'getJsonDataFromHttpClient', Message: this.printErrorMsg(err) });
        });
    });
  }
  /*
  getCalculatorsFromHTTP() {
    const webMethod = this.baseUrl + this.listData;
    console.log('CalculatorsDynamicService', 'webMethod: ' + webMethod);
    return new Promise((resolve, reject) => {
      this.httpNgx.get(webMethod, {}, {})
        .then(result => {
          let json: any;
          if (result.status >= 200 && result.status < 300) {
            json = JSON.parse(result.data);
            console.warn('CalculatorsDynamicService', json);
            this.calculatorsList = json.Calculators;
          }
          resolve(json);
        })
        .catch(ex => {
          reject({ MethodFailed: 'getCalculatorsFromHTTP', Message: this.printErrorMsg(ex) });
        });
    });
  }
  */
  getJsonDataFromHTTP(fileName: string, baseUrl: any) {
    const webMethod = baseUrl + fileName;
    //const webMethod = this.baseUrl + fileName;
    console.log('CalculatorsDynamicService', 'webMethod:' + webMethod);
    return new Promise((resolve, reject) => {
      this.httpClient.get(webMethod)
        .subscribe(result => {
          let json: any;
          json = result;
          this.calculatorDetail = json;
          resolve(json);
        },
          (error) => {
            reject({ MethodFailed: 'getJsonDataFromHTTP', Message: this.printErrorMsg(error) });
          });
    });
  }

  private printErrorMsg(error: any) {
    return JSON.stringify(error);
  }

}
