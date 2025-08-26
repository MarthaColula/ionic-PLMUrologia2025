import { Component, ElementRef, EventEmitter, Input, AfterViewInit, OnInit, Output, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { UtilitiesCalculator } from '../../../interfaces/utilities-calculator';

@Component({
  selector: 'app-pop-element-date',
  templateUrl: './pop-element-date.component.html',
  styleUrls: ['./pop-element-date.component.scss'],
  standalone: false,
})
export class PopElementDateComponent implements OnInit, AfterViewInit {

  @ViewChild('PopDatetime', {read: ElementRef, static: false}) popDatetime: ElementRef;

  @Input()
  utilities: UtilitiesCalculator;

  @Input()
  triggerID: any;

  @Input()
  labelDate: any;
  
  @Output() changeDate: EventEmitter<any> = new EventEmitter<any>();
  
  public labelDateHTML: any;
  public dateValue: any = '';
  public doneText: any = 'Aceptar';
  public cancelText: any = 'Cancelar';
  protected strDateValue: string = '';

  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit() {
    console.log('***  ngOnInit-ElementDate  ***');
    console.warn('***  labelDate: ' + this.labelDate);
    if (this.validateContentHTMLinDate()) {
      this.labelDateHTML = this.getContentHTMLinDate();
      console.warn('***  labelDateHTML: ' + this.labelDateHTML);
    }
  }

  ngAfterViewInit(): void {
    console.warn('***  triggerID: ' + this.triggerID);
  }
  
  validateContentHTMLinDate() {
    return (this.labelDate && this.utilities.validateStringIncludes(this.labelDate,this.utilities.getArrayElementsHTML()));
  }

  getContentHTMLinDate() {
    return this.sanitizer.bypassSecurityTrustHtml(this.labelDate);
  }
  
  setDateTimeValue(dateVal: any) {
    console.log('***  dateVal: ' + dateVal);
    this.changeDateValue(dateVal);
  }

  changeDateValue(value: any) {
    this.dateValue = value;
    console.log('***  dateValue: ' + this.dateValue);
    if (this.dateValue) {
      const crrntDate = new Date();
      console.log('***  crrntDate: ' + crrntDate.toUTCString());
      const newDate = new Date(this.dateValue);
      //newDate.setMonth(newDate.getMonth() + 1);
      let strMonth = newDate.getMonth() + 1;
      let mDate = newDate.getDate() +'/'+ strMonth +'/'+ newDate.getFullYear();
      console.log('***  mDate: ' + mDate);
      if (!mDate.includes('/0/')) {
        this.strDateValue = mDate;
        this.emitChangeDate();
      }
    }
  }

  emitChangeDate() {
    if (this.strDateValue) {
      this.changeDate.emit({date: this.strDateValue});
    }
  }

}
