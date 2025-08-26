import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { GlobalvarsService } from '../services/globalvars.service';
import {
  CompanyClientTypes,
  Target,
  InformationType,
  Section,
  ResolutionKey,
  Country,
  ISaveMobileLocationAppClient,
  IUpdateMobileLocationAppClient,
  AnswersClinicalCases
} from '../interfaces/models';
import { map, takeUntil } from 'rxjs/operators';
import { Subject, BehaviorSubject } from 'rxjs';
import { InAppBrowserService } from '../services/in-app-browser.service';
import { AlertController } from '@ionic/angular';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PlmClientsEngineService {

  apiUrl = '';
  private getCloseBranchesByPrefixByCompanyTypeResult = new BehaviorSubject<any>(null);
  private getClientDetailByEmailResult = new BehaviorSubject<any>(null);
  private getProfessionsResult = new BehaviorSubject<Array<any>>([]);
  private getSpecialitiesResult = new BehaviorSubject<Array<any>>([]);
  private getCountriesResult = new BehaviorSubject<Array<any>>([]);
  private getStateByCountryResult = new BehaviorSubject<Array<any>>([]);
  private getJobsResult = new BehaviorSubject<Array<any>>([]);
  private getBusinessActivitiesByPrefixByTargetResult = new BehaviorSubject<Array<any>>([]);
  public getEncyclopediasByPrefixByTargetResult = new BehaviorSubject<Array<any>>([]);

  private getBannerBySeccionResult = new BehaviorSubject<Array<any>>([]);

  public getAbstractsResult = new BehaviorSubject<Array<any>>([]);
  public abstractsResult$ = this.getAbstractsResult.asObservable();

  public getAtlassResult = new BehaviorSubject<Array<any>>([]);
  public atlasResult$ = this.getAbstractsResult.asObservable();

  public getCalculatorsResult = new BehaviorSubject<Array<any>>([]);
  public calculatorsResult$ = this.getCalculatorsResult.asObservable();

  public getClinicalStudiesResult = new BehaviorSubject<Array<any>>([]);
  public clinicalStudiesResult$ = this.getClinicalStudiesResult.asObservable();

  public getCriteriosTratamientoResult = new BehaviorSubject<Array<any>>([]);
  public criteriosTratamientoResult$ = this.getCriteriosTratamientoResult.asObservable();

  public getEvidenceBasedMedicineResult = new BehaviorSubject<Array<any>>([]);
  public evidenceBasedMedicineResult$ = this.getEvidenceBasedMedicineResult.asObservable();

  public getPodcastResult = new BehaviorSubject<Array<any>>([]);
  public podcastResult$ = this.getEvidenceBasedMedicineResult.asObservable();

  public getVideosResult = new BehaviorSubject<Array<any>>([]);
  public videosResult$ = this.getVideosResult.asObservable();

  public getVisualAidsResult = new BehaviorSubject<Array<any>>([]);
  public visualAidsResult$ = this.getVisualAidsResult.asObservable();

  public getProgramsResult = new BehaviorSubject<Array<any>>([]);
  public programsResult$ = this.getProgramsResult.asObservable();

  public getIllustrationsResult = new BehaviorSubject<Array<any>>([]);
  public illustrationsResul$ = this.getIllustrationsResult.asObservable();

  public getPatientSupportMaterialResult = new BehaviorSubject<Array<any>>([]);
  public patientSupportMaterial$ = this.getPatientSupportMaterialResult.asObservable();

  public getScientificArticlesResult = new BehaviorSubject<Array<any>>([]);
  public scientificArticlesResult$ = this.getScientificArticlesResult.asObservable();

  public getArticlesOpenAccessResult = new BehaviorSubject<Array<any>>([]);
  public articlesOpenAccessResult$ = this.getArticlesOpenAccessResult.asObservable();

  public getEventsNationalResult = new BehaviorSubject<Array<any>>([]);
  public eventsNational$ = this.getEventsNationalResult.asObservable();

  public getEventsInternationalResult = new BehaviorSubject<Array<any>>([]);
  public eventsInternational$ = this.getEventsInternationalResult.asObservable();

  public tipsForPatients = new BehaviorSubject<Array<any>>([]);
  public tipsForPatients$ = this.tipsForPatients.asObservable();

  public getInfografiasResult = new BehaviorSubject<Array<any>>([]);
  public infografias$ = this.getInfografiasResult.asObservable();

  public getInformationByPrefixByTypeResult = new BehaviorSubject<any>(null);
  public getInformationByPrefixByTypeResult$ = this.getInformationByPrefixByTypeResult.asObservable();
  
  public getInteractiveClinicalCaseResult = new BehaviorSubject<Array<any>>([]);
  public interactiveClinicalCaseResult$ = this.getInteractiveClinicalCaseResult.asObservable();

  public getClinicalPracticeGuidesResult = new BehaviorSubject<Array<any>>([]);
  public clinicalPracticeGuidesResult$ = this.getClinicalPracticeGuidesResult.asObservable();

  public getAlgorirthmsResult = new BehaviorSubject<Array<any>|null>(null);
  public algorithmsResult$ = this.getAlgorirthmsResult.asObservable();

  public getMedicalReferencesResult = new BehaviorSubject<Array<any>>([]);
  public medicalReferencesResult$ = this.getMedicalReferencesResult.asObservable();

  public getMedicalNotesResult = new BehaviorSubject<Array<any>>([]);
  public medicalNotesResult$ = this.getMedicalNotesResult.asObservable();

  public getWebinarsResult = new BehaviorSubject<Array<any>>([]);
  public webinarsResult$ = this.getWebinarsResult.asObservable();
  
  private saveMobileLocationAppResult = new BehaviorSubject<any>(null);
  private updateMobileLocationAppClientResult = new BehaviorSubject<any>(null);
  private getContactResult = new BehaviorSubject<Array<any>>([]);
  private getProfessionsByParentResult = new BehaviorSubject<Array<any>>([]);
  private getLocationsByStateResult = new BehaviorSubject<Array<any>>([]);
  private getSubspecialitiesResult = new BehaviorSubject<Array<any>>([]);
  private getCommentTypesByPrefixResult = new BehaviorSubject<Array<any>>([]);
  private httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

  getEventsByPrefixByCategoryResult = {
    National: [],
    International: []
  };

  constructor(
    //private httpNgx: HTTP,
    private http: HttpClient, 
    private alertCtrl: AlertController,
    private iab: InAppBrowserService,
    private globalVars: GlobalvarsService,
  ) {
    //const { protocol, server, port, path, endPointName } = environment.restPLMClients;
    //this.apiUrl = `${protocol}://${server}:${port}/${path}/${endPointName}/${endPointName}.svc/`;
    const { protocol, server, path, endPointName } = environment.restPLMClients;
    this.apiUrl = `${protocol}://${server}/${path}/${endPointName}/${endPointName}.svc/`;
  }

  getRegisterAppClient() {
    return this.saveMobileLocationAppResult;
  }

  getUpdateAppClient() {
    return this.updateMobileLocationAppClientResult;
  }

  getClientDetailByEmail() {
    return this.getClientDetailByEmailResult;
  }

  getprofession() {
    return this.getProfessionsResult;
  }

  getSpecialities() {
    return this.getSpecialitiesResult;
  }

  getCountries() {
    return this.getCountriesResult;
  }

  getStateByCountry() {
    return this.getStateByCountryResult;
  }

  getBusinessActivitiesByPrefixByTarget() {
    return this.getBusinessActivitiesByPrefixByTargetResult;
  }

  getCloseBranchesByPrefixByCompanyType() {
    return this.getCloseBranchesByPrefixByCompanyTypeResult;
  }

  getBannerBySeccion() {
    return this.getBannerBySeccionResult;
  }

  getAbstracts() {
    return this.getAbstractsResult.getValue();
  }

  getAtlas() {
    return this.getAtlassResult.getValue();
  }

  getCalculators() {
    return this.getCalculatorsResult.getValue();
  }

  getClinicalStudies() {
    return this.getClinicalStudiesResult.getValue();
  }

  getCriteriosTratamiento() {
    return this.getCriteriosTratamientoResult.getValue();
  }

  getPodcast() {
    return this.getPodcastResult.getValue();
  }

  getVideos() {
    return this.getVideosResult.getValue();
  }

  getVisualAids() {
    return this.getVisualAidsResult.getValue();
  }

  getInteractiveClinicalCase() {
    return this.getInteractiveClinicalCaseResult.getValue();
  }

  getClinicalPracticeGuides(){
    return this.getClinicalPracticeGuidesResult.getValue();
  }

  getPrograms() {
    return this.getProgramsResult.getValue();
  }

  getIllustrations() {
    return this.getIllustrationsResult.getValue();
  }

  getPatientSupportMaterial() {
    return this.getPatientSupportMaterialResult.getValue();
  }

  getEventsNational() {
    return this.getEventsNationalResult.getValue();
  }

  getEventsInternational() {
    return this.getEventsInternationalResult.getValue();
  }

  getInfografias() {
    return this.getInfografiasResult.getValue();
  }

  getContact() {
    return this.getContactResult;
  }

  getProfessionsByParent() {
    return this.getProfessionsByParentResult;
  }

  getLocationsByState() {
    return this.getLocationsByStateResult;
  }

  getSubspecialities() {
    return this.getSubspecialitiesResult;
  }

  getCommentTypesByPrefix() {
    return this.getCommentTypesByPrefixResult;
  }

  getScientificArticles() {
    return this.getScientificArticlesResult.getValue();
  }

  getAlgorithms() {
    return this.getAlgorirthmsResult.getValue();
  }

  getMedicalReferences() {
    return this.getMedicalReferencesResult.getValue();
  }

  getMedicalNotes() {
    return this.getMedicalNotesResult.getValue();
  }

  getArticlesOpenAccess() {
    return this.getArticlesOpenAccessResult.getValue();
  }

  getWebinars() {
    return this.getWebinarsResult.getValue();
  }

  // Request Rest Api
  getClientDetailByEmailRequest(email: string) {
    const webMethod = this.apiUrl + `getClientInformationDetailByEmail?email=${email}`;
    return this.http.get<any>(webMethod)
      .pipe(map((response) => {
        if (response.getClientInformationDetailByEmailResult) {
          this.getClientDetailByEmailResult.next(response.getClientInformationDetailByEmailResult);
        } else {
          this.getClientDetailByEmailResult.next(response);
        }
        return this.getClientDetailByEmailResult.asObservable();
      }));
  }

  getProfessionsRequest() {
    const webMethod = this.apiUrl + 'getProfessions';
    console.warn('PlmClientsEngineService: ', '***  webMethod: ' + webMethod);
    return this.http.get<any>(webMethod)
      .pipe(map((response) => {
        if (response.getProfessionsResult) {
          this.getProfessionsResult.next(response.getProfessionsResult);
        } else {
          this.getProfessionsResult.next(response);
        }
        return this.getProfessionsResult.asObservable();
      }));
  }

  getProfessionsByParentRequest(parentId: number) {
    const webMethod = this.apiUrl + `getProfessionsByParent?parentId=${parentId}`;
    return this.http.get<any>(webMethod)
      .pipe(map(result => {
        if (result.getProfessionsByParentResult) {
          this.getProfessionsByParentResult.next(result.getProfessionsByParentResult);
        } else {
          this.getProfessionsByParentResult.next(result);
        }
        return this.getProfessionsByParentResult.asObservable();
      }));
  }

  getSpecialitiesRequest(professionId: number) {
    const webMethod = this.apiUrl + `getSpecialities?professionId=${professionId}`;
    return this.http.get<any>(webMethod)
      .pipe(map((response) => {
        if (response.getSpecialitiesResult) {
          this.getSpecialitiesResult.next(response.getSpecialitiesResult);
        } else {
          this.getSpecialitiesResult.next(response);
        }
        return this.getSpecialitiesResult.asObservable();
      })
      );
  }

  getCountriesRequest() {
    const webMethod = this.apiUrl + 'getCountries';
    console.warn('PlmClientsEngineService: ', '***  webMethod: ' + webMethod);
    return this.http.get<any>(webMethod)
      .pipe(map((response) => {
        if (response.getCountriesResult) {
          this.getCountriesResult.next(response.getCountriesResult);
        } else {
          this.getCountriesResult.next(response);
        }
        return this.getCountriesResult.asObservable();
      }));
  }

  getStateByCountryRequest(countryId: Country | number) {
    const webMethod = this.apiUrl + `getStateByCountry?countryId=${countryId}`;
    return this.http.get<any>(webMethod)
      .pipe(map((response) => {
        if (response.getStateByCountryResult) {
          this.getStateByCountryResult.next(response.getStateByCountryResult);
        } else {
          this.getStateByCountryResult.next(response);
        }
        return this.getStateByCountryResult.asObservable();
      }));
  }

  getJobsRequest() {
    const webMethod = this.apiUrl + 'getJobs';
    return this.http.get<any>(webMethod)
      .pipe(map((response) => {
        if (response.getJobsResult) {
          this.getJobsResult.next(response.getJobsResult);
        } else {
          this.getJobsResult.next(response);
        }
        return this.getJobsResult.asObservable();
      }));
  }

  getBusinessActivitiesByPrefixByTargetRequest(prefix: string, target: Target | string) {
    const webMethod = this.apiUrl + `getBusinessActivitiesByPrefixByTarget?prefix=${prefix}&target=${target}`;
    return this.http.get<any>(webMethod)
      .pipe(map((response) => {
        if (response.getBusinessActivitiesByPrefixByTargetResult) {
          this.getBusinessActivitiesByPrefixByTargetResult.next(response.getBusinessActivitiesByPrefixByTargetResult);
        } else {
          this.getBusinessActivitiesByPrefixByTargetResult.next(response);
        }
        return this.getBusinessActivitiesByPrefixByTargetResult.asObservable();
      }));
  }

  getEncyclopediasByPrefixByTargetRequest(prefix: string) {
    // http://dev.plmconnection.com/plmservices/RestPLMClientsEngine/RestPLMClientsEngine.svc/getEncyclopediasByPrefixByTarget?prefix={PREFIX}&target={TARGET}
    const webMethod = this.apiUrl + `getEncyclopediasByPrefixByTarget?prefix=${prefix}&target=${this.globalVars.getDeviceInfo().TargetName}`;
    return this.http.get<any>(webMethod)
      .pipe(map((response) => {
        if (response.getEncyclopediasByPrefixByTargetResult) {
          return response.getEncyclopediasByPrefixByTargetResult;
        } else {
          return [];
        }
      }));
  }

  getCloseBranchesByPrefixByCompanyTypeRequest(prefix: string,
    companyType: CompanyClientTypes | string,
    clientLatitude: number | string,
    clientLongitude: number | string) {
    // tslint:disable-next-line: max-line-length
    const webMethod = this.apiUrl + `getCloseBranchesByPrefixByCompanyType?prefix=${prefix}&companyType=${companyType}&clientLatitude=${clientLatitude}&clientLongitude=${clientLongitude}`;
    return this.http.get<any>(webMethod)
      .pipe(map(result => {
        if (result.getCloseBranchesByPrefixByCompanyTypeResult) {
          this.getCloseBranchesByPrefixByCompanyTypeResult.next(result.getCloseBranchesByPrefixByCompanyTypeResult);
        } else {
          this.getCloseBranchesByPrefixByCompanyTypeResult.next(result);
        }
        return this.getCloseBranchesByPrefixByCompanyTypeResult.asObservable();
      }));
  }

  getBannerBySeccionRequest(prefix: string,
    target: Target | string,
    country: Country | string,
    section: Section | string,
    resolutionKey: ResolutionKey) {
    // tslint:disable-next-line: max-line-length
    const webMethod = this.apiUrl + `getInformationBySection?prefix=${prefix}&target=${target}&country=${country}&section=${section}&resolutionKey=${resolutionKey}`;
    console.warn('Banner PlmClientsEngineService: ', webMethod);
    return this.http.get<any>(webMethod)
      .pipe(map(result => {
        console.warn('Banner PlmClientsEngineService: ', {result: result});
        if (result.getInformationBySectionResult) {
          this.getBannerBySeccionResult.next(result.getInformationBySectionResult);
        } else {
          this.getBannerBySeccionResult.next(result);
        }
        return this.getBannerBySeccionResult.asObservable();
      }));
  }

  getAbstractsRequest() {
    // tslint:disable-next-line: max-line-length
    const webMethod = this.apiUrl + `getInformationByPrefixByType?prefix=${environment.applicationInfo.prefix}&targetId=${this.globalVars.getDeviceInfo().TargetId}&informationTypeId=${InformationType.Abstracts}&country=${this.globalVars.getCountryKey()}`;
    return this.http.get<any>(webMethod)
      .pipe(map(result => {
        if (result.getInformationByPrefixByTypeResult) {
          this.getAbstractsResult.next(result.getInformationByPrefixByTypeResult);
        } else {
          this.getAbstractsResult.next([]);
        }
        return this.getAbstractsResult.asObservable();
      }));
  }

  getInformationByPrefixByType(informationType: InformationType | string) {
    // tslint:disable-next-line: max-line-length
    const webMethod = this.apiUrl + `getInformationByPrefixByType?prefix=${environment.applicationInfo.prefix}&targetId=${this.globalVars.getDeviceInfo().TargetId}&informationTypeId=${informationType}&country=${environment.applicationInfo.countryKey}`;
    console.warn('PlmClientsEngineService: ', webMethod);
    return this.http.get<any>(webMethod);
  }

  getRemoteData() {
    console.log('PlmClientsEngineService: ', 'on getRemoteData()');
    this.http.get('https://www.reddit.com/r/gifs/top/.json?limit=105sort=hot').subscribe(res => {
      console.log('PlmClientsEngineService: ', res);
    });
  }

  getJSONProducts() {
    console.log('PlmClientsEngineService: ', 'getJSONProducts()');
    // tslint:disable-next-line: max-line-length
    return this.http.get('http://www.plmconnection.com/plmservices/Tools/Mexico/criterios_tratamiento_salud_cardiometabolica/products/alpharmaProducts.json');
  }


  addComment(data: any) {
    // tslint:disable-next-line:max-line-length
    const request = this.apiUrl + `addClientComment?commentTypeId=${environment.commentInfo.commentTypeId}&branchId=${environment.applicationInfo.branchId}&businessUnitId=${environment.applicationInfo.businessUnitId}&distributionId=${environment.applicationInfo.distributionId}&prefixId=${environment.applicationInfo.prefixId}&targetId=${this.globalVars.getDeviceInfo().TargetId}&content=${data}&code=${this.globalVars.getClientInfoValue().codeString}`;
    //console.log('request', this.http.get(request));
    console.log('PlmClientsEngineService: ', 'request: ' + request);
    // console.log('===>', data);
    return this.http.get(request);
  }

  setSharingPersonalInformationClient(authorization: boolean) {
    console.log('PlmClientsEngineService: ', authorization);
    // tslint:disable-next-line:max-line-length
    const request = this.apiUrl + `setSharingPersonalInformationClient?code=${this.globalVars.getClientInfoValue().codeString}&prefix=${environment.applicationInfo.prefix}&authorization=${authorization}`;
    console.log('PlmClientsEngineService: ', 'request: ' + request);
    return this.http.get(request);
  }

  registerAppClientRequest(data: ISaveMobileLocationAppClient) {
    const webMethod = this.apiUrl + 'saveMobileLocationAppClient';
    console.log('PlmClientsEngineService - registerAppClientRequest ', data);
    return this.http.post<any>(webMethod, data, this.httpOptions)
      .pipe(map(result => {
        console.log('PlmClientsEngineService: ', 'result: ' + result);
        if (result.saveMobileLocationAppClientResult) {
          this.saveMobileLocationAppResult.next(result.saveMobileLocationAppClientResult);
        } else {
          this.saveMobileLocationAppResult.next(result);
        }
        console.log('PlmClientsEngineService: ', this.saveMobileLocationAppResult.asObservable());
        return this.saveMobileLocationAppResult.asObservable();
      }));
  }

  updateAppClientRequest(data: IUpdateMobileLocationAppClient) {
    const webMethod = this.apiUrl + 'updateMobileLocationAppClient';
    return this.http.post<any>(webMethod, data, this.httpOptions)
      .pipe(map(result => {
        if (result.updateMobileLocationAppClientResult) {
          this.updateMobileLocationAppClientResult.next(result.updateMobileLocationAppClientResult);
        } else {
          this.updateMobileLocationAppClientResult.next(result);
        }
        return this.updateMobileLocationAppClientResult.asObservable();
      }));
  }


  getMedicalGuidelinesByText(searchText: string) {
    // tslint:disable-next-line:max-line-length
    return this.http.get<any[]>('http://173.193.89.18/plmservices/RestPLMClientsEngine/RestPLMClientsEngine.svc/getMedicalGuidelinesByText?prefix=PLMMEDICAMEMOV4&text=' + searchText);
  }

  getContactRequest(country: Country | string) {
    const webMethod = this.apiUrl + `getContact?country=${country}`;
    console.warn('PlmClientsEngineService', '*** webMethod: ' + webMethod)
    return this.http.get<any>(webMethod)
      .pipe(map(result => {
        const info = {
          countryKey: country,
          value: result
        };
        console.warn('PlmClientsEngineService', '*** info: ' + JSON.stringify(info))
        if (!this.getContactResult.getValue()) {
          this.getContactResult.next([]);
        }
        this.getContactResult.getValue().push(info);
        return result;
      }));
  }
  getProgramasdeApegoRequest(prefix: string, targetId: Target, informationType: InformationType | string, country: Country | string) {
    // tslint:disable-next-line: max-line-length
    const webMethod = this.apiUrl + `getInformationByPrefixByType?prefix=${prefix}&targetId=${targetId}&informationTypeId=${informationType}&country=${country}`;
    return this.http.get<any>(webMethod)
      .pipe(map(result => {
        if (result.getInformationByPrefixByTypeResult) {
          this.getInfografiasResult.next(result.getInformationByPrefixByTypeResult);
        } else {
          this.getInfografiasResult.next(result);
        }
        return this.getInfografiasResult.asObservable();
      }));
  }

  getLocationsByStateRequest(stateId: number) {
    const webMethod = this.apiUrl + `getLocationsByState?stateId=${stateId}`;
    return this.http.get<any>(webMethod)
      .pipe(map(result => {
        if (result.getLocationsByStateResult) {
          this.getLocationsByStateResult.next(result.getLocationsByStateResult);
        } else {
          this.getLocationsByStateResult.next(result);
        }
        return this.getLocationsByStateResult.asObservable();
      }));
  }

  getLocationsByState1(stateId: number) {
    const webMethod = this.apiUrl + `getLocationsByState?stateId=${stateId}`;
    // tslint:disable-next-line:max-line-length
    return this.http.get<any[]>(webMethod);
  }

  getSubspecialitiesRequest(specialityId: number) {
    const webMethod = this.apiUrl + `/getSubspecialities?specialityId=${specialityId}`;
    return this.http.get<any>(webMethod)
      .pipe(map(result => {
        if (result.getSubspecialitiesResult) {
          this.getSubspecialitiesResult.next(result.getSubspecialitiesResult);
        } else {
          this.getSubspecialitiesResult.next(result);
        }
      }));
  }

  getCommentTypesByPrefixRequest(target: Target | string, prefix: string) {
    const webMethod = this.apiUrl + `getCommentTypesByPrefix?target=${target}&prefix=${prefix}`;
    console.warn('PlmClientsEngineService: ', '***  webMethod: ' + webMethod);
    return this.http.get<any>(webMethod)
      .pipe(map(result => {
        if (result.getCommentTypesByPrefixResult) {
          this.getCommentTypesByPrefixResult.next(result.getCommentTypesByPrefixResult);
        } else {
          this.getCommentTypesByPrefixResult.next(result);
        }
        return this.getCommentTypesByPrefixResult.asObservable();
      }));

  }

  // tslint:disable-next-line: max-line-length
  addClientCommentRequest(commentTypeId: number, branchId: number, businessUnitId: number, distributionId: number, prefixId: number, targetId: number, content: string, code: string) {
    // tslint:disable-next-line: max-line-length
    const webMethod = this.apiUrl + `addClientComment?commentTypeId=${commentTypeId}&branchId=${branchId}&businessUnitId=${businessUnitId}&distributionId=${distributionId}&prefixId=${prefixId}&targetId=${targetId}&content=${content}&code=${code}`;
    return this.http.get<any>(webMethod);
  }

  getCongresosMedicos(category: number) {
    // tslint:disable-next-line: max-line-length
    const webMethod = this.apiUrl + `getEventsByPrefixByCategory?prefix=${environment.applicationInfo.prefix}&target=${this.globalVars.getDeviceInfo().TargetId}&category=${category}`;
    console.log('PlmClientsEngineService: ', 'webMethod: ' + webMethod);
    return this.http.get<any>(webMethod);
  }


  async getAppVersionByPrefix() {
    console.log('PlmClientsEngineService: ', 'Invocanfo  getAppVersionByPrefix()' );
    // if (!token) return;
    const webMethod = this.apiUrl + `getAppVersionByPrefix?prefix=${environment.applicationInfo.prefix}`;
    console.log('PlmClientsEngineService: ', 'webMethod: ' + webMethod);
    const dataInfo = {
      Version: environment.applicationInfo.version,
      TargetId: this.globalVars.getDeviceInfo().TargetId
    }
    console.log('PlmClientsEngineService: ', 'dataInfo' + dataInfo);
    return this.http
      .post<any>(webMethod, dataInfo, this.httpOptions).toPromise()
      .then((result) => {
        console.log('PlmClientsEngineService: ', '--> ' + result);
        if(result!==null){
          console.warn('PlmClientsEngineService: ', 'result is not null');
          if(result.StatusId===2)
          this.activeNotifying(result);
          if(result.StatusId===3)
          this.locked(result);
        }
      })
      .catch(ex => {
        console.warn('PlmClientsEngineService: ', 'getAppVersionByPrefix Error: ' + JSON.stringify(ex));
      });
  }

  private async locked(version: any) {
    this.alertCtrl.dismiss().finally(() => {
      this.alertCtrl.create({
        header: 'Nueva versión disponible!',
        message: version.Message,
        backdropDismiss: false,
        buttons: [ {
            text: 'Aceptar',
            handler: () => {
             console.log('PlmClientsEngineService: ', 'Confirm Okay');
             this.iab.open(version.URLStore);
            }
          }
        ]
      }).then(AlertEl => {
        AlertEl.present();
      });
    });
  }

  private async activeNotifying(version: any) {
    this.alertCtrl.dismiss().finally(() => {
      this.alertCtrl.create({
        header: 'Nueva versión disponible!',
        message: version.Message,
        backdropDismiss: false,
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
              console.warn('PlmClientsEngineService: ', 'invocar el método de cancelar');
            }
          }, {
            text: 'Aceptar',
            handler: () => {
             console.log('PlmClientsEngineService: ', 'Confirm Okay');
             this.iab.open(version.URLStore);
            }
          }
        ]
      }).then(AlertEl => {
        AlertEl.present();
      });
    });
  }


  getSendAccountDeletionConfirmationRequest(email: string) {
    const webMethod = this.apiUrl + `sendAccountDeletionConfirmation?code=${this.globalVars.getClientInfoValue().codeString}&email=${email}&appName=${environment.applicationInfo.name}`;
    //let code = 'TbksSIICunwowsQQ3YFKVxdm8OU6'; // codeString de Aron
    //const webMethod = this.apiUrl + `sendAccountDeletionConfirmation?code=${code}&email=${email}&appName=${environment.applicationInfo.name}`;
    console.log('PlmClientsEngineService: ', 'SendAccountDeletionConfirmation: ' + webMethod);
    //console.log('return', this.http.get<any>(webMethod));
    return this.http.get<any>(webMethod);
  }

  getValidCodeRequest() {
    const webMethod = this.apiUrl + `validCode?codeString=${this.globalVars.getClientInfoValue().codeString}`;
    //let code = 'TbksSIICunwowsQQ3YFKVxdm8OU6'; // codeString de Aron
    //const webMethod = this.apiUrl + `validCode?codeString=${code}`;
    console.warn('PlmClientsEngineService: ', 'validCode: ' + webMethod);
    //console.log('return', this.http.get<any>(webMethod));
    return this.http.get<any>(webMethod);
  }

  printErrorMsg(ex: any) {
    return JSON.stringify(ex);
  }

  //INIT INTETRACTIVE CLINICAL CASE 
  getClinicalCaseByIdResult(electronicId: number) {
    const client = this.globalVars.getClientInfoValue()
    //const electronicIdv = 15032;
    const webMethod = this.apiUrl + `getClinicalCaseById?code=${client.codeString}&prefix=${client.prefijo}&electronicId=${electronicId}`;
    console.log('webMethod ClinicalCase', webMethod);
    return this.http.get<any>(webMethod)
      .pipe(map(result => {
        if (result.getClinicalCaseByIdResult) {
          return result.getClinicalCaseByIdResult;
        }
        return result;
      }));
  }

  answerClinicalCase(answer: AnswersClinicalCases ) {
      const unsubscribe$: Subject<boolean> = new Subject<boolean>();
      const client = this.globalVars.getClientInfoValue()
      const webMethod = this.apiUrl + `addTrakingCodeaskAnswer?code=${client.codeString}&prefix=${client.prefijo}`;
      console.log('********** WEBMETHOD **********', webMethod);
      console.log('********** ANSWERS SERVICIO **********', answer);
      return this.http
        .post<any>(webMethod, answer, this.httpOptions)
        .pipe(takeUntil(unsubscribe$))
        .subscribe({
          next: responseData => console.warn(responseData),
          error: ex => {
            console.error('addTrakingCodeaskAnswer Error: ', JSON.stringify(ex));
            unsubscribe$.next(true);
            unsubscribe$.complete();
          },
          complete: () => {
            unsubscribe$.next(true);
            unsubscribe$.complete();
          }
        });
    }
    //FINISH INTERACTIVE CLINICAL CASE

}
