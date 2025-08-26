import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalvarsService } from './globalvars.service';
import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable, forkJoin } from 'rxjs';
import { Section } from 'src/app/interfaces/models';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PlmAssetsEngineService {

  public getAbstractsResult = new BehaviorSubject<Array<any>>([]);
  public getAbstractsByUserResult = new BehaviorSubject<Array<any>>([]);

  public getAtlasResult = new BehaviorSubject<Array<any>>([]);
  public getAtlasByUserResult = new BehaviorSubject<Array<any>>([]);

  public getArticlesResult = new BehaviorSubject<Array<any>>([]);
  public getArticlesByUserResult = new BehaviorSubject<Array<any>>([]);

  public getClinicalCasesResult = new BehaviorSubject<Array<any>>([]);
  public getClinicalCasesByUserResult = new BehaviorSubject<Array<any>>([]);

  public getCalculatorsResult = new BehaviorSubject<Array<any>>([]);
  public getCalculatorsByUserResult = new BehaviorSubject<Array<any>>([]);

  public getAlgorithmsResult = new BehaviorSubject<Array<any>>([]);
  public getAlgorithmsByUserResult = new BehaviorSubject<Array<any>>([]);

  public getTherapeuticLineResult = new BehaviorSubject<Array<any>>([]);
  public getPodcastResult = new BehaviorSubject<Array<any>>([]);
  public getAllPodcastResult = new BehaviorSubject<Array<any>>([]);
  public getNationalEventsResult = new BehaviorSubject<Array<any>>([]);
  public getInternationalEventsResult = new BehaviorSubject<Array<any>>([]);

  public getGPCResult = new BehaviorSubject<Array<any>>([]);
  public getGPCByUserResult = new BehaviorSubject<Array<any>>([]);

  private apiUrl = '';
  private apiUrlClients = '';
  
  public therapeuticLineName: string = '';
  private apiUrlClientsendPoint = environment.restPLMClients.endPointName;

  // public atlasResult$ = this.getAtlasResult.asObservable();
  // private apiUrl = 'https://www.plmconnection.com/plmservices/RestPLMAssetsEngine/RestPLMAssetsEngine.svc/';

  constructor(
    private httpClient: HttpClient,
    private globalvarsService: GlobalvarsService
  ) { 
    const { protocol, server, path, endPointName } = environment.restRestPLMAssetsEngine;
    this.apiUrl = `${protocol}://${server}/${path}/${endPointName}/${endPointName}.svc/`;
    console.log('PlmAssetsEngineService', 'apiUrl: ' + this.apiUrl);
    
    this.apiUrlClients = `${protocol}://${server}/${path}/${this.apiUrlClientsendPoint}/${this.apiUrlClientsendPoint}.svc/`;
    console.log('apiUrlClients',  this.apiUrlClients);
  }

  getPLMNewsByClientByPrefixRequest() {
    const client = this.globalvarsService.getClientInfoValue();
    const deviceInfo = this.globalvarsService.getDeviceInfo();
    const countryKey = this.globalvarsService.getCountryKey();
    const target = deviceInfo.TargetId;
    const webMethod = this.apiUrl + `getPLMNewsByClientByPrefix?prefix=${client.prefijo}&targetId=${target}&country=${countryKey}&code=${client.codeString}`;
    return this.httpClient.get<any>(webMethod).pipe(map(result => {
      if (result.getPLMNewsByClientByPrefixResult) {
        return result.getPLMNewsByClientByPrefixResult;
      }
      return result;
    }));
  }

  getBannerByContentByPrefixRequest(electronicId: number) {
    const client = this.globalvarsService.getClientInfoValue();
    const deviceInfo = this.globalvarsService.getDeviceInfo();
    const countryKey = this.globalvarsService.getCountryKey();
    const target = deviceInfo.TargetId;
    const webMethod = this.apiUrl + `getBannerByContentByPrefix?code=${client.codeString}&prefix=${client.prefijo}&targetId=${target}&country=${countryKey}&electronicId=${electronicId}&resolutionKey=${deviceInfo.ResolutionKey}`;
    return this.httpClient.get<any>(webMethod)
      .pipe(map(result => {
        if (result.getBannerByContentByPrefixResult) {
          return result.getBannerByContentByPrefixResult;
        }
        return result;
      }));
  }

  getWelcomeInformationByClientByPrefixRequest(sectionId: Section) {
    const client = this.globalvarsService.getClientInfoValue();
    const deviceInfo = this.globalvarsService.getDeviceInfo();
    const countryKey = this.globalvarsService.getCountryKey();
    const target = deviceInfo.TargetId;
    console.log('PlmAssetsEngineService', 'codeString' + client.codeString);
    const webMethod = this.apiUrl + `getWelcomeInformationByClientByPrefix?code=${client.codeString}&prefix=${client.prefijo}&targetId=${target}&country=${countryKey}&sectionId=${sectionId}`;
    return this.httpClient.get<any>(webMethod)
      .pipe(map(result => {
        if (result.getWelcomeInformationByClientByPrefixResult) {
          return result.getWelcomeInformationByClientByPrefixResult;
        }
        return result;
      }));
  }

  getPodcastById(podcastId: number) {
    const client = this.globalvarsService.getClientInfoValue()
    const webMethod = this.apiUrl + `getPodcastById?code=${client.codeString}&podcastId=${podcastId}`;
    console.log('PlmAssetsEngineService', webMethod);
    return this.httpClient.get<any>(webMethod)
      .pipe(map(result => {
        if (result.getPodcastByIdResult) {
          return result.getPodcastByIdResult;
        }
        return result;
      }));
  }

  getPodcastByPrefixByCountry() {
    const client = this.globalvarsService.getClientInfoValue();
    const deviceInfo = this.globalvarsService.getDeviceInfo();
    const countryKey = this.globalvarsService.getCountryKey();
    const target = deviceInfo.TargetId;
    const webMethod = this.apiUrl + `getPodcastByPrefixByCountry?code=${client.codeString}&prefix=${client.prefijo}&country=${countryKey}`;
    console.log('PlmAssetsEngineService', webMethod);
    return this.httpClient.get<any>(webMethod)
      .pipe(map(result => {
        if (result.getPodcastByPrefixByCountryResult) {
          return result.getPodcastByPrefixByCountryResult;
        }
        return result;
      }));
  }

  getBannerByContentByPrefix(electronicId: number) {
    const client = this.globalvarsService.getClientInfoValue();
    const deviceInfo = this.globalvarsService.getDeviceInfo();
    const countryKey = this.globalvarsService.getCountryKey();
    const target = deviceInfo.TargetId;
    const webMethod = this.apiUrl + `getBannerByContentByPrefix?code=${client.codeString}&prefix=${client.prefijo}&targetId=${target}&country=${countryKey}&electronicId=${electronicId}&resolutionKey=${deviceInfo.ResolutionKey}`;
    
    return this.httpClient.get<any>(webMethod)
      .pipe(map(result => {
        if (result.getBannerByContentByPrefixResult) {
          return result.getBannerByContentByPrefixResult;
        }
        return result;
      }));
  }

  getContentsByTherapeuticLineByType(informationTypeId: number) {
    // tslint:disable-next-line: max-line-length
    const client = this.globalvarsService.getClientInfoValue();
    const deviceInfo = this.globalvarsService.getDeviceInfo();
    const countryKey = this.globalvarsService.getCountryKey();
    const target = deviceInfo.TargetId;
    const webMethod = this.apiUrl + `getContentsByTherapeuticLineByType?code=${client.codeString}&prefix=${client.prefijo}&targetId=${target}&informationTypeId=${informationTypeId}&country=${countryKey}`;
    console.log('PlmAssetsEngineService', 'webMethod: ' + webMethod);
    return this.httpClient.get<any>(webMethod);
  }

  getContentsByTherapeuticLineByTypeByUser(informationTypeId: number) {
    // tslint:disable-next-line: max-line-length
    const client = this.globalvarsService.getClientInfoValue();
    const deviceInfo = this.globalvarsService.getDeviceInfo();
    const countryKey = this.globalvarsService.getCountryKey();
    const target = deviceInfo.TargetId;
    const webMethod = this.apiUrl + `getContentsByTherapeuticLineByTypeByUser?code=${client.codeString}&prefix=${client.prefijo}&targetId=${target}&informationTypeId=${informationTypeId}&country=${countryKey}`;
    console.log('webMethod', webMethod);
    return this.httpClient.get<any>(webMethod);
  }

  getContentsResult(informationTypeId: number): Observable<any> {
    const response1 = this.getContentsByTherapeuticLineByType(informationTypeId);
    const response2 = this.getContentsByTherapeuticLineByTypeByUser(informationTypeId);
    return forkJoin([response1, response2]);
  }

  getPodcastTherapeuticLinesByPrefix() {
    // tslint:disable-next-line: max-line-length
    const client = this.globalvarsService.getClientInfoValue();
    const countryKey = this.globalvarsService.getCountryKey();
    const webMethod = this.apiUrl + `getPodcastTherapeuticLinesByPrefix?code=${client.codeString}&prefix=${client.prefijo}&country=${countryKey}`;
    console.log('PlmAssetsEngineService', 'webMethod: ' + webMethod);
    return this.httpClient.get<any>(webMethod);
  }

  getEventsByTherapeuticLineByCategory(categoryId: number) {
    // tslint:disable-next-line: max-line-length
    const client = this.globalvarsService.getClientInfoValue();
    const deviceInfo = this.globalvarsService.getDeviceInfo();
    const target = deviceInfo.TargetId;
    const webMethod = this.apiUrl + `getEventsByTherapeuticLineByCategory?code=${client.codeString}&prefix=${client.prefijo}&targetId=${target}&categoryId=${categoryId}`;
    return this.httpClient.get<any>(webMethod);
  }

  getPodcastByTherapeuticLineByPrefix(therapeuticLine: number) {
    // tslint:disable-next-line: max-line-length
    const client = this.globalvarsService.getClientInfoValue();
    const countryKey = this.globalvarsService.getCountryKey();
    const webMethod = this.apiUrl + `getPodcastByTherapeuticLineByPrefix?code=${client.codeString}&therapeuticLine=${therapeuticLine}&prefix=${client.prefijo}&country=${countryKey}`;
    return this.httpClient.get<any>(webMethod);
  }

  getGPC() {
    return this.getGPCResult.getValue();
  }

  getGPCByUser() {
    return this.getGPCByUserResult.getValue();
  }

  getClinicalCases() {
    return this.getClinicalCasesResult.getValue();
  }

  getClinicalCasesByUser() {
    return this.getClinicalCasesByUserResult.getValue();
  }

  getAbstracts() {
    return this.getAbstractsResult.getValue();
  }

  getAbstractsByUser() {
    return this.getAbstractsByUserResult.getValue();
  }

  getArticles() {
    return this.getArticlesResult.getValue();
  }

  getArticlesByUser() {
    return this.getArticlesByUserResult.getValue();
  }

  getAtlas() {
    return this.getAtlasResult.getValue();
  }

  getAtlasByUser() {
    return this.getAtlasByUserResult.getValue();
  }

  getCalculators() {
    return this.getCalculatorsResult.getValue();
  }

  getCalculatorsByUser() {
    return this.getCalculatorsByUserResult.getValue();
  }

  getAlgorithms() {
    return this.getAlgorithmsResult.getValue();
  }

  getAlgorithmsByUser() {
    return this.getAlgorithmsByUserResult.getValue();
  }

  getTherapeuticlines() {
    return this.getTherapeuticLineResult.getValue();
  }

  getPodcast() {
    return this.getPodcastResult.getValue();
  }

  getAllPodcast() {
    return this.getAllPodcastResult.getValue();
  }

  getNationalEvents() {
    return this.getNationalEventsResult.getValue();
  }

  getInternationalEvents() {
    return this.getInternationalEventsResult.getValue();
  }

  clearContents() {
    this.getAtlasResult.next([]);
    this.getAtlasByUserResult.next([]);

    this.getAbstractsResult.next([]);
    this.getAbstractsByUserResult.next([]);
  
    this.getArticlesResult.next([]);
    this.getArticlesByUserResult.next([]);

    this.getClinicalCasesResult.next([]);
    this.getClinicalCasesByUserResult.next([]);

    this.getGPCResult.next([]);
    this.getGPCByUserResult.next([]);

    this.getCalculatorsByUserResult.next([]);
    this.getCalculatorsResult.next([]);

    this.getAlgorithmsByUserResult.next([]);
    this.getAlgorithmsResult.next([]);
  }

  getClinicalCaseByIdResult(electronicId: number) {
    const client = this.globalvarsService.getClientInfoValue()
    const webMethod = this.apiUrlClients + `getClinicalCaseById?code=${client.codeString}&prefix=${client.prefijo}&electronicId=${electronicId}`;
    console.log('getClinicalCaseByIdResult', webMethod);
    return this.httpClient.get<any>(webMethod)
      .pipe(map(result => {
        if (result.getClinicalCaseByIdResult) {
          return result.getClinicalCaseByIdResult;
        }
        return result;
      }));
  }

  getElectronicInformationByIdDeepLink(electronicId: number) {
    const client = this.globalvarsService.getClientInfoValue();
    const countryKey = this.globalvarsService.getCountryKey();
    const webMethod = this.apiUrl + `getElectronicInformationById?code=${client.codeString}&prefix=${client.prefijo}&electronicId=${electronicId}`;
    console.warn('PlmAssetsEngineService', 'webMethod: ' + webMethod);
    return this.httpClient.get<any>(webMethod)
      .pipe(map(result => {
        return result.getElectronicInformationByIdResult;
      }));
  }

  getContentDeeplinkResult(electronicId: number): Observable<any> {
    const response1 = this.getClinicalCaseByIdResult(electronicId);
    const response2 = this.getElectronicInformationByIdDeepLink(electronicId);
    return forkJoin([response1, response2]);
  }
  
  getPodcastByIdDeepLink(electronicId: number) {
    const client = this.globalvarsService.getClientInfoValue();
    const webMethod = this.apiUrl + `getPodcastById?code=${client.codeString}&podcastId=${electronicId}`;
    console.log('PlmAssetsEngineService', 'webMethod: ' + webMethod);
    return this.httpClient.get<any>(webMethod)
      .pipe(map(result => {
        return result.getPodcastByIdResult;
      }));
  }

}
