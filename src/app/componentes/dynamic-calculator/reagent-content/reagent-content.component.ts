import { Component, EventEmitter, Input, AfterViewInit, OnInit, Output, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { RangeCustomEvent } from '@ionic/angular';
import { UtilitiesCalculator } from '../../../interfaces/utilities-calculator';

@Component({
  selector: 'app-reagent-content',
  templateUrl: './reagent-content.component.html',
  styleUrls: ['./reagent-content.component.scss'],
  standalone: false,
})
export class ReagentContentComponent implements OnInit, AfterViewInit {
  
  @Input()
  flgScore: any;

  @Input()
  reagent: any;

  @Output() nextFocus: EventEmitter<any> = new EventEmitter<any>();
  @Output() changeValue: EventEmitter<any> = new EventEmitter<any>();
  @Output() changeOption: EventEmitter<any> = new EventEmitter<any>();
  
  @ViewChild('InputFocus', {static: false}) inputFocus: { setFocus: () => void; };
  @ViewChild('InputDateFocus', {static: false}) inputDateFocus: { setFocus: () => void; };

  pinFormatter(value: number) {
    return `${value}`;
  }
  
  protected flgLabelHeader: any;
  protected flgItems = false;
  protected flgIncrease = false;
  protected flgNextCondition = false;
  protected flgRequiered = true;
  protected flgSubtitle = false;
  protected condtnlOption = false;
  protected excludeScore = false;
  protected flgOption = false;
  protected flgPinFormatter = false;
  protected flgShowReagent = true;
  protected flgFinalOption = false;
  protected flgFocusResult = true;
  protected startClnFinalOption = false;
  protected indxRgnt = 0;
  protected increase = 0;
  public arrayCheck: Array<any>;
  public arrayCheckConditional: Array<any>;
  public arrayRadio: Array<any>;
  public selectedValue: any;
  protected strArray:any  = [];
  public inputValue: any;
  public dateValue: any = '';
  public selectedItemOne: any;
  public selectedItemTwo: any;
  public selectedRadio: any = '';
  public rangeValue: any;
  protected dualknobs = false;
  protected snaps = false;
  public rangeMarks: Array<any>;
  public rangeDivisor = 1;
  public rangeMin: any;
  public rangeMax: any;
  public flgKnobs = false;
  public flgSnaps = false;
  public labelsRange: Array<any>;
  public iconsRange: Array<any>;
  protected strValue: string = '';
  protected strSize = 0;
  protected strDateValue: string = '';
  protected currentIndx = '0';
  protected indxItems = 0;
  protected nextReagent = 0;
  protected nextCondtn: any;
  public placeholder = '';
  public strMsjError: any = '';
  protected leyendaValidation = '';
  protected valMinor: any;
  protected valMinEqual: any;
  protected valMajor: any;
  protected valMaxEqual: any;
  protected utilities: UtilitiesCalculator;

  constructor(private sanitizer: DomSanitizer) {
    console.log('***  constructor ***');
  }

  ngOnInit() {
    console.log('***  ngOnInit()  ***');
    this.utilities = new UtilitiesCalculator();
    this.getParams();
  }

  ngAfterViewInit() {
    console.log('***  ngAfterViewInit()  ***');
  }

  getParams() {
    //console.log('***  getParams()  ***');
    this.flgLabelHeader = false;
    this.startClnFinalOption = false;
    if (this.reagent.Type === 'Items') {
      this.flgItems = true;
    } else if (this.reagent.Label && (this.reagent.Type === 'Radio' || this.reagent.Type === 'Check' || this.reagent.Type === 'Range')) {
      this.flgLabelHeader = true;
    }
    if (this.utilities.existInJSON(this.reagent,'"Index"')) {
      let indR = this.reagent.Index;
      if (indR) {
        this.indxRgnt = indR;
      }
    }
    if (this.utilities.existInJSON(this.reagent,'"Disabled"') && this.reagent.Disabled) {
      this.flgShowReagent = false;
    }
    if (this.utilities.existInJSON(this.reagent,'"Index"') && this.reagent.Index > 0) {
      this.flgShowReagent = false;
    }
    this.flgSubtitle = (this.utilities.existInJSON(this.reagent,'"Subtitle"') && this.reagent.Subtitle);
    this.flgRequiered = (this.utilities.existInJSON(this.reagent,'"Requiered"') && this.reagent.Requiered);
    this.flgOption = (this.utilities.existInJSON(this.reagent,'"FlagOption"') && this.reagent.FlagOption);
    if (this.utilities.existInJSON(this.reagent,'"IncreaseTotal"')) {
      this.flgIncrease = true;
    }
    if (this.utilities.existInJSON(this.reagent,'"ConditionalOption"')) {
      this.condtnlOption = this.reagent.ConditionalOption;
      this.flgNextCondition = true;
    } else if (this.utilities.existInJSON(this.reagent,'"ValidateConditions"')) {
      this.condtnlOption = this.reagent.ValidateConditions;
      this.flgNextCondition = true;
    } else if (this.utilities.existInJSON(this.reagent,'"ChangeOption"')) {
      this.condtnlOption = this.reagent.ChangeOption;
    }
    console.log('***  condtnlOption: ' + this.condtnlOption);
    if (this.utilities.existInJSON(this.reagent,'"ExcludeScore"')) {
      this.excludeScore = this.reagent.ExcludeScore;
    }
    if (this.reagent.Items.length > 0) {
      if (this.reagent.Type === 'Radio') {
        this.arrayRadio = [];
        this.arrayRadio = this.reagent.Items;
        console.log('***  arrayRadio-length: ' + this.arrayRadio.length);
      } else if (this.reagent.Type === 'Check') {
        if (this.utilities.existInJSON(this.reagent,'"SubType"') && this.reagent.SubType == 'Conditional') {
          this.arrayCheckConditional = [];
          this.arrayCheckConditional = this.reagent.Items;
          console.log('***  arrayCheckConditional-length: ' + this.arrayCheckConditional.length);
        } else {
          this.arrayCheck = [];
          this.arrayCheck = this.reagent.Items;
          console.log('***  arrayCheck-length: ' + this.arrayCheck.length);
        }
      }
    } else if (this.reagent.Type === 'Select') {
      if (this.utilities.existInJSON(this.reagent,'"StringArray"') && this.reagent.StringArray != '') {
        this.strArray = this.utilities.getArrayFromString(this.reagent.StringArray,'|');
        console.log('***  listAS-length: ' + this.strArray.length);
      }
    } else if (this.reagent.Type === 'Range') {
      if (this.utilities.existInJSON(this.reagent,'"Range"')) {
        let strRange = this.reagent.Range;
        let arrayRange = strRange.split(',');
        //console.warn({range: arrayRange});
        if (arrayRange && arrayRange.length > 0) {
          const strMin = arrayRange[0].replace('[','');
          console.log('***  strMin: ' + strMin);
          this.rangeMin = parseInt(strMin);
          if (strMin.includes('.')) {
            this.rangeMin = parseFloat(strMin);
            let arryMin = strMin.split('.');
            let str = arryMin[1]+'';
            let divCase = str.length;
            console.log('***  divCase: ' + divCase);
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
          console.warn('***  rangeMin: ' + this.rangeMin);
          console.warn('***  rangeDivisor: ' + this.rangeDivisor);
          const strMax = arrayRange[1].replace(']','');
          console.log('***  strMax: ' + strMax);
          this.rangeMax = (parseInt(strMax) * this.rangeDivisor);
          console.warn('***  rangeMax: ' + this.rangeMax);
        }
      }
      this.rangeMarks = [];
      if (this.utilities.existInJSON(this.reagent,'"Marks"')) {
        this.rangeMarks = this.reagent.Marks;
      }
      if (this.utilities.existInJSON(this.reagent,'"Attributes"')) {
        let strAttributes = this.reagent.Attributes;
        if (strAttributes.includes('|')) {
          this.dualknobs = strAttributes.includes('dualknobs');
          this.snaps = strAttributes.includes('snaps');
          this.flgPinFormatter = strAttributes.includes('pin');
        } else {
          if (strAttributes === 'snaps') {
            this.snaps = true;
            this.dualknobs = false;
            this.flgPinFormatter = false;
          } else if (strAttributes === 'dualknobs') {
            this.dualknobs = true;
            this.snaps = false;
            this.flgPinFormatter = false;
          } else if (strAttributes === 'pin') {
            this.flgPinFormatter = true;
            this.dualknobs = false;
            this.snaps = false;
          }
        }
      }
    } else if (this.reagent.Type === 'Input' || this.reagent.Type === 'Date') {
      if (this.utilities.existInJSON(this.reagent,'"Placeholder"') && this.reagent.Placeholder) {
        this.placeholder = this.reagent.Placeholder;
      }
    }
    if (this.utilities.existInJSON(this.reagent,'"Validations"') || this.utilities.existInJSON(this.reagent,'"Conditions"')) {
      let strOptions: any;
      if (this.utilities.existInJSON(this.reagent,'"Validations"')) {
        strOptions = this.reagent.Validations;
      } else if (this.utilities.existInJSON(this.reagent,'"Conditions"')) {
        strOptions = this.reagent.Conditions;
      }
      console.log('***  strOptions: ' + strOptions);
      if (strOptions) {
        let vldtnsResult = this.utilities.getValidations(this.reagent, strOptions);
        console.warn({vldtnsResult: vldtnsResult});
        if (vldtnsResult) {
          this.leyendaValidation = vldtnsResult.leyenda;
          this.strSize = vldtnsResult.sizeStr;
          this.valMinor = vldtnsResult.minor;
          this.valMinEqual = vldtnsResult.minEqual;
          this.valMajor = vldtnsResult.major;
          this.valMaxEqual = vldtnsResult.maxEqual;
        }
      } else {
        console.warn('***  Validations is UNDEFINDED!!');
      }
    }
  }
  
  async loadData() {
    //console.log('***  loadData()  ***');
    switch (this.reagent.Type) {
      case 'Input':
        break;
      case 'Date':
        break;
      case 'Select':
        if (this.strArray.length > 0) {
          const currentSelectTwo = document.querySelector("#ionSelectTwo"+this.indxRgnt+''+this.reagent.NoReagent);
          console.log({select: currentSelectTwo});
          if (this.selectedItemTwo && currentSelectTwo) {
            console.log('***  selectedItemTwo: ' + this.selectedItemTwo);
            currentSelectTwo.setAttribute("value", this.selectedItemTwo);
          }
        } else {
          const currentSelectOne = document.querySelector("#ionSelectOne"+this.indxRgnt+''+this.reagent.NoReagent);
          console.log({select: currentSelectOne});
          if (this.selectedItemOne && currentSelectOne) {
            console.log('***  selectedItemOne: ' + this.selectedItemOne);
            currentSelectOne.setAttribute("value", this.selectedItemOne);
          }
        }
        break;
      case 'Radio':
        const currentRadioGroup = document.querySelector("#ionRadioGroup"+this.indxRgnt+''+this.reagent.NoReagent);
        console.log({radioGroup: currentRadioGroup});
        if (this.selectedRadio && currentRadioGroup) {
          console.log('***  selectedRadio: ' + this.selectedRadio);
          currentRadioGroup.setAttribute("value", this.selectedRadio);
        }
        break;
      case 'Check':
        break;
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

  validateArray(reagent: any) {
    if (reagent.Type == 'Radio' && this.arrayRadio && this.arrayRadio.length > 0) {
      return true;
    } else if (reagent.Type == 'Check' && this.arrayCheck && this.arrayCheck.length > 0) {
      return true;
    } else if (reagent.Type == 'Check' && this.arrayCheckConditional && this.arrayCheckConditional.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  validateStringArray(reagent: any) {
    return (reagent.Type == 'Select' && reagent.Items.length == 0 && reagent.StringArray != '');
  }

  validateRangeArrays() {
    if (this.iconsRange && this.iconsRange.length > 0) {
      return true;
    } else if (this.labelsRange && this.labelsRange.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  changeInputValue(event: any) {
    //console.log('***  changeInputValue  ***');
    console.log({event: event});
    let bndShow: any;
    this.inputValue = event.detail.value;
    console.log('***  inputValue: ' + this.inputValue);
    let strValue = ''+this.inputValue;
    console.warn('***  flgNextCondition: ' + this.flgNextCondition);
    this.loadNextCondition(strValue);
    if (this.inputValue && (this.inputValue+'').length > 0) {
      this.strValue = this.inputValue;
      console.log('***  strValue-length: ' + this.strValue.length);
      this.strMsjError = '';
      let tmpStr = '';
      let bndContinue = true;
      if ((this.valMinor || this.valMajor || this.valMinEqual || this.valMaxEqual)
      && ((this.valMinor+'').includes('.') || (this.valMajor+'').includes('.') || (this.valMinEqual+'').includes('.') || (this.valMaxEqual+'').includes('.'))
      && !this.strValue.includes('.') && this.strValue.length < this.strSize) {
        let tmpVal = 0.0;
        console.log('***  valMinor: '+ this.valMinor +', valMajor: '+ this.valMajor);
        console.log('***  valMinEqual: '+ this.valMinEqual +', valMaxEqual: '+ this.valMaxEqual);
        tmpVal = parseFloat(this.strValue);
        console.log('***  tmpVal: ' + tmpVal);
        if (tmpVal > 0) {
          tmpStr = tmpVal+'';
          if (!tmpStr.includes('.')) {
            tmpStr += '.0';
          }
        } else {
          bndContinue = false;
        }
      } else {
        console.log('***  strValue-indexOf(.): ' + this.strValue.indexOf('.'));
        if (this.strValue.includes('.') && this.strValue.indexOf('.') === 0) {
          this.inputValue = '0' + this.strValue;
          bndContinue = false;
        } else {
          tmpStr = this.strValue;
          if (this.strValue.length < this.strSize && this.leyendaValidation) {
            bndContinue = false;
          }
        }
      }
      console.log('***  strSize: '+ this.strSize +', tmpStr: '+ tmpStr);
      if (this.leyendaValidation && tmpStr.length >= this.strSize) {
        console.log('***  LeyendaValidation: ' + this.leyendaValidation);
        if (this.utilities.existInJSON(this.reagent,'"Parse"')) {
          this.validateConditions();
        } else {
          console.log('***  four-setResponseValue()...');
          this.setResponseValue(bndShow);
        }
      } else if (this.condtnlOption && tmpStr.length >= this.strSize) {
        console.log('***  LeyendaValidation: ' + this.leyendaValidation);
        if (this.utilities.existInJSON(this.reagent,'"Parse"')) {
          this.validateConditions();
        } else {
          console.log('***  four-setResponseValue()...');
          this.setResponseValue(bndShow);
        }
      } else {
        console.log('***  bndContinue: ' + bndContinue);
        if (bndContinue) {
          console.log('***  five-setResponseValue()...');
          this.setResponseValue(bndShow);
        } else if (tmpStr.length > 0) {
          this.validateConditions();
        }
      }
    } else {
      console.log('***  clean value  ***');
      this.strValue = this.inputValue;
      this.setResponseValue(bndShow);
    }
  }

  validateConditions() {
    //console.log('***  validateConditions  ***');
    console.log('***  valMinor: ' + this.valMinor);
    console.log('***  valMajor: ' + this.valMajor);
    let valueCmpr: any;
    switch (this.reagent.Parse) {
      case 'Int':
        valueCmpr = parseInt(this.strValue);
        break;
      case 'Float':
        valueCmpr = parseFloat(this.strValue);
        break;
    }
    console.log('***  valueCmpr: ' + valueCmpr);
    let bndShow: any;
    if (!this.utilities.existInJSON(this.reagent,'"ValidateConditions"')) {
      bndShow = this.reagent.ValidateConditions;
      console.log('***  bndShow: ' + bndShow);
    }
    if (valueCmpr && this.valMinor && this.valMajor && valueCmpr >= this.valMinor && valueCmpr <= this.valMajor) {
      console.log('***  one-setResponseValue()...');
      this.setResponseValue(bndShow);
    } else if (valueCmpr && this.valMinor && valueCmpr >= this.valMinor && !this.valMajor) {
      console.log('***  two-setResponseValue()...');
      this.setResponseValue(bndShow);
    } else if (valueCmpr && this.valMajor && valueCmpr <= this.valMajor && !this.valMinor) {
      console.log('***  three-setResponseValue()...');
      this.setResponseValue(bndShow);
    }  else if (valueCmpr && this.valMinEqual && valueCmpr <= this.valMinEqual && !this.valMinor && !this.valMajor) {
      console.log('***  two-setResponseValue()...');
      this.setResponseValue(bndShow);
    } else if (valueCmpr && this.valMaxEqual && valueCmpr >= this.valMaxEqual && !this.valMinor && !this.valMajor) {
      console.log('***  three-setResponseValue()...');
      this.setResponseValue(bndShow);
    } else if(this.leyendaValidation) {
      console.log('***  showAlertMessage()...');
      this.showAlertMessage();
      console.log('***  four-setResponseValue()...');
      this.setResponseValue(bndShow);
    } else if (valueCmpr && (this.valMinor || this.valMajor || this.valMinEqual || this.valMaxEqual)) {
      console.log('***  five-setResponseValue()...');
      this.setResponseValue(false);
    } else {
      console.log('***  six-setResponseValue()...');
      this.setResponseValue(bndShow);
    }
  }

  changeDateValue(event: any) {
    //console.log('***  changeDateValue  ***');
    console.log({event: event});
    this.dateValue = event.date;
    console.log('***  dateValue: ' + this.dateValue);
    if (this.dateValue) {
      this.strDateValue = this.dateValue;
      let bndShow: any;
      console.log('***  setResponseValue()...');
      this.setResponseValue(bndShow);
    }
  }
  
  changeSelectValue(opc:number, value: any) {
    console.log('***  value: ' + value);
    if (opc === 1) {
      this.selectedItemOne = value;
    } else if (opc === 2) {
      this.selectedItemTwo = value;
    }
    this.strValue = value;
    let bndShow: any;
    console.log('***  setResponseValue()...');
    this.setResponseValue(bndShow);
  }

  showSelect() {
    if (this.strArray.length > 0) {
      const currentSelectTwo = document.getElementById("ionSelectTwo"+this.indxRgnt+''+this.reagent.NoReagent);
      if (currentSelectTwo) {
        console.warn('***  currentSelectTwo.click()...');
        currentSelectTwo.click();
      }
    } else {
      const currentSelectOne = document.getElementById("ionSelectOne"+this.indxRgnt+''+this.reagent.NoReagent);
      if (currentSelectOne) {
        console.warn('***  currentSelectOne.click()...');
        currentSelectOne.click();
      }
    }
  }

  selectRadio() {
    console.log('***  selectRadio  ***');
  }

  radioGroupChange(event:any) {
    //console.warn("***  radioGroupChange",event.detail);
    console.log({eventRadioGroup: event});
  }

  radioFocus() {
    console.log("radioFocus");
  }
  radioSelect(event:any) {
    //console.warn("** radioSelect",event.detail);
    console.log({eventRadio: event});
  }
  radioBlur() {
    console.log("radioBlur");
  }

  checkEvent(indx:any) {
    console.log('***  checkEvent  ***');
    console.log('***  indx: ' + indx);
    let updateItem: any;
    if (this.arrayCheck && this.arrayCheck.length > 0) {
      updateItem = this.arrayCheck[indx];
      updateItem.Checked = updateItem.Checked ? false : true;
      this.arrayCheck[indx] = updateItem;
    } else if (this.arrayCheckConditional && this.arrayCheckConditional.length > 0) {
      console.warn({findItem: this.arrayCheckConditional[indx]});
    }
    let bndShow: any;
    console.log('***  setResponseValue()...');
    this.setResponseValue(bndShow);
  }

  checkConditionalEvent(indxCndtnl:any) {
    console.warn('***  checkConditionalEvent  ***');
    console.log('***  indxCndtnl: ' + indxCndtnl);
    const updateItemC = this.arrayCheckConditional[indxCndtnl];
    console.log({findItemC: updateItemC});
    updateItemC.Checked = updateItemC.Checked ? false : true;
    console.log({updateItemC: updateItemC});
    this.arrayCheckConditional[indxCndtnl] = updateItemC;
    this.flgFinalOption = (this.utilities.existInJSON(updateItemC,'"FinalOption"') && updateItemC.FinalOption);
    console.log('***  flgFinalOption: ' + this.flgFinalOption);
    this.flgFocusResult = (updateItemC.Checked && this.utilities.existInJSON(updateItemC,'"FocusResult"') && updateItemC.FocusResult);
    console.log('***  flgFocusResult: ' + this.flgFocusResult);
    let clnFinalOption = false;
    if (updateItemC.Checked && this.utilities.existInJSON(updateItemC,'"ClearFinalOption"')) {
      console.log('***  utilities.chkClnFinalOption()...');
      clnFinalOption = this.utilities.chkClnFinalOption(this.arrayCheckConditional);
    }
    console.log('***  clnFinalOption: ' + clnFinalOption);
    if (clnFinalOption) {
      if (!this.startClnFinalOption) {
        this.startClnFinalOption = true;
        console.warn('***  startClnFinalOption-Init: ' + this.startClnFinalOption);
        this.clearFinalOption(this.arrayCheckConditional,indxCndtnl,updateItemC.Checked,updateItemC.ClearFinalOption);
      }
    } else {
      let bndShow: any;
      this.startClnFinalOption = false;
      console.log('***  setResponseValue()...');
      this.setResponseValue(bndShow);
    }
  }
  /*
  changeRange(eventRange: Event) {
    console.warn({event: eventRange});
  }
  */
  onKnobMoveStart(eventRange: Event) {
    console.warn('***  onKnobMoveStart  ***');
    console.log({event: eventRange});
  }
  onKnobMoveEnd(eventRange: Event) {
    console.warn('***  onKnobMoveEnd  ***');
    console.log({event: eventRange});
    this.rangeValue = (eventRange as RangeCustomEvent).detail.value;
    //console.warn({rangeValue: this.rangeValue});
    console.log('***  rangeValue: ' + this.rangeValue);
    let bndShow: any;
    console.log('***  setResponseValue()...');
    this.setResponseValue(bndShow);
  }

  loadNextCondition(strValue: string) {
    console.warn('***  strValue: ' + this.strValue);
    if (this.flgNextCondition && strValue
    && (this.utilities.existInJSON(this.reagent,'"ConditionalOption"') || this.utilities.existInJSON(this.reagent,'"ValidateConditions"'))) {
      this.nextCondtn = this.reagent.NextCondition;
    } else if (this.flgNextCondition && (this.utilities.existInJSON(this.reagent,'"ConditionalOption"') || this.utilities.existInJSON(this.reagent,'"ValidateConditions"'))) {
      this.nextCondtn = this.reagent.Next;
    }
    console.warn('***  nextCondtn: ' + this.nextCondtn);
  }

  loadNextFromNextConditions(strValue: string) {
    console.warn('***  strValue: ' + strValue);
    if (strValue) {
      if (this.flgNextCondition && strValue && this.utilities.existInJSON(this.reagent,'"ConditionalOption"')) {
        this.nextCondtn = this.reagent.NextCondition;
      } else if (this.flgNextCondition && this.utilities.existInJSON(this.reagent,'"ConditionalOption"')) {
        this.nextCondtn = this.reagent.Next;
      }
    }
    console.warn('***  nextCondtn: ' + this.nextCondtn);
  }

  clearFinalOption(currentArrayCheck:any, indx:any, itemChecked:any, clnFinalOption:any) {
    let indxChk = -1;
    let count = 0;
    currentArrayCheck.forEach((itemCheck:any) => {
      if (itemCheck.Checked && !clnFinalOption && !this.utilities.existInJSON(itemCheck,'"FinalOption"')) {
        const currentCheckboxOne = this.getCurrentCheckbox(count);
        if (currentCheckboxOne) {
          indxChk = count;
          currentCheckboxOne.setAttribute("checked", 'false');
        }
      } else if (itemCheck.Checked && clnFinalOption && this.utilities.existInJSON(itemCheck,'"FinalOption"')) {
        const currentCheckboxTwo = this.getCurrentCheckbox(count);
        if (currentCheckboxTwo) {
          indxChk = count;
          currentCheckboxTwo.setAttribute("checked", 'false');
        }
      }
      count++;
    });
    console.log('***  indxChk: ' + indxChk);
    setTimeout(() => {
      this.startClnFinalOption = false;
      console.log('***  startClnFinalOption-End: ' + this.startClnFinalOption);
      const updateItem2 = currentArrayCheck[indx];
      updateItem2.Checked = itemChecked;
      console.log({updateItem2: updateItem2});
      if (this.arrayCheck && this.arrayCheck.length > 0) {
        this.arrayCheck[indx] = updateItem2;
      } else 
      if (this.arrayCheck && this.arrayCheck.length > 0) {
        this.arrayCheckConditional[indx] = updateItem2;
      }
      console.warn('***  checkEvent('+ indx +')...');
      this.checkEvent(indx);
    },0);
  }
  
  getCurrentCheckbox(indxChk:any) {
    if (this.arrayCheck && this.arrayCheck.length > 0) {
      return document.querySelector("#chk"+this.indxRgnt+''+this.reagent.NoReagent+''+indxChk);;
    } else if (this.arrayCheckConditional && this.arrayCheckConditional.length > 0) {
      return document.querySelector("#chkC"+this.indxRgnt+''+this.reagent.NoReagent+''+indxChk);;
    } else {
      let anyCheckbox: any;
      return anyCheckbox;
    }
  }

  setVariable(radioItem:any) {
    //console.log('***  setVariable  ***');
    console.log({item: radioItem});
    let bndContinue = true;
    this.strValue = '';
    this.selectedRadio = radioItem.Value;
    console.log('***  selectedRadio: ' + this.selectedRadio);
    if (this.utilities.existInJSON(radioItem,'"ChangeNext"')) {
      this.nextReagent = radioItem.ChangeNext;
    }
    console.warn('***  nextReagent: ' + this.nextReagent);
    if (!this.utilities.existInJSON(this.reagent,'"ChangeOption"') && !this.utilities.existInJSON(this.reagent,'"SetValue"')) {
      this.indxItems = 0;
      let srtVar = radioItem.Value;
      this.strValue = srtVar + '';
      console.log('***  strValue: ' + this.strValue);
    } else if (this.utilities.existInJSON(this.reagent,'"SetValue"') && this.reagent.SetValue) {
      this.indxItems = 0;
      let srtVar = radioItem.Description;
      if (srtVar.includes('. ')) {
        let strArray = srtVar.split('.');
        console.log('***  strArray-length: ' + strArray.length);
        this.strValue = strArray[strArray.length-1];
      } else {
        this.strValue = srtVar;
      }
      console.log('***  strValue: ' + this.strValue);
    } else if (this.utilities.existInJSON(this.reagent,'"ChangeOption"') && this.reagent.ChangeOption) {
      if (this.utilities.existInJSON(radioItem,'"NewIndex"') || this.utilities.existInJSON(radioItem,'"NoItems"')) {
        this.indxItems = (this.utilities.existInJSON(radioItem,'"NewIndex"') ? radioItem.NewIndex : 0);
        console.log('***  indxItems: '+ this.indxItems +', nextReagent: '+ this.nextReagent);
      } else {
        this.indxItems = 0;
      }
      console.log('***  indxItems: ' + this.indxItems);
      let srtVar = radioItem.Value;
      this.strValue = srtVar + '';
      console.log('***  strValue: ' + this.strValue);
      bndContinue = false;
      console.log('***  emitCaseItems()...');
      this.emitCaseItems();
    }
    if (this.utilities.existInJSON(this.reagent,'"Next"') && this.nextReagent == 0) {
      this.nextReagent = this.reagent.Next;
    }
    this.indxItems = (this.utilities.existInJSON(this.reagent,'"Index"') ? this.reagent.Index : 0);
    console.log('***  bndContinue: ' + bndContinue);
    if (bndContinue && this.strValue) {
      let bndShow: any;
      console.log('***  setResponseValue()...');
      this.setResponseValue(bndShow);
    }
  }
  
  setResponseValue(show: any): void {
    console.log('***  setResponseValue  ***');
    let name = this.reagent.Type +''+ this.reagent.NoReagent;
    console.log('***  name: ' + name);
    let anyScore: any;
    let anyValue: any;
    switch (this.reagent.Type) {
      case 'Input':
        console.warn('***  Input ***');
        let respValue: any;
        let respInput = this.strValue;
        console.log('***  respInput: ' + respInput);
        if (respInput) {
          switch (this.reagent.Parse) {
            case '':
              respValue = respInput;
              break;
            case 'Int':
              respValue = parseInt(respInput);
              break;
            case 'Float':
              respValue = parseFloat(respInput);
              break;
            default:
              respValue = respInput;
              break;
          }
        } else {
          respValue = respInput;
        }
        this.emitChangeValue(respValue,anyScore,anyValue,show);
        break;
      case 'Date':
        console.warn('***  Date ***');
        let respDate = this.strDateValue;
        console.log('***  respDate: ' + respDate);
        this.emitChangeValue(respDate,anyScore,anyValue,show);
        break;
      case 'Select':
        console.warn('***  Select ***');
        let respSelect = this.strValue;
        console.log('***  respSelect: ' + respSelect);
        this.emitChangeValue(respSelect,anyScore,anyValue,show);
        break;
      case 'Radio':
        console.warn('***  Radio ***');
        let respRadio = this.strValue;
        console.log('***  excludeScore: '+ this.excludeScore +', respRadio: '+ respRadio);
        if (this.excludeScore || !this.utilities.validateStringIsNumber(this.strValue)) {
          this.emitChangeValue(respRadio,anyValue,anyValue,show);
        } else {
          this.emitChangeValue(respRadio,respRadio,anyValue,show);
        }
        break;
      case 'Check':
        console.warn('***  Check ***');
        let scoreCheck = 0;
        let strArray = '';
        let strValue = '';
        console.warn('***  flgIncrease: ' + this.flgIncrease);
        let bndScore = (this.utilities.existInJSON(this.reagent,'"Score"') ? this.reagent.Score : true);
        console.log('***  bndScore: ' + bndScore);
        let currentArrayCheck: any;
        if (this.arrayCheck && this.arrayCheck.length > 0) {
          currentArrayCheck = this.arrayCheck;
        } else if (this.arrayCheckConditional && this.arrayCheckConditional.length > 0) {
          currentArrayCheck = this.arrayCheckConditional;
        }
        console.log({arrayCheck: currentArrayCheck});
        let loadNxtCndtn = true;
        currentArrayCheck.forEach((check:any) => {
          if (check.Checked) {
            if (bndScore) {
              scoreCheck += parseInt(check.Value);
            } else {
              if (strValue) {
                strValue += '|' + check.Value;
              } else {
                strValue = check.Value;
              }
              if (this.utilities.existInJSON(check,'ChangeNext')) {
                loadNxtCndtn = false;
                console.log('***  ChangeNext: ' + check.ChangeNext);
                this.nextCondtn = check.ChangeNext;
              }
            }
            if (strArray) {
              strArray += '|' + check.ItemId;
            } else {
              strArray = check.ItemId;
            }
            if (this.flgFinalOption) {
              this.flgFinalOption = (this.utilities.existInJSON(check,'"FinalOption"') ? check.FinalOption : false);
            }
            if (this.flgIncrease) {
              this.increase = this.reagent.IncreaseTotal;
              console.warn('***  increase: ' + this.increase);
            }
          }
        });
        console.warn('***  flgNextCondition: ' + this.flgNextCondition);
        if (loadNxtCndtn) {
          this.loadNextCondition(strArray);
        }
        console.log('***  strArray: ' + strArray);
        console.log('***  strValue: ' + strValue);
        console.log('***  scoreCheck: ' + scoreCheck);
        this.emitChangeValue(strArray,scoreCheck,strValue,show);
        break;
      case 'Range':
        console.warn('***  rangeValue: ' + this.rangeValue);
        let valueRange = (this.rangeValue/this.rangeDivisor);
        anyScore = valueRange;
        console.log('***  valueRange: ' + valueRange);
        this.emitChangeValue(valueRange,anyScore,anyValue,show);
        break;
    }
  }

  setFocus() {
    console.log('***  setFocus  ***');
    if (this.nextReagent == 0) {
      this.nextReagent = (this.utilities.existInJSON(this.reagent,'"Next"') ? this.reagent.Next : (this.reagent.NoReagent+1));
    }
    let itemFocus = {
      page: { index: this.indxItems, next: this.nextReagent }
    };
    this.nextFocus.emit(itemFocus);
  }

  emitChangeValue(strValue: any, score: any, strValue2: string, showOption: any) {
    //console.log('***  emitChangeValue  ***');
    if (!this.flgScore && score) {
      this.flgScore = true;
    } else if (this.excludeScore && !score) {
      this.flgScore = false;
    }
    console.log('***  flgScore: ' + this.flgScore);
    console.warn('***  flgIncrease: '+ this.flgIncrease +', increase: '+ this.increase);
    console.warn('***  utilities.getChangeResult()...');
    let itemResult = this.utilities.getChangeResult(this.reagent, this.flgFinalOption, this.flgScore, this.flgFocusResult, this.flgOption, strValue, score, strValue2, this.condtnlOption, this.nextCondtn, this.indxItems, showOption, this.strMsjError, this.flgIncrease, this.increase);
    if (itemResult) {
      this.changeValue.emit(itemResult);
    }
  }

  emitCaseItems() {
    //console.log('***  emitCaseItems  ***');
    console.warn('***  utilities.getCaseResult()...');
    let itemChngResult = this.utilities.getCaseResult(this.reagent, this.strValue, this.indxItems, this.nextReagent, this.condtnlOption);
    if (itemChngResult) {
      this.changeOption.emit(itemChngResult);
    }
  }

  public showReagent() {
    console.log('***  showReagent  ***');
    console.warn({reagent: this.reagent});
    if (!this.flgShowReagent) {
      this.flgShowReagent = (this.flgItems ? false : true);
    }
  }

  public hideReagent() {
    if (this.flgShowReagent) {
      this.flgShowReagent = false;
    }
  }

  public getSateReagent() {
    if (this.utilities.existInJSON(this.reagent,'"Index"')) {
      console.log('***  Index: '+ this.reagent.Index +', No: '+ this.reagent.NoReagent +', items: '+ this.flgItems +', requiered: '+ this.flgRequiered +', show: '+ this.flgShowReagent);
    } else {
      console.log('***  No: '+ this.reagent.NoReagent +', items: '+ this.flgItems +', requiered: '+ this.flgRequiered +', show: '+ this.flgShowReagent);
    }
  }

  public setFocusReagent() {
    console.log('***  setFocusReagent  ***');
    switch (this.reagent.Type) {
      case 'Input':
        const ionInput = document.getElementById("ionInput"+this.indxRgnt+''+this.reagent.NoReagent);
        if (ionInput) {
          console.warn({attributeNames: ionInput.getAttributeNames()});
          console.log('***  inputFocus.setFocus()...');
          this.inputFocus.setFocus();
        }
        break;
      case 'Date':
        const ionDate = document.getElementById("ionDate"+this.indxRgnt+''+this.reagent.NoReagent);
        if (ionDate) {
          console.warn({attributeNames: ionDate.getAttributeNames()});
          console.log('***  inputDateFocus.setFocus()...');
          this.inputDateFocus.setFocus();
        }
        break;
      case 'Radio':
        console.log('***  indxRgnt: ' + this.indxRgnt);
        const currentRadioGroup:any = document.querySelector("#ionRadioGroup"+this.indxRgnt+''+this.reagent.NoReagent);
        if (currentRadioGroup) {
          if (currentRadioGroup.getAttribute("focus")) {
            console.log('***  cntntReagent.setAttribute(focus)...');
            currentRadioGroup.setAttribute("focus", 'true');
          } else if (currentRadioGroup.getAttribute("tabindex")) {
            console.log('***  cntntReagent.setAttribute(tabindex)...');
            currentRadioGroup.setAttribute("tabindex", '0');
          } else {
            console.warn({attributeNames: currentRadioGroup.getAttributeNames()});
          }
        }
        break;
      case 'Check':
        let indxCheck = 0;
        const currentCheckbox = document.querySelector("#chk"+this.indxRgnt+''+this.reagent.NoReagent+''+indxCheck);
        if (currentCheckbox) {
          if (currentCheckbox.getAttribute("focus")) {
            console.log('***  cntntReagent.setAttribute(focus)...');
            currentRadioGroup.setAttribute("focus", 'true');
          } else if (currentCheckbox.getAttribute("tabindex")) {
            console.log('***  cntntReagent.setAttribute(tabindex)...');
            currentRadioGroup.setAttribute("tabindex", '0');
          } else {
            console.warn({attributeNames: currentCheckbox.getAttributeNames()});
          }
        }
        break;
    }
  }

  public resetParams() {
    this.inputValue = '';
    this.dateValue = '';
    this.strValue = '';
    this.strDateValue = '';
    this.rangeValue = 0;
    if (this.selectedItemOne) {
      this.selectedItemOne = '';
    } else if (this.selectedItemTwo) {
      this.selectedItemTwo = '';
    }
    if (this.arrayRadio && this.arrayRadio.length > 0) {
      this.resetArrayRadio();
    }
    if (this.arrayCheck || this.arrayCheckConditional) {
      this.resetArrayCheck();
    }
  }

  async resetArrayCheck() {
    let indxCheck = 0;
    if (this.arrayCheck && this.arrayCheck.length > 0) {
      console.log('***  arrayCheck-length: ' + this.arrayCheck.length);
      this.arrayCheck.forEach((itemCheck) => {
        const currentCheckbox = document.querySelector("#chk"+this.indxRgnt+''+this.reagent.NoReagent+''+indxCheck);
        if (currentCheckbox) {
          currentCheckbox.setAttribute("checked", 'false');
        }
        indxCheck++;
      });
      const arryCheck = this.arrayCheck;
      console.log('***  arryCheck-length: ' + arryCheck.length);
      this.arrayCheck = [];
      this.arrayCheck = arryCheck;
    } else if (this.arrayCheckConditional && this.arrayCheckConditional.length > 0) {
      console.log('***  arrayCheckConditional-length: ' + this.arrayCheckConditional.length);
      this.arrayCheckConditional.forEach((itemCheckC) => {
        const currentCheckboxC = document.querySelector("#chkC"+this.indxRgnt+''+this.reagent.NoReagent+''+indxCheck);
        if (currentCheckboxC) {
          currentCheckboxC.setAttribute("checked", 'false');
        }
        indxCheck++;
      });
      const arryCheckCndtnal = this.arrayCheckConditional;
      console.log('***  arryCheckCndtnal-length: ' + arryCheckCndtnal.length);
      this.arrayCheckConditional = [];
      this.arrayCheckConditional = arryCheckCndtnal;
    }
  }
  
  async resetArrayRadio() {
    console.log('***  arrayRadio-length: ' + this.arrayRadio.length);
    this.arrayRadio.forEach((itemRadio) => {
      if (this.selectedRadio && this.selectedRadio == itemRadio.Value) {
        this.selectedRadio = '';
        const currentRadioGroup = document.querySelector("#ionRadioGroup"+this.indxRgnt+''+this.reagent.NoReagent);
        if (currentRadioGroup) {
          currentRadioGroup.setAttribute("value", '');
        }
      }
    });
  }

  showAlertMessage() {
    if (this.leyendaValidation) {
      this.strMsjError = this.leyendaValidation;
    }
  }

}
