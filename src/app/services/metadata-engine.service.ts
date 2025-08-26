import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { GlobalvarsService } from '../services/globalvars.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MetadataEngineService {

  private apiUrl = '';
  searchText: string;

  public scientificArticleResult = new BehaviorSubject<Array<any>>([]);
  public scientificArticle$ = this.scientificArticleResult.asObservable();

  constructor(
    private http: HttpClient,
    private globalvarsService: GlobalvarsService) {
    const { protocol, server,  path, endPointName } = environment.restMetadata;
    this.apiUrl = `${protocol}://${server}/${path}/${endPointName}/${endPointName}.svc/`;
  }

  getScientificArticlesRequest() {
    // tslint:disable-next-line: max-line-length
    const webMethod = this.apiUrl + `getScientificArticles?code=${this.globalvarsService.getClientInfoValue().codeString}&searchText=${this.searchText}&retMax=10`;
    return this.http.get<any>(webMethod);
  }

  getScientificArticle() {
    return this.scientificArticleResult.getValue();
  }

}
