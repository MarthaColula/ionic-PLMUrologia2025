import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-collapse-element',
  templateUrl: './collapse-element.component.html',
  styleUrls: ['./collapse-element.component.scss'],
  standalone: false,
})
export class CollapseElementComponent implements OnInit {


  @Input()
  elementList: any[];

  @Output()
  selected: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  toggle: EventEmitter<void> = new EventEmitter<void>();

  public isMenuOpen = false;

  constructor() { }

  ngOnInit() {
    console.warn('*** elementList.length: ' + this.elementList.length);
    console.warn('this.elementList: ' + JSON.stringify( this.elementList));
  }

  public toggleAccordion(): void {
    if (!this.isMenuOpen) {
      this.toggle.emit();
    }
    this.isMenuOpen = !this.isMenuOpen;
  }

  selectedItem(data: any) {
    console.warn('*** data: ' + JSON.stringify(data));
    this.selected.emit(data);
  }

}
