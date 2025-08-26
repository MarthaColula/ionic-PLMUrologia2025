import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
export interface ISearchEngine {
  SearchEngine: SearchEngine,
  event?: any;
}

export enum SearchEngine {
  Autocomplete = 1,
  Searchbar = 2
}

@Injectable({
  providedIn: 'root'
})
export class InteractionSearchEngineService {

  interactionsSearchText: string = '';
  private _interactionType: string = '';
  private _interactionSearchEngineTitle: string = '';

  private _searchEngineOptionsBehaviorSubject = new BehaviorSubject<ISearchEngine | null>(null);
  searchEngineOptions$ = this._searchEngineOptionsBehaviorSubject.asObservable();

  private _getResultsBehaviorSubject = new BehaviorSubject<any>(null);
  getResults$ = this._getResultsBehaviorSubject.asObservable();

  private _mealInteractionsResultBehaviorSubject = new BehaviorSubject<any>(null);
  mealInteractionsResult$ = this._mealInteractionsResultBehaviorSubject.asObservable();

  private _getDrugsResultBehaviorSubject = new BehaviorSubject<any>(null);
  private _getSustancesBytexResultBehaviorSubject = new BehaviorSubject<any[]>(null);
  private _getICDSBytextResultBehaviorSubject = new BehaviorSubject<any[]>(null);
  private _getLabsByTextResultBehaviorSubject = new BehaviorSubject<any[]>(null);

  constructor() { }

  setInteractionsPagesTitle(title: string) {
    this._interactionSearchEngineTitle = title;
  }

  getInteractionsPagesTitle() {
    return this._interactionSearchEngineTitle;
  }

  setMealInteractionsResult(data: any) {
    this._mealInteractionsResultBehaviorSubject.next(data);
  }

  getMealInteractionsResult() {
    return this._mealInteractionsResultBehaviorSubject.getValue();
  }

  setInteractionType(type: 'DRUG_INTERACTIONS' | 'FOOD_INTERACTIONS') {
    this._interactionType = type;
  }

  getInteractionType() {
    return this._interactionType;
  }

  saveResult(data: any) {
    this._getResultsBehaviorSubject.next(data);
  }

  getDrugsByTextResult() {
    return this._getDrugsResultBehaviorSubject.getValue();
  }

  saveDrugsByTexResult(drugs: any) {
    this._getDrugsResultBehaviorSubject.next(drugs)
  }

  setSearchEngineOptions(options: ISearchEngine | null) {
    this._searchEngineOptionsBehaviorSubject.next(options);
  }

  saveSustancesBytexResult(substances: any) {
    this._getSustancesBytexResultBehaviorSubject.next(substances);
  }

  getSustancesBytexResult() {
    return this._getSustancesBytexResultBehaviorSubject.getValue();
  }

  getIcdsBytextResult() {
    return this._getICDSBytextResultBehaviorSubject.getValue();
  }

  saveIcdsBytextResult(icds: any) {
    this._getICDSBytextResultBehaviorSubject.next(icds);
  }

  getLabsByTextResult() {
    this._getLabsByTextResultBehaviorSubject.getValue();
  }

  saveLabsBytexResult(labs: any) {
    this._getLabsByTextResultBehaviorSubject.next(labs);
  }

  deleteCache() {
    this.saveResult(null);
    this.saveDrugsByTexResult(null);
    this.saveSustancesBytexResult(null);
    this.saveLabsBytexResult(null);
    this.saveIcdsBytextResult(null);
    this.setMealInteractionsResult(null);
  }
}
