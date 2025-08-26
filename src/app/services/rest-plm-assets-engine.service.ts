import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GlobalvarsService } from './globalvars.service';
import { environment } from '../../environments/environment';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RestPlmAssetsEngineService {

  private apiUrl = '';

  private calculatorsResult: Array<any> = [];
  private algorithmsResult: Array<any> = [];
  
  private calculatorsByTherapeuticLineByTypeResult = new BehaviorSubject<any>(null);
  private algorithmsByTherapeuticLineByTypeResult = new BehaviorSubject<any>(null);

  private httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

  constructor(
    private http: HttpClient,
    private globalVars: GlobalvarsService
  ) {
    const { protocol, server, port, path, endPointName } = environment.restRestPLMAssetsEngine;
    this.apiUrl = `${protocol}://${server}:${port}/${path}/${endPointName}/${endPointName}.svc/`;
  }

  getCalculatorsByTherapeuticLineByTypeResult(countryKey?: any) {
    if (countryKey) {
      const calculator = this.calculatorsResult.find(data => countryKey === data.key);
      if (calculator) {
        return calculator.value;
      } else {
        return [];
      }
    } else {
      return this.calculatorsByTherapeuticLineByTypeResult.getValue();
    }
  }

  getAlgorithmsByTherapeuticLineByTypeResult(countryKey?: any) {
    if (countryKey) {
      const algorithm = this.algorithmsResult.find(data => countryKey === data.key);
      if (algorithm) {
        return algorithm.value;
      } else {
        return [];
      }
    } else {
      return this.algorithmsByTherapeuticLineByTypeResult.getValue();
    }
  }

  getCalculatorsByTherapeuticLineByTypeRequest(code: string, prefix: string, targetId: any, informationTypeId: any, country: string) {
    console.warn('***  country: ' + country);
    const webMethod = this.apiUrl + `getContentsByTherapeuticLineByType?code=${code}&prefix=${prefix}&targetId=${targetId}&informationTypeId=${informationTypeId}&country=${country}`;
    console.warn('webMethod', webMethod);
    return this.http.get<any>(webMethod)
      .pipe(map((response) => {
        if (response.getContentsByTherapeuticLineByTypeResult) {
          this.calculatorsByTherapeuticLineByTypeResult.next(response.getContentsByTherapeuticLineByTypeResult);
        } else {
          this.calculatorsByTherapeuticLineByTypeResult.next(response);
        }
        this.updateCalculatorsResult(this.calculatorsByTherapeuticLineByTypeResult.getValue(),country);
        return this.calculatorsByTherapeuticLineByTypeResult.getValue();
      }));
  }

  getAlgorithmsByTherapeuticLineByTypeRequest(code: string, prefix: string, targetId: any, informationTypeId: any, country: string) {
    console.warn('***  country: ' + country);
    const webMethod = this.apiUrl + `getContentsByTherapeuticLineByType?code=${code}&prefix=${prefix}&targetId=${targetId}&informationTypeId=${informationTypeId}&country=${country}`;
    console.warn('webMethod', webMethod);
    return this.http.get<any>(webMethod)
      .pipe(map((response) => {
        if (response.getContentsByTherapeuticLineByTypeResult) {
          this.algorithmsByTherapeuticLineByTypeResult.next(response.getContentsByTherapeuticLineByTypeResult);
        } else {
          this.algorithmsByTherapeuticLineByTypeResult.next(response);
        }
        this.updateAlgorithmsResult(this.algorithmsByTherapeuticLineByTypeResult.getValue(),country);
        return this.algorithmsByTherapeuticLineByTypeResult.getValue();
      }));
  }

  private updateCalculatorsResult(resultValue: any, countryKey: any) {
    const calculator = this.calculatorsResult.find(data => countryKey === data.key);
    if (!calculator) {
      this.calculatorsResult.push({key: countryKey, value: resultValue});
    }
  }

  private updateAlgorithmsResult(resultValue: any, countryKey: any) {
    const algorithm = this.algorithmsResult.find(data => countryKey === data.key);
    if (!algorithm) {
      this.algorithmsResult.push({key: countryKey, value: resultValue});
    }
  }
  
}
