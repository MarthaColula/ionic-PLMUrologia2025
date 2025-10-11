import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-collapse-element-list',
  templateUrl: './collapse-element-list.component.html',
  styleUrls: ['./collapse-element-list.component.scss'],
   standalone: false,
})
export class CollapseElementListComponent implements OnInit {

  @Input()
  title: string;
  
  @Input()
  icon: any;

  @Input()
  elementList: any[];

  @Input()
  section: string;
  
  @Input()
  img: '';

  @Output()
  selected: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  toggle: EventEmitter<void> = new EventEmitter<void>();

  public isMenuOpen = false;

  constructor() { }

  ngOnInit() {
    //console.warn('*** elementList.length: ' + this.elementList.length);
     console.warn('*** elementList: ' + this.elementList);
    console.warn(' section: ' + this.section);
    console.warn(' icon: ' + this.icon);
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
