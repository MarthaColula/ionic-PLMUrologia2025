import { Component, EventEmitter, Input, OnInit, Output, AfterViewInit, HostListener } from '@angular/core';

@Component({
  selector: 'app-easy-accordion',
  templateUrl: './easy-accordion.component.html',
  styleUrls: ['./easy-accordion.component.scss'],
  standalone: false,
})
export class EasyAccordionComponent implements OnInit, AfterViewInit {

  @Input() title: string;

  @Input() content: string;

  @Input() objeto: any;

  @Output() change: EventEmitter<string> = new EventEmitter<string>();
  @Output() encyclopediaDetail: EventEmitter<number> = new EventEmitter<number>();
  
  protected isMenuOpen = false;

  target: HTMLElement;

  @HostListener('click', ['$event', '$event.target']) onClick(event: any, target: any) {
    this.target = target;
    const attributes: NamedNodeMap = this.target.attributes;
    if (attributes.length > 0) {
      let longitud = attributes.length;
      if (longitud >= 1) {
        longitud += -1;
      }
      let eventName: string = this.target.attributes[longitud].value + '';
      if (eventName !== '') {
        eventName = eventName.split('(')[0];
        let splits: any = [];
        if (eventName !== 'nextStep') {
          let newstr: string = this.target.attributes[longitud].value + '';
          newstr = newstr.replace('(', ' ');
          newstr = newstr.replace(')', ' ');
          splits = newstr.split(' ');
          splits.pop();
        }
        switch (eventName) {
          case 'getEncyclopediaDetail':
            this.encyclopediaDetail.emit(splits[1]);
            break;
        }
      }
    }
  }

  constructor() { }

  ngOnInit() { }

  ngAfterViewInit() { }

  public toggleAccordion(objeto: any): void {
    if (!this.isMenuOpen) {
      this.change.emit(objeto);
    }
    this.isMenuOpen = !this.isMenuOpen;
  }
  
}
