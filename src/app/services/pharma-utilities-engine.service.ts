import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { GlobalvarsService } from './globalvars.service';

@Injectable({
  providedIn: 'root'
})
export class PharmaUtilitiesEngineService {

  private apiUrl = '';

  constructor(
    private http: HttpClient,
    private globalVarsService: GlobalvarsService
  ) {
    const { protocol, server, path, endPointName } = environment.restPharmaUtilities;
    this.apiUrl = `${protocol}://${server}/${path}/${endPointName}/${endPointName}.svc/`;
  }

  getProductShots(divisionId: number, categoryId: number, productId: number, pharmaFormId: number, presentationId?: number) {
    // tslint:disable-next-line: max-line-length
    let request = this.apiUrl + `getProductShots?code=${this.globalVarsService.getClientInfoValue().codeString}&editionId=${environment.applicationInfo.editionId}&divisionId=${divisionId}&categoryId=${categoryId}&productId=${productId}&pharmaFormId=${pharmaFormId}&resolutionKey=${this.globalVarsService.getDeviceInfo().ResolutionKey}`;
    if (presentationId) {
      request += `presentationId=${presentationId}` ;
    }
    return this.http.get<any>(request);
  }

}
