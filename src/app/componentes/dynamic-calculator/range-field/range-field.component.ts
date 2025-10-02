import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { RangeCustomEvent } from '@ionic/angular';
import { UtilitiesCalculator } from 'src/app/interfaces/utilities-calculator';
//import { ScrollingModule } from '@angular/cdk/scrolling';
//import { SwiperComponent } from 'swiper/angular';

import { register, SwiperContainer } from 'swiper/element/bundle';
import { Swiper } from 'swiper/types';

register();


@Component({
  selector: 'app-range-field',
  templateUrl: './range-field.component.html',
  styleUrls: ['./range-field.component.scss'],
   standalone: false,
})
export class RangeFieldComponent implements OnInit {
  @ViewChild('swiper') swiper!: ElementRef<SwiperContainer>;

  @Input()
  flgForm: any;
  
  @Input()
  indxRgnt: number;

  @Input()
  reagent: any;

  @Input()
  utilities: UtilitiesCalculator;
  
  //@ViewChild('swiper') swiper: SwiperComponent;

  @Output() nextFocus: EventEmitter<any> = new EventEmitter<any>();
  @Output() changeValue: EventEmitter<any> = new EventEmitter<any>();
  

  selectedSlide: number | null = null;

  pinFormatter(value: number) {
    return `${value}`;
  }

  protected rangeValue: any;
  protected rangeMarks: Array<any> = [];
  protected rangeDivisor = 1;
  protected rangeMin: any;
  protected rangeMax: any;
  protected rangeStyles: Array<any> = [];
  protected rngStyle = '{}';
  protected rangeColors: Array<any> = [];
  protected rngColor = '';
  protected iconsRange: Array<any> = [];
  protected labelsRange: Array<any> = [];
  //protected objMrkStyle: any = {};
  protected width: any = 100;
  protected colSize: any = 12;
  protected typeMarks: string = '';
  protected strMsjError: any = '';
  protected dualknobs = false;
  protected snaps = false;
  protected ticks = false;
  protected selectMrk = false;
  protected scrollMarks = false;
  protected flgRqdFields = false;
  protected flgPinFormatter = false;
  protected flgShowReagent = true;
  protected flgFinalOption = false;
  protected flgFocusResult = true;

  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit() {
    console.warn('RangeField', '***  : ngOnInit  ***');
    console.warn('RangeField', 'indxRgnt: ' + this.indxRgnt);
    console.warn('RangeField', JSON.stringify(this.reagent));
    this.initVariables();
  }

  initVariables() {
    let strRange = this.reagent.Range;
    let arrayRange = strRange.split(',');
    //console.warn('RangeField', {range: arrayRange});
    if (arrayRange && arrayRange.length > 0) {
      const strMin = arrayRange[0].replace('[','');
      console.log('RangeField', '**  strMin: ' + strMin);
      this.rangeMin = parseInt(strMin);
      if (strMin.includes('.')) {
        this.rangeMin = parseFloat(strMin);
        let arryMin = strMin.split('.');
        let str = arryMin[1]+'';
        let divCase = str.length;
        console.log('RangeField', '**  divCase: ' + divCase);
        switch (divCase) {
          case 1:
            this.rangeDivisor = 10;
            break;
          case 2:
            this.rangeDivisor = 100;
            break;
          case 3:
            this.rangeDivisor = 1000;
              break;
          default:
            break;
        }
      }
      console.warn('RangeField', '**  rangeMin: ' + this.rangeMin);
      console.warn('RangeField', '**  rangeDivisor: ' + this.rangeDivisor);
      const strMax = arrayRange[1].replace(']','');
      console.log('RangeField', '**  strMax: ' + strMax);
      this.rangeMax = (parseInt(strMax) * this.rangeDivisor);
      console.warn('RangeField', '**  rangeMax: ' + this.rangeMax);
    }
    if (this.utilities.existInJSON(this.reagent,'"SelectMark"')) {
      this.selectMrk = this.reagent.SelectMark;
    }
    if (this.utilities.existInJSON(this.reagent,'"ScrollMarks"')) {
      this.scrollMarks = this.reagent.ScrollMarks;
    }
    this.rangeMarks = [];
    if (this.utilities.existInJSON(this.reagent,'"Marks"')) {
      this.rangeMarks = this.reagent.Marks;
      console.warn('RangeField', {rngMarks: this.rangeMarks});
    }
    console.warn('RangeField', '**  rangeMarks-length: ' + this.rangeMarks.length);
    if (this.utilities.existInJSON(this.reagent,'"TypeMarks"')) {
      this.typeMarks = this.reagent.TypeMarks.toUpperCase();
    } else if (this.rangeMarks.length > 0) {
      const initMark = this.rangeMarks[0];
      if (this.utilities.existInJSON(initMark,'"Type"')) {
        this.typeMarks = initMark.Type.toUpperCase();
      }
    }
    console.warn('RangeField', '**  typeMarks: ' + this.typeMarks);
    this.rangeColors = [];
    if (this.utilities.existInJSON(this.reagent,'"RangeColors"')) {
      const strRngColors = this.reagent.RangeColors;
      const arryRngColors = strRngColors.split('|');
      if (arryRngColors.length > 0) {
        this.rangeColors = arryRngColors;
        this.rngColor = this.rangeColors[0];
      }
    }
    console.warn('RangeField', '**  rangeColors-length: ' + this.rangeColors.length);
    this.rangeStyles = [];
    if (this.utilities.existInJSON(this.reagent,'"RangeStyles"')) {
      const strRngStyles = this.reagent.RangeStyles;
      const arryRngStyles = strRngStyles.split('|');
      if (arryRngStyles.length > 0) {
        this.rangeStyles = arryRngStyles;
        this.rngStyle = this.rangeStyles[0];
        console.warn('RangeField', '**  rngStyle: ' + JSON.stringify(this.rngStyle));
      }
    }
    console.warn('RangeField', '**  rangeStyles-length: ' + this.rangeStyles.length);
    this.iconsRange = [];
    if (this.utilities.existInJSON(this.reagent,'"IconsRange"')) {
      const strIcnsRange = this.reagent.IconsRange;
      if (strIcnsRange.includes('|')) {
        this.iconsRange = strIcnsRange.split('|');
      }
    }
    console.warn('RangeField', '**  iconsRange-length: ' + this.iconsRange.length);
    this.labelsRange = [];
    if (this.utilities.existInJSON(this.reagent,'"LabelsRange"')) {
      const strLblsRange = this.reagent.LabelsRange;
      if (strLblsRange.includes('|')) {
        const arryLblsRange = strLblsRange.split('|');
        if (this.validateContentHTML(arryLblsRange[0])) {
          this.labelsRange = arryLblsRange;
        } else {
          arryLblsRange.forEach((str: string) => {
            this.labelsRange.push('<p>'+ str +'</p>');
          });
        }
        console.warn('RangeField', '**  labelsRange: ' + JSON.stringify(this.labelsRange));
      }
    }
    console.warn('RangeField', '**  labelsRange-length: ' + this.labelsRange.length);
    const length = (this.iconsRange.length > 0 || this.labelsRange.length > 0 ? this.rangeMarks.length+1 : this.rangeMarks.length);
    this.width = parseFloat((''+Math.fround(100/length)).substring(0,4));
    console.warn('RangeField', '**  width: ' + this.width);
    const strLength = '' + (this.iconsRange.length > 0 || this.labelsRange.length > 0 ? (10/this.rangeMarks.length) : (12/this.rangeMarks.length));
    this.colSize = (strLength.includes('.') ? parseFloat(strLength.substring(0,3)) : parseInt(strLength)); 
    console.warn('RangeField', '**  colSize: ' + this.colSize);
    if (this.utilities.existInJSON(this.reagent,'"Attributes"')) {
      let strAttributes = this.reagent.Attributes;
      console.warn('RangeField', '**  strAttributes: ' + strAttributes);
      if (strAttributes.includes('|')) {
        this.dualknobs = strAttributes.includes('dualknobs');
        this.snaps = strAttributes.includes('snaps');
        this.ticks = strAttributes.includes('ticks');
        this.flgPinFormatter = strAttributes.includes('pin');
      } else {
        switch(strAttributes) {
          case 'dualknobs':
            this.dualknobs = true;
            this.snaps = false;
            this.ticks = false;
            this.flgPinFormatter = false;
            break;
          case 'snaps':
            this.snaps = true;
            this.dualknobs = false;
            this.ticks = false;
            this.flgPinFormatter = false;
            break;
          case 'ticks':
            this.ticks = true;
            this.snaps = false;
            this.dualknobs = false;
            this.flgPinFormatter = false;
            break;
          case 'pin':
            this.flgPinFormatter = true;
            this.dualknobs = false;
            this.snaps = false;
            this.ticks = false;
            break;
        }
      }
    }
  }
  
  validateContentHTML(srtContent: string) {
    return (srtContent && this.utilities.validateStringIncludes(srtContent,this.utilities.getArrayElementsHTML()));
  }

  getContentHTML(srtContent: string) {
    return this.sanitizer.bypassSecurityTrustHtml(srtContent);
  }

  getObjStyle(srtContent: string) {
    return (srtContent ? JSON.parse(srtContent) : {});
  }
  
  getMarckStyle(indx: number, flgSlide: boolean) {
    let srtStyle = "{}";
    if (indx === 0) {
      srtStyle = (flgSlide ? "{\"justify-content\":\"right\"}" : "{\"justify-content\":\"left\"}");
    } if ((indx+1) < this.rangeMarks.length) {
      srtStyle = "{\"justify-content\":\"center\"}";
    } else {
      srtStyle = (flgSlide ? "{\"justify-content\":\"left\"}" : "{\"justify-content\":\"right\"}");
    }
    const objStyle = this.getObjStyle(srtStyle);
    //console.warn('RangeF ield', '**  indx: '+ indx +', objStyle: '+ JSON.stringify(objStyle));
    return objStyle;
  }

  selectMark(index: number, mark: any, event: MouseEvent ) {
 
    this.selectedSlide = index;
    const target = event.target as HTMLElement;
    const slide = target.closest('swiper-slide') as HTMLElement;
 
    if (slide) {
      const index = slide.getAttribute('data-index');
      this.selectedSlide = index ? parseInt(index, 10) : null;
      // Removemos la clase 'selected' de todos los slides
      const allSlides = this.swiper.nativeElement.querySelectorAll('swiper-slide');
      allSlides.forEach((s: HTMLElement) => s.classList.remove('selected'));
      // Agregamos la clase 'selected' al slide clickeado
      slide.classList.add('selected');
    }

    if (mark && this.utilities.existInJSON(mark,'"Value"')) {
      this.rangeValue = mark.Value;
    } else {
      console.warn('RangeField', '**  index: ' + index);
      if (this.rangeStyles.length > 0 || this.rangeColors.length > 0) {
        let arryRngSC: Array<any> = [];
        console.warn('RangeField', '**  rngStyles-Lgth: '+ this.rangeStyles.length +', rngColors-Lgth: '+ this.rangeColors.length);
        if (this.rangeStyles.length > 0) {
          arryRngSC = this.rangeStyles;
        } else if (this.rangeColors.length > 0) {
          arryRngSC = this.rangeColors;
        }
        const aryRngLng = arryRngSC.length;
        const rngMrksLng = this.rangeMarks.length;
        console.warn('RangeField', '**  aryRngLng: '+ aryRngLng +', rngMrksLng: '+ rngMrksLng);
        //const mult = Math.trunc(arryRngSC.length/(this.rangeMarks.length-1));
        const mult = (rngMrksLng === aryRngLng ? 1 : (rngMrksLng > aryRngLng ? Math.trunc(rngMrksLng/(aryRngLng-1)) : Math.trunc(aryRngLng/(rngMrksLng-1))));
        const value = mult * index;
        console.warn('RangeField', '**  mult: '+ mult +', value: '+ value);
        console.warn('RangeField', '**  rangeDivisor: ' + this.rangeDivisor);
        const difOne = Math.trunc(this.rangeMax - this.rangeMin);
        if (this.rangeDivisor === 1) {
          const multAOne = (difOne/aryRngLng);
          console.warn('RangeField', '**  difOne: '+ difOne +', multAOne: '+ multAOne);
          this.rangeValue = Math.trunc(value*multAOne);
        } else {
          //TODO: Validar!!!
          const multBOne = (difOne > rngMrksLng ? difOne/(rngMrksLng+1) : (rngMrksLng+1)/difOne);
          console.warn('RangeField', '**  difOne: '+ difOne +', multBOne: '+ multBOne);
          this.rangeValue = Math.trunc((index === 0 ? 0 : (index === (rngMrksLng-1) ? (rngMrksLng+1)*multBOne : (index+1)*multBOne)));
        }
      } else if (this.selectMrk) {
        const rngMrksLng = this.rangeMarks.length;
        console.warn('RangeField', '**  rngMrksLng: '+ rngMrksLng +', rangeDivisor: '+ this.rangeDivisor);
        const difTwo = Math.trunc(this.rangeMax - this.rangeMin);
        const multTwo = (difTwo > rngMrksLng ? difTwo/(rngMrksLng+1) : (rngMrksLng+1)/difTwo);
        console.warn('RangeField', '**  difTwo: '+ difTwo +', multTwo: '+ multTwo);
        this.rangeValue = Math.trunc((index === 0 ? 0 : (index === (rngMrksLng-1) ? (rngMrksLng+1)*multTwo : (index+1)*multTwo)));
      }
    }
    if (this.rangeValue != undefined) {
      console.warn('RangeField', '**  rangeValue: '+ this.rangeValue +', rangeDivisor: ' + this.rangeDivisor);
      this.changeValue.emit({value: (this.rangeValue/this.rangeDivisor)});
    }
  }

  onKnobMoveStart(eventRange: Event) {
    console.warn('RangeField', '***  onKnobMoveStart  ***');
    console.log('RangeField', {event: eventRange});
  }
  
  onKnobMoveEnd(eventRange: Event) {
    console.warn('RangeField', '***  onKnobMoveEnd  ***');
    console.log('RangeField', {event: eventRange});
    this.rangeValue = (eventRange as RangeCustomEvent).detail.value;
    console.warn('RangeField', '**  rangeValue: '+ this.rangeValue +', rangeDivisor: ' + this.rangeDivisor);
    this.changeValue.emit({value: (this.rangeValue/this.rangeDivisor)});
  }

  onSlideChange(event: any) {
    console.warn('RangeField', '***  onSlideChange  ***');
  }
  
  changeRange(eventRange: any) {
    console.warn('RangeField', '***  changeRange  ***');
    console.log('RangeField', {event: eventRange});
    const detail = eventRange['detail'];
    console.warn('RangeField', '**  detail: ' + JSON.stringify(detail));
    if (detail && detail.value) {
      const indRngClr = detail.value-1;
      console.warn('RangeField', '**  indRngClr: '+ indRngClr +', rangeDivisor: '+ this.rangeDivisor);
      this.rngColor = this.rangeColors[(indRngClr/this.rangeDivisor)];
      this.rngStyle = this.rangeStyles[(indRngClr/this.rangeDivisor)];
    }
    console.warn('RangeField', '**  rngColor: ' + this.rngColor);
  }
  
  setFocus() {
    console.warn('RangeField', '**  setFocus  ***');
    this.nextFocus.emit();
  }

  public setFocusInput() {
    console.warn('RangeField', '**  setFocusInput  ***');
    //const ionRadioGroup = document.getElementById("ionRadioGroup"+this.indxRgnt+''+this.reagent.NoReagent);
  }

  public resetValue() {
    this.rangeValue = 0;
  }

}
