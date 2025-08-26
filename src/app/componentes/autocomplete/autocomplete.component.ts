import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss'],
  standalone: false,
})
export class AutocompleteComponent implements OnInit {

  @Input() products: Array<any> = [];
  @Input() substances: Array<any> = [];
  @Input() icds: Array<any> = [];
  @Input() labs: Array<any> = [];
  @Input() pubMed: Array<any> = [];

  @Output() searchEngine: EventEmitter<any> = new EventEmitter<any>();
  @Output() searchEnginePubMed: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnInit() { 
    console.log('inputs AutocompComponent', this.products.length + ' - '+ this.substances.length + ' - ' + this.icds + ' - '+ this.labs + ' - '+ this.pubMed);
    console.log('inputs AutocompComponent', this.products + ' - '+ this.substances + ' - ' + this.icds + ' - '+ this.labs + ' - '+ this.pubMed);
  }

  searchEngineEmiter(item: any) {
    this.searchEngine.emit(item);
  }

  searchEnginePubMedEmiter(item: any) {
    this.searchEnginePubMed.emit(item);
  }
  
}
