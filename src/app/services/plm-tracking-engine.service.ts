import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { InfoEntities, IInfoTracking, ITrackingInfo, IPushTrackingInfo, SearchType } from '../interfaces/models';
import { GlobalvarsService } from '../services/globalvars.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlmTrackingEngineService {

  private apiUrl = '';
  private httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

  constructor(
    private http: HttpClient
  ) {
    const { protocol, server, path, endPointName } = environment.restPLMTracking;
    this.apiUrl = `${protocol}://${server}/${path}/${endPointName}/${endPointName}.svc/`;
  }
  
  addTrackingBySection(strLabel: string, strLabelValue?: string, crntGlblVars?: GlobalvarsService) {
    console.log('addTrackingBySection - vars', strLabel, strLabelValue, crntGlblVars);
    const today = new Date().getTime();
    let latitude = '';
    let longitude = '';
    let ip = '';
   
    let newGlobalVars = crntGlblVars;
    const clientPosition = crntGlblVars?.getGeolocationClient();
    const clientAddress = crntGlblVars?.getClientAddressIp();
    if (clientPosition) {
      latitude = clientPosition.latitude.toString();
      longitude = clientPosition.longitude.toString();
    }
    if (clientAddress) {
      ip = clientAddress.ip;
    }
    if (newGlobalVars) {
      const data: IInfoTracking = {
        CodeString: newGlobalVars.getClientInfoValue().codeString,
        Date: '\/Date(' + today.toString() + '+0200)\/',
        ElectronicId: 0,
        EntityId: InfoEntities.Section,
        Label: strLabel,
        LabelValue: (strLabelValue ? strLabelValue : strLabel),
        SearchAddressIP: ip,
        SearchLatitude: latitude,
        SearchLongitude: longitude,
        SearchText: '',
        SearchTypeId: SearchType.parametrizado,
        SourceId: newGlobalVars.getInfoTrackingSource()
      };
      console.warn('PlmTrackingEngineService:', '*** data: ' + JSON.stringify(data));
      const unsubscribe$: Subject<boolean> = new Subject<boolean>();
      const webMethod = this.apiUrl + 'addInfoTracking';
      console.warn('PlmTrackingEngineService:', '*** webMethod: ' + webMethod);
      return this.http
        .post<any>(webMethod, data, this.httpOptions)
        .pipe(takeUntil(unsubscribe$))
        .subscribe({
          next: responseData => console.warn(responseData),
          error: ex => {
            console.log('addInfoTracking Error: ',ex);
            unsubscribe$.next(true);
            unsubscribe$.complete();
          },
          complete: () => {
            unsubscribe$.next(true);
            unsubscribe$.complete();
          }
        });
    } else {
      return false;
    }
  }

  addInfoTracking(data: IInfoTracking) {
    console.log('TrackingEngineService', '***  data: ' + JSON.stringify(data));
    const webMethod = this.apiUrl + 'addInfoTracking';
    return this.http
      .post<any>(webMethod, data, this.httpOptions)
      .subscribe({
        next: responseData => console.warn('TrackingEngineService', responseData),
        error: ex => console.error('TrackingEngineService', 'addInfoTracking Error: ' + JSON.stringify(ex)),
        complete: () => console.log('TrackingEngineService', 'succesful addInfoTracking')
      });
  }

  addPushTracking(data: IPushTrackingInfo) {
    const webMethod = this.apiUrl + 'addPushTracking';
    return this.http
      .post<any>(webMethod, data, this.httpOptions)
      .subscribe({
        next: responseData => console.warn('TrackingEngineService', responseData),
        error: ex => console.error('TrackingEngineService', 'addPushTracking Error: ' + JSON.stringify(ex)),
        complete: () => console.log('TrackingEngineService', 'succesful addPushTracking')
      });
  }

  addPLMTrackingActivity(data: ITrackingInfo) {
    const webMethod = this.apiUrl + 'addPLMTrackingActivity';
    return this.http
      .post<any>(webMethod, data, this.httpOptions)
      .subscribe({
        next: responseData => console.warn('TrackingEngineService', responseData),
        error: ex => console.error('TrackingEngineService', JSON.stringify(ex)),
        complete: () => console.log('TrackingEngineService', 'succesful addPLMTrackingActivity')
      });
  }

  getIpClient() {
    return this.http.get('https://api.ipify.org?format=json');
  }

}
