import { BehaviorSubject, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private validationMessagesResult = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient) { }

  getValidationMessageRequest() {
    console.log('DataService - getValidationMessageRequest');
    return this.http.get<any>('assets/data/errorMessages.json')
      .pipe(
        map(response => {
          console.log('DataService - response', response);
          this.validationMessagesResult.next(response.validationMessages);
          return this.validationMessagesResult.getValue();
        }),
        catchError(error => {
          console.error('Error al cargar el JSON:', error);
          return of(null);  // Retorna un valor predeterminado en caso de error
        })
      );
  }

  getValidationMessage() {
    console.log('DataService - getValidationMessage')
    return this.validationMessagesResult;
  }

}
