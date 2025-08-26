import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { BehaviorSubject } from 'rxjs';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { ControllersIonicService } from './controllers-ionic.service';
import { PlmPharmaSearchEngineService } from './plm-pharma-search-engine.service';
import { HttpClient } from '@angular/common/http';
import { HttpFetchService } from './http-fetch-service';

@Injectable({
  providedIn: 'root'
})
export class AutocompleteService {

  public showList = new BehaviorSubject<boolean>(false);
  private searchEngineSuggestion: any = {};
  private searchEnginePubMedSuggestion: any = {};
  private time: string = '';
  private searchListResult = new BehaviorSubject<any>(null);
  private substancesListResult = new BehaviorSubject<any>(null);

  productsFiltered: Array<any> = [];
  substancesFiltered: Array<any> = [];
  icdFiltered: Array<any> = [];
  labsFiltered: Array<any> = [];
  pubMedFiltered: Array<any> = [];

  constructor(
    private plt: Platform,
    private router: Router,
    //private ngZone: NgZone,
    private ngxHttp: HttpFetchService,
    private httpClient: HttpClient,
    // private metadataEngineService: MetadataEngineService,
    private pharmaSearchEngine: PlmPharmaSearchEngineService,
    private controllersIonicService: ControllersIonicService
  ) {
    if (this.searchEngineSuggestion.baseUrl === undefined && this.searchEngineSuggestion.jsonFile === undefined) {
      const { protocol, server, pathName, buscador } = environment.autoComplete;
      this.searchEngineSuggestion.baseUrl = `${protocol}://${server}/${pathName}/`;
      this.searchEngineSuggestion.jsonFile = buscador;
    }
    if (this.searchEnginePubMedSuggestion.baseUrl === undefined && this.searchEnginePubMedSuggestion.jsonFile === undefined) {
      const { protocol, server, pathName, pubmed } = environment.sharedResources;
      this.searchEnginePubMedSuggestion.baseUrl = `${protocol}://${server}/${pathName}/`;
      this.searchEnginePubMedSuggestion.jsonFile = pubmed;
    }
    if (!this.time && this.plt.is('ios')) {
      this.time = '?t=' + new Date().getTime();
    }
  }

  checkData(pubMed: boolean) {
    console.log('AutocompleteService', '***  pubMed: ' + pubMed);
    if (pubMed) {
      if (this.substancesListResult.getValue() === null) {
        this.getSearchListRequest(this.getFinalUrl(pubMed))
          .then(json => {
            if (json !== null) {
              this.substancesListResult.next(json);
            }
          })
          .catch(ex => {
            console.log('AutocompleteService', ex);
          });
      }
    } else {
      if (this.searchListResult.getValue() === null) {
        this.getSearchListRequest(this.getFinalUrl(pubMed))
          .then(json => {
            console.log('AutocompleteService', json);
            if (json && Array.isArray(json)) {
              const strJSON = JSON.stringify(json);
              const aryJSON = JSON.parse(strJSON);
              console.log('AutocompleteService', '***  aryJSON-length: ' + aryJSON.length);
              let Medicamentos: any = [];
              let Sustancias: any = [];
              let ICD: any = [];
              let Laboratorios: any = [];
              Medicamentos = aryJSON.filter((item: { [x: string]: string; }) => item['category'] === 'Medicamentos');
              console.log('AutocompleteService', '***  Medicamentos: ' + JSON.stringify(Medicamentos));
              Sustancias = aryJSON.filter((item: { [x: string]: string; }) => item['category'] === 'Sustancias');
              ICD = aryJSON.filter((item: { [x: string]: string; }) => item['category'] === 'ICD');
              Laboratorios = aryJSON.filter((item: { [x: string]: string; }) => item['category'] === 'Laboratorios');
              console.log('AutocompleteService', '***  searchListResult.next([])');
              this.searchListResult.next([]);
              this.searchListResult.getValue().push(Medicamentos);
              this.searchListResult.getValue().push(Sustancias);
              this.searchListResult.getValue().push(ICD);
              this.searchListResult.getValue().push(Laboratorios);
            }
          })
          .catch(ex => {
            console.log('AutocompleteService', ex);
          });
      }
    }
  }

  private async getSearchListRequest(finalUrl: string) {

    let jsonResult = null;
    if (this.plt.is('cordova')) {
      this.ngxHttp.setDataSerializer('urlencoded');
      await this.ngxHttp.get(finalUrl, {}, {})
        .then((result: any) => {
          if (result.status >= 200 && result.status < 300) {
            const resultStringToJson = this.stringArrayToJsonParse(result.data);
            jsonResult = resultStringToJson;
          }
        })
        .catch(ex => {
          console.warn('AutocompleteService ex1', ex);
        });
      return jsonResult;
    } else {
      await this.httpClient.get<any>('/assets/data/predictive.json')
        .toPromise()
        .then(info => {
          jsonResult = info;
        })
        .catch(ex => {
          console.warn('AutocompleteService ex2', ex);
        });
      return jsonResult;
    }
  }

  showAutoComplete(pubMed: boolean, searchText?: string) {
    console.warn('AutocompleteService', '***   showAutoComplete   ****');
    this.productsFiltered = [];
    this.icdFiltered = [];
    this.substancesFiltered = [];
    this.labsFiltered = [];
    this.pubMedFiltered = [];
    if (pubMed) {
      //searchText = this.metadataEngineService.searchText;
      console.warn('AutocompleteService', '***   LoadPubMedList()...');
      this.LoadPubMedList((searchText ? searchText : ''));
    } else {
      console.warn('AutocompleteService', '***   loadList()...');
      this.loadList((searchText ? searchText : ''));
    }
  }

  closeAutocomplete() {
    this.showList.next(false);
  }

  searchEngine(ev: any) {
    console.warn('AutocompleteService', '***   searchEngine   ****');
    const category: string = ev.category;
    const key: string = ev.key;
    if (category === 'Medicamentos') {
      let newstr: string = key;
      let splits: any = [];
      newstr = newstr.replace(/[\/]/g, ' ');
      splits = newstr.split(' ');
      this.router.navigate(['ippa', splits[1], splits[0], splits[3], splits[2]]);
    } else if (category === 'ICD') {
      this.getDrugsByICD(+key);
    } else if (category === 'Sustancias') {
      this.getDrugsBySubstance(+key);
    } else if (category === 'Laboratorios') {
      this.getDrugsByLab(+key);
    }
  }

  private getDrugsBySubstance(activeSubstanceId: number) {
    this.controllersIonicService.showLoader().finally(() => {
      this.pharmaSearchEngine.getDrugsBySubstance(activeSubstanceId, environment.applicationInfo.editionId).subscribe({
        next: (data: any) => {
          if (data.getDrugsBySubstanceResult.length > 0) {
            this.pharmaSearchEngine.getResultsv2Result.next(null);
            this.pharmaSearchEngine.getDrugsResult.next(data.getDrugsBySubstanceResult);
            this.controllersIonicService.hideLoader();
            this.router.navigateByUrl('/lista-productos');
          } else {
            this.controllersIonicService.hideLoader().finally(() => {
              this.controllersIonicService.presentToast('La sustancia no tiene productos asociados.');
            });
          }
        },
        error: ex => {
          console.log('AutocompleteService', ex);
          this.controllersIonicService.hideLoader().finally(() => {
            this.controllersIonicService.presentAlert('Sustancias', 'Error al recuperar Sustancias');
          });
        },
        complete: () => console.log('AutocompleteService', 'successful getDrugsBySubstance')
      });
    });
  }

  private getDrugsByLab(labId: number) {
    this.controllersIonicService.showLoader()
      .finally(() => {
        this.pharmaSearchEngine.getDrugsByLab(labId, environment.applicationInfo.editionId).subscribe({
          next: (data: any) => {
            if (data.getDrugsByLabResult.length > 0) {
              this.pharmaSearchEngine.getResultsv2Result.next(null);
              this.pharmaSearchEngine.getDrugsResult.next(data.getDrugsByLabResult);
              this.controllersIonicService.hideLoader();
              this.router.navigateByUrl('/lista-productos');
            } else {
              this.controllersIonicService.hideLoader().finally(() => {
                this.controllersIonicService.presentToast('El laboratorios no tiene productos asociados.');
              });
            }
          },
          error: ex => {
            console.log('AutocompleteService', ex);
            this.controllersIonicService.hideLoader();
          },
          complete: () => console.log('AutocompleteService', 'Successful getDrugsByLab')
        });
      });
  }

  private getDrugsByICD(icdId: number) {
    this.controllersIonicService.showLoader()
      .finally(() => {
        this.pharmaSearchEngine.getDrugsByICD(icdId, environment.applicationInfo.editionId).subscribe({
          next: (data: any) => {
            if (data.getDrugsByICDResult.length > 0) {
              this.pharmaSearchEngine.getResultsv2Result.next(null);
              this.pharmaSearchEngine.getDrugsResult.next(data.getDrugsByICDResult);
              this.controllersIonicService.hideLoader();
              this.router.navigateByUrl('/lista-productos');
            } else {
              this.controllersIonicService.hideLoader().finally(() => {
                this.controllersIonicService.presentToast('El CIE-10 no tiene productos asociados.');
              });
            }
          },
          error: ex => {
            this.controllersIonicService.hideLoader().finally(() => {
              this.controllersIonicService.presentAlert('CIE-10', 'Error al recuperar los productos asociados al CIE-10');
            });
          },
          complete: () => console.log('AutocompleteService', 'successful getDrugsByICD')
        });
      });
  }

  private getFinalUrl(pubMed: boolean) {
    let finalUrl: string;
    if (pubMed) {
      if (this.plt.is('ios')) {
        finalUrl = this.searchEnginePubMedSuggestion.baseUrl + this.searchEnginePubMedSuggestion.jsonFile + this.time;
      } else {
        finalUrl = this.searchEnginePubMedSuggestion.baseUrl + this.searchEnginePubMedSuggestion.jsonFile;
      }
    } else {
      if (this.plt.is('ios')) {
        finalUrl = this.searchEngineSuggestion.baseUrl + this.searchEngineSuggestion.jsonFile + this.time;
      } else {
        finalUrl = this.searchEngineSuggestion.baseUrl + this.searchEngineSuggestion.jsonFile;
      }
    }
    console.warn('AutocompleteService getFinalUrl() ' + finalUrl);
    return finalUrl;
  }

  private loadList(searchText: string) {
    console.warn('AutocompleteService', '*** searchText: ' + searchText);
    const serchList = this.searchListResult.getValue();
    if (searchText && serchList) {
      console.warn('AutocompleteService', '*** serchList-length: ' + serchList.length);
      if (searchText.length >= 3 && serchList !== null) {
        //const serchList = this.searchListResult.getValue();
        const product: Array<any> = serchList[0];
        const Sustancias: Array<any> = serchList[1];
        const ICD: Array<any> = serchList[2];
        const Laboratorios: Array<any> = serchList[3];
        searchText = this.removesDiacritics(searchText.toLowerCase());
        this.productsFiltered =
          product.filter(item => {
            const wordNormalized = this.removesDiacritics(item.label.toLowerCase());
            return (wordNormalized.indexOf(searchText) > - 1);
          });
        this.substancesFiltered =
          Sustancias.filter(item => {
            const wordNormalized = this.removesDiacritics(item.label.toLowerCase());
            return (wordNormalized.indexOf(searchText) > - 1);
          });
        this.icdFiltered =
          ICD.filter(item => {
            const wordNormalized = this.removesDiacritics(item.label.toLowerCase());
            return (wordNormalized.indexOf(searchText) > - 1);
          });
        this.labsFiltered =
          Laboratorios.filter(item => {
            const wordNormalized = this.removesDiacritics(item.label.toLowerCase());
            return (wordNormalized.indexOf(searchText) > - 1);
          });
        console.warn('AutocompleteService', '*** showList: ' + this.showList);
        if (this.productsFiltered.length > 0 || this.icdFiltered.length > 0
          || this.substancesFiltered.length > 0 || this.labsFiltered.length > 0) {
          this.showList.next(true);
        } else {
          this.showList.next(false);
        }
        console.warn('AutocompleteService', '*** showList-next: ' + this.showList);
      }
    }
  }

  private LoadPubMedList(searchText: string) {
    if (searchText && this.substancesListResult.getValue()) {
      console.warn('AutocompleteService', '*** searchText: ' + searchText);
      if (searchText.length >= 3 && this.substancesListResult.getValue() !== null) {
        const serchList = this.substancesListResult.getValue();
        searchText = this.removesDiacritics(searchText.toLowerCase());
        this.pubMedFiltered =
          serchList.filter((item: any) => {
            const wordNormalized = this.removesDiacritics(item.SubstanceName.toLowerCase());
            return (wordNormalized.indexOf(searchText) > - 1);
          });
        console.warn('AutocompleteService', '*** showList: ' + this.showList);
        if (this.pubMedFiltered.length > 0) {
          this.showList.next(true);
        } else {
          this.showList.next(false);
        }
        console.warn('AutocompleteService', '*** showList-next: ' + this.showList);
      }
    }
  }

  private removesDiacritics(word: string) {
    word = word.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    return word;
  }

  private stringArrayToJsonParse(input: any) {
    console.log('stringArrayToJsonParse input', input);
    const result: Array<any> = [];

    // Verificar si input es una cadena antes de usar trim()
    if (typeof input === 'string') {
      input = input.trim();
      input = input.replace(/^\[/, '');
      input = input.trim();
      input = input.replace(/^\[/, '');
      input = input.replace(/\]$/, '');
      input = input.replace(/},{/g, '};;;{');
      input = input.replace(/\\n/g, '\\n');
      input = input.replace(/\\'/g, '\\\'');
      input = input.replace(/\\"/g, '\\"');
      input = input.replace(/\\&/g, '\\&');
      input = input.replace(/\\r/g, '\\r');
      input = input.replace(/\\t/g, '\\t');
      input = input.replace(/\\b/g, '\\b');
      input = input.replace(/\\f/g, '\\f');
      input = input.replace(/[\u0000-\u0019]+/g, '');
      input = input.replace(/},{/g, '};;;{');
      input = input.split(';;;');
      input.forEach((element: string) => {
        try {
          result.push(JSON.parse(element));
        } catch (ex) {
          console.warn('AutocompleteService', element);
        }
      });
     
    } else if (Array.isArray(input)) {
      console.warn('input es array');
      // Si ya es un array, simplemente devuélvelo
      return input;
    } else if (typeof input === 'object' && input !== null) {
       console.warn('input  es un objeto. ¡Convertirlo a array!');
      // Si ya es un objeto, ¡convertirlo a array!
      return [input];
    }

    return result;
  }

}
