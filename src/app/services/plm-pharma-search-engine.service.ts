import { GlobalvarsService } from './globalvars.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { PlmClientsEngineService } from './plm-clients-engine.service';

@Injectable({
  providedIn: 'root'
})
export class PlmPharmaSearchEngineService {

  private apiUrl = '';
  public getAllAttributesByProductResult = new BehaviorSubject<any>(null);
  public interactionsSearchText: string = '';
  public productsSearchText: string = '';

  // public getDrugsResult: Observable <any[]>;
  public getDrugsResult = new BehaviorSubject<any>(null);
  public getDrugsResult$ = this.getDrugsResult.asObservable();

  public getResultsv2Result = new BehaviorSubject<any>(null);
  public getResultsv2Result$ = this.getResultsv2Result.asObservable();

  public getDrugsBySubstanceResult = new BehaviorSubject<any>(null);
  // public getDrugsBySubstanceResult$ = this.getDrugsBySubstanceResult.asObservable();

  public productActiveSubstances = '';
  private httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

  constructor(
    private http: HttpClient,
    private globalVars: GlobalvarsService,
    private clientsService: PlmClientsEngineService
  ) {
    //const { protocol, server, port, path, endPointName } = environment.restPLMPharmaSearch;
    //this.apiUrl = `${protocol}://${server}:${port}/${path}/${endPointName}/RestPharmaSearchEngine.svc/`;
    const { protocol, server, path, endPointName } = environment.restPLMPharmaSearch;
    this.apiUrl = `${protocol}://${server}/${path}/${endPointName}/RestPharmaSearchEngine.svc/`;
  }
  
  getAllAttributesByProductRequest(
    codeString: string,
    editionId: number,
    divisionId: number,
    categoryId: number,
    productId: number,
    pharmaFormId: number,
    resolutionKey: number
  ) {
    // tslint:disable-next-line: max-line-length
    const request = this.apiUrl + `getAllAttributesByProduct?code=${codeString}&editionId=${editionId}&divisionId=${divisionId}&categoryId=${categoryId}&productId=${productId}&pharmaFormId=${pharmaFormId}&resolutionKey=${resolutionKey}`;
    return this.http.get<any>(request)
      .pipe(map((response) => {
        if (response.getAllAttributesByProductResult) {
          this.getAllAttributesByProductResult = response.getAllAttributesByProductResult;
        } else {
          this.getAllAttributesByProductResult = response;
        }
        return this.getAllAttributesByProductResult;
      }));
   }

  getAllAttributesByProduct(divisionId: number,
                            categoryId: number,
                            productId: number,
                            pharmaFormId: number,
                            editionId: number) {
    // tslint:disable-next-line:max-line-length
    //const request = this.apiUrl + `getAllAttributesByProduct?code=hcCNhdG90P0AVTsylUD9m5C9JbUR&editionId=${editionId}&divisionId=${divisionId}&categoryId=${categoryId}&productId=${productId}&pharmaFormId=${pharmaFormId}&resolutionKey=${this.globalVars.getDeviceInfo().ResolutionKey}`;
    const request = this.apiUrl + `getAllAttributesByProduct?code=${this.globalVars.getClientInfoValue().codeString}&editionId=${editionId}&divisionId=${divisionId}&categoryId=${categoryId}&productId=${productId}&pharmaFormId=${pharmaFormId}&resolutionKey=${this.globalVars.getDeviceInfo().ResolutionKey}`;
    // tslint:disable-next-line:max-line-length
    console.warn('PlmPharmaSearchEngineService', '*** request: ' + request);
    return this.http.get<any[]>(request);
  }
  getResultsService(searchText: string, editionId: number) {
    // tslint:disable-next-line:max-line-length
    const request = this.apiUrl + `getResultsv2?code=${this.globalVars.getClientInfoValue().codeString}&countryId=${environment.applicationInfo.countryId}&editionId=${editionId}&searchText=${searchText}`;
    console.warn('PlmPharmaSearchEngineService', '*** request: ' + request);
    return this.http.get<any[]>(request);
  }

  getDrugs(searchText: string, editionId: number) {
    // tslint:disable-next-line:max-line-length
    const request = this.apiUrl + `getDrugs?code=${this.globalVars.getClientInfoValue().codeString}&countryId=${environment.applicationInfo.countryId}&editionId=${editionId}&drug=${searchText}&searchAddressIP=${this.globalVars.getClientAddressIp() ? this.globalVars.getClientAddressIp().ip : '\x00'}&searchLatitude=${this.globalVars.getGeolocationClient() ? this.globalVars.getGeolocationClient().longitude.toString() : '\x00'}&searchLongitude=${this.globalVars.getGeolocationClient() ? this.globalVars.getGeolocationClient().longitude.toString() : '\x00'}`;
    // tslint:disable-next-line:max-line-length
    console.warn('PlmPharmaSearchEngineService', '*** request: ' + request);
    return this.http.get<any[]>(request);
  }

  getSubstances(searchText: string, editionId: number) {
    // tslint:disable-next-line:max-line-length
    const request = this.apiUrl + `getSubstances?code=${this.globalVars.getClientInfoValue().codeString}&countryId=${environment.applicationInfo.countryId}&editionId=${editionId}&substance=${searchText}&searchAddressIP=${this.globalVars.getClientAddressIp() ? this.globalVars.getClientAddressIp().ip : '\x00'}&searchLatitude=${this.globalVars.getGeolocationClient() ? this.globalVars.getGeolocationClient().longitude.toString() : '\x00'}&searchLongitude=${this.globalVars.getGeolocationClient() ? this.globalVars.getGeolocationClient().longitude.toString() : '\x00'}`;
    // tslint:disable-next-line:max-line-length
    console.warn('PlmPharmaSearchEngineService', '*** request: ' + request);
    return this.http.get<any[]>(request);
  }

  getICDByText(searchText: string, editionId: number) {
    // tslint:disable-next-line:max-line-length
    const request = this.apiUrl + `getICD11ByText?code=${this.globalVars.getClientInfoValue().codeString}&editionId=${editionId}&search=${searchText}&searchAddressIP=${this.globalVars.getClientAddressIp() ? this.globalVars.getClientAddressIp().ip : '\x00'}&searchLatitude=${this.globalVars.getGeolocationClient() ? this.globalVars.getGeolocationClient().longitude.toString() : '\x00'}&searchLongitude=${this.globalVars.getGeolocationClient() ? this.globalVars.getGeolocationClient().longitude.toString() : '\x00'}`;
    console.warn('PlmPharmaSearchEngineService', '*** request: ' + request);
    return this.http.get<any[]>(request);
  }

  getLabs(searchText: string, editionId: number) {
    // tslint:disable-next-line:max-line-length
    const request = this.apiUrl + `getLabs?code=${this.globalVars.getClientInfoValue().codeString}&countryId=${environment.applicationInfo.countryId}&editionId=${editionId}&labName=${searchText}&searchAddressIP=${this.globalVars.getClientAddressIp() ? this.globalVars.getClientAddressIp().ip : null}&searchLatitude=${this.globalVars.getGeolocationClient() ? this.globalVars.getGeolocationClient().longitude.toString() : '\x00'}&searchLongitude=${this.globalVars.getGeolocationClient() ? this.globalVars.getGeolocationClient().longitude.toString() : '\x00'}`;
    // tslint:disable-next-line:max-line-length
    console.warn('PlmPharmaSearchEngineService', '*** request: ' + request);
    return this.http.get<any[]>(request);
  }

  getDrugsBySubstance(substanceId: number, editionId: number) {
    // tslint:disable-next-line:max-line-length
    const request = this.apiUrl + `getDrugsBySubstance?code=${this.globalVars.getClientInfoValue().codeString}&countryId=${environment.applicationInfo.countryId}&editionId=${editionId}&substanceId=${substanceId}&searchAddressIP=${this.globalVars.getClientAddressIp() ? this.globalVars.getClientAddressIp().ip : '\x00'}&searchLatitude=${this.globalVars.getGeolocationClient() ? this.globalVars.getGeolocationClient().longitude.toString() : '\x00'}&searchLongitude=${this.globalVars.getGeolocationClient() ? this.globalVars.getGeolocationClient().longitude.toString() : '\x00'}`;
    // tslint:disable-next-line:max-line-length
    console.warn('PlmPharmaSearchEngineService', '*** request: ' + request);
    return this.http.get<any[]>(request);
  }

  getDrugsByLab(labId: number, editionId: number) {
    // tslint:disable-next-line:max-line-length
    const request = this.apiUrl + `getDrugsByLab?code=${this.globalVars.getClientInfoValue().codeString}&countryId=${environment.applicationInfo.countryId}&editionId=${editionId}&labId=${labId}&searchAddressIP=${this.globalVars.getClientAddressIp() ? this.globalVars.getClientAddressIp().ip : '\x00'}&searchLatitude=${this.globalVars.getGeolocationClient() ? this.globalVars.getGeolocationClient().longitude.toString() : '\x00'}&searchLongitude=${this.globalVars.getGeolocationClient() ? this.globalVars.getGeolocationClient().longitude.toString() : '\x00'}`;
    // tslint:disable-next-line:max-line-length
    console.warn('PlmPharmaSearchEngineService', '*** request: ' + request);
    return this.http.get<any[]>(request);
  }

  getDrugsByICD(icdId: number, editionId: number) {
    // tslint:disable-next-line:max-line-length
    const request = this.apiUrl + `getDrugsByICD11?code=${this.globalVars.getClientInfoValue().codeString}&countryId=${environment.applicationInfo.countryId}&editionId=${editionId}&icdId=${icdId}&searchAddressIP=${this.globalVars.getClientAddressIp() ? this.globalVars.getClientAddressIp().ip : '\x00'}&searchLatitude=${this.globalVars.getGeolocationClient() ? this.globalVars.getGeolocationClient().longitude.toString() : '\x00'}&searchLongitude=${this.globalVars.getGeolocationClient() ? this.globalVars.getGeolocationClient().longitude.toString() : '\x00'}`;
    // tslint:disable-next-line:max-line-length
    console.warn('PlmPharmaSearchEngineService', '*** request: ' + request);
    return this.http.get<any[]>(request);
  }

  getCountResults(searchText: string, editionId: number): Observable<any> {
    const response1 = this.getResultsService(searchText, editionId);
    const response2 = this.clientsService.getMedicalGuidelinesByText(searchText);
    return forkJoin([response1, response2]);
  }

}
