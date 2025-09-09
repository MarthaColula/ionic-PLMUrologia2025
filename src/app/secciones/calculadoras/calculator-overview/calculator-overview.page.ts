import { DOCUMENT } from '@angular/common';
import { AfterViewInit, Component, HostListener, Inject, OnInit, ViewChild, ViewChildren, QueryList, OnDestroy } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, ModalController, Platform } from '@ionic/angular';
import { 
  CalculatorsDynamicService, 
  DynamicScriptLoaderService, 
  GlobalvarsService, 
  ControllersIonicService, 
  PlmAssetsEngineService, 
  //FirebaseAnalyticsService,  
  PlmTrackingEngineService   
} from "src/app/services/indexServices"
import { InAppBrowserService } from 'src/app/services/in-app-browser.service';
import { UtilitiesCalculator } from 'src/app/interfaces/utilities-calculator';
import { BehaviorSubject, Subscription } from 'rxjs';
import { IInfoTracking } from 'src/app/interfaces/PLMTrackingEngine';
import { InfoEntities, SearchType } from 'src/app/interfaces/catalogs';
import { PopNoteComponent } from 'src/app/componentes/dynamic-calculator/pop-note/pop-note.component';

declare var calculatorBusinessLogicObject: any;

@Component({
  selector: 'app-calculator-overview',
  templateUrl: './calculator-overview.page.html',
  styleUrls: ['./calculator-overview.page.scss'],
  standalone: false,
})

export class CalculatorOverviewPage implements OnInit, AfterViewInit, OnDestroy {

  target!: HTMLElement;
  @HostListener('click', ['$event', '$event.target']) onClick(event: any, target: any) {
    this.target = target;
    const attributes: NamedNodeMap = this.target.attributes;
    let longitud = attributes.length;
    if (longitud > 0) {
      longitud = ((longitud >= 1) ? (longitud - 1) : longitud);
      let eventName: string = this.target.attributes[longitud].value.toString();
      if (eventName && eventName.includes('(')) {
        eventName = eventName.split('(')[0];
        switch (eventName) {
          case 'inAppBrowser':
            let newstr: string = this.target.attributes[longitud].value.toString();
            newstr = newstr.replace('(', ' ');
            newstr = newstr.replace(')', ' ');
            let splits = newstr.split(' ');
            splits.pop();
            this.openInAppBroser(splits[1]);
            break;
          case 'showNote':
            let strNote: string = this.target.attributes[longitud].value.toString();
            strNote = strNote.replace('showNote(', '');
            strNote = strNote.replace(')', '');
            this.showNote(strNote);
            break;
        }
      }
    }
  }

  showResult = false;
  isEnabledCalcular = false;
  isReset = false;

  electronicId: any;
  showBanner$ = new BehaviorSubject(false);

  solutionHtmlStr!: SafeHtml;

  @ViewChild('NoteInit', { static: false }) noteInitElement!: { setFocus: () => void; };
  @ViewChild('NoteResult', { static: false }) noteResultElement!: { setFocus: () => void; };

  valueSelected: string = "1";

  @ViewChildren('CardContent') cardContent!: QueryList<any>;
  arrayCardContent: any = [];

  successRequest = new BehaviorSubject<boolean>(false);
  exception = new BehaviorSubject<boolean>(false);

  previousNext: any = 0;
  nextView: any = 0;
  previousIndex: any;
  previousReagent: any;
  currentValue: any;
  currentParam: any;
  indxClnNxt: any;
  arrayIndexClnNxt: any;
  maxIndxItems: any;

  mIndexItems: any;
  mReagent: any;
  mScore: any;
  mFScore: any;
  mStrCase: any;
  mHtmlResult: any;
  mStrResult: any;
  mNoteResult: string = '';
  mObservation: string = '';

  mCalculatorData: any;
  mAboutCalculator: Array<any> = [];
  mIndications: any;

  arrayListReagents: Array<Array<any>> = [];

  dataResults: any;
  tableResults: any;
  arrayResponses: Array<any> = [];
  titleResults: any;
  totalReagents = 0;
  arrayInc: Array<any> = [];
  //incTotal = 0;
  increaseTotal = 0;
  increaseAccumulated = 0;
  sumAllReactants = 0;
  newTotalReagents = 0;
  timeoutFocus = 150;
  timeoutFocusResult = 250;

  flgChngNext: boolean = false;
  flgClnNxtCndtn: boolean = false;
  flgClnParams: boolean = false;
  flgDecrease: boolean = false;
  flgFocusNext: boolean = true;
  flgFocusResult: boolean = true;
  flgFunction: boolean = false;
  flgScore: boolean = false;
  flgShow: boolean = false;
  flgShowCalBttn: boolean = true;

  chngIndex: boolean = false;
  completeCalculator: boolean = false;
  showAutoResult: boolean = true;
  updPrevious: boolean = false;

  mUtilities: UtilitiesCalculator;

  subQueryParams!: Subscription;
  getInformationSub!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private platform: Platform,
    private modalCtrl: ModalController,
    private navCtrl: NavController,
    private sanitizer: DomSanitizer,
    @Inject(DOCUMENT) private document: Document,
    private calculatorsDynamicService: CalculatorsDynamicService,
    private dynamicScriptLoaderServiceService: DynamicScriptLoaderService,
    private controllersIonicService: ControllersIonicService,
    private iab: InAppBrowserService,
    private plmAssetsEngineService: PlmAssetsEngineService,
    //private fa: FirebaseAnalyticsService,
    private globalVarsService: GlobalvarsService,
    private plmTrackingEngineService: PlmTrackingEngineService
  ) {
    this.mUtilities = new UtilitiesCalculator();
    this.getParams();
  }

  ngOnInit() {
    try {
      console.log('***  testGreetingEnglish()...');
      calculatorBusinessLogicObject.testGreetingEnglish('TestCalculator');
    } catch (ex) {
      console.error(ex);
      this.loadCalculatorSolutionsScript();
      return console.error(ex);
    }
  }



  ngAfterViewInit(): void {
    console.log('***  ngAfterViewInit()  ***');
    this.cardContent.changes.subscribe({
      next: () => {
        this.arrayCardContent = this.cardContent.toArray();
        console.log({ currentCards: this.arrayCardContent });
        this.showHideCardContent(false, false);
      },
      error: ex => {
        console.error('Error: ', JSON.stringify(ex))
      },
      complete: () => {
        console.log('succesful cardContent-changes')
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subQueryParams) {
      this.subQueryParams.unsubscribe();
    }
  }

  async loadCalculatorSolutionsScript() {
    console.warn('called loadCalculatorSolutionsScript method from CalculadorasPage');
    return await this.dynamicScriptLoaderServiceService
      .loadScript('calculatorBusinessLogic')
      .then(result => {
        console.warn(result);
        return true;
      })
      .catch(result => {
        return false;
      });
  }

  openInAppBroser(url: string, tituloPagina?: string) {
    console.warn(url);
    this.iab.open(url);
  }

  async showNote(note: any) {
    console.log('***  showNote  ***');
    console.warn('***  note: ' + note);
    let strTitle = 'Nota';
    let strNote = '';
    if (note.includes('|')) {
      let arryNote = note.split('|');
      strTitle = arryNote[0];
      strNote = arryNote[1];
    } else {
      strNote = note;
    }
    const modal = await this.modalCtrl.create({
      component: PopNoteComponent,
      breakpoints: [0, 0.3, 0.5, 0.8],
      initialBreakpoint: 0.5,
      componentProps: {
        'utilities': this.mUtilities,
        'title': strTitle,
        'note': strNote
      }
    });
    await modal.present();
  }

  getParams() {
    const params:any = this.router.getCurrentNavigation()?.extras.state;
    console.log('>>> Params', params);

    this.subQueryParams = this.route.queryParams.subscribe(() => {
      if (params.deeplinkId !== undefined) {
        let id = params.deeplinkId;
        this.getInfomationByTypeDeeplink(id);
      } else {
        let itemCal = params.calculator;
        console.log({ item: itemCal });
        this.getCalculatorData(itemCal);
        //this.fa.trackingFATitle('Calculadora ' + itemCal.ElectronicTitle );
        //this.fa.trackFAEventClick('Calculadora', itemCal.ElectronicTitle);
        this.trackingFATitle(itemCal.ElectronicTitle);

        this.electronicId=params.calculator.ElectronicId;
        
        this.showBanner$.next(true);
        console.log('ElectronicId ', this.electronicId);

      }
    });



  }

  initData() {
    console.log({ Data: this.mCalculatorData });
    this.mIndexItems = 0;
    if (this.mUtilities.existInJSON(this.mCalculatorData, '"TimeoutFocus"')) {
      this.timeoutFocus = this.mCalculatorData.TimeoutFocus;
    }
    if (this.mUtilities.existInJSON(this.mCalculatorData, '"TimeoutFocusResult"')) {
      this.timeoutFocusResult = this.mCalculatorData.TimeoutFocusResult;
    }
    this.mAboutCalculator = this.mCalculatorData.AboutCalculator;
    console.log({ mAboutCalculator: this.mAboutCalculator });
    this.mCalculatorData.Definition.forEach((element:any) => {
      console.log({ element: element });
      switch (element.Type) {
        case 'Indications':
          this.mIndications = element.Label;
          break;
      }
    });
    this.maxIndxItems = this.mIndexItems;
    this.previousIndex = this.mIndexItems;
    this.arrayListReagents.push(this.mCalculatorData.Reagents);
    let arrayReagents = this.arrayListReagents[this.mIndexItems];
    let initReagent = arrayReagents[0];
    if (this.mUtilities.existInJSON(initReagent, '"Total"')) {
      this.totalReagents = initReagent.Total;
    } else {
      this.totalReagents = arrayReagents.length;
    }
    //this.newTotalReagents = this.totalReagents;
    this.sumAllReactants = this.totalReagents;
    this.dataResults = this.mCalculatorData.Results;
    if (this.mUtilities.existInJSON(this.dataResults, '"Note"')) {
      this.mNoteResult = this.dataResults.Note;
    }
    if (this.mUtilities.existInJSON(this.dataResults, '"ShowCalculateButton"')) {
      this.flgShowCalBttn = this.dataResults.ShowCalculateButton;
    }
    if (this.mUtilities.existInJSON(this.dataResults, '"ShowAutoResult"')) {
      this.showAutoResult = this.dataResults.ShowAutoResult;
    }
    if (this.mUtilities.existInJSON(this.dataResults, '"Score"')) {
      this.flgScore = this.dataResults.Score;
    }
    if (this.mUtilities.existInJSON(this.mCalculatorData, '"TableResults"')) {
      this.tableResults = this.mCalculatorData.TableResults;
      console.log({ tableResults: this.tableResults });
    }
    let strIndx: any;
    console.log('***  getArryRgntsItems()...');
    let arrayMoreRgnts = this.getArryRgntsItems(arrayReagents);
    console.log('***  arrayMoreRgnts-length: ' + arrayMoreRgnts.length);
    if (arrayMoreRgnts.length) {
      this.maxIndxItems++;
      console.log('***  setArrayItems()...');
      this.setArrayItems(arrayMoreRgnts, strIndx);
    }
    if (this.mUtilities.existInJSON(this.mCalculatorData, '"Function"')) {
      this.flgFunction = true;
    }
    console.log('***  loading.hideLoader()...');
  }

  getArryRgntsItems(arrayReagents: any) {
    let arryRgntsItems: Array<Array<any>> = [];
    arrayReagents.forEach((itemR1:any) => {
      console.log({ item: itemR1 });
      if (itemR1.Type == 'Items') {
        arryRgntsItems.push(itemR1);
      }
    });
    return arryRgntsItems;
  }

  setArrayItems(listArrayReagents: any, strIndx: string) {
    let arrayStrIndx: Array<string> = [];
    let listArryMoreRgnts: Array<Array<any>> = [];
    let count1 = 0;
    console.log({ lstArryRgnts: listArrayReagents });
    listArrayReagents.forEach((itemR2:any) => {
      console.log({ itemR: itemR2 });
      if (itemR2.Type == 'Items') {
        count1++;
        let subArrayReagents = itemR2.Items;
        let tmpStrIndx = (strIndx ? (strIndx + count1) : ('' + count1));
        arrayStrIndx.push(tmpStrIndx);
        console.log({ subArrayReagents: subArrayReagents });
        console.log('***  subArrayReagents-length: ' + subArrayReagents.length);
        this.arrayListReagents.push(subArrayReagents);
        let arryItems = this.getArryRgntsItems(subArrayReagents);
        if (arryItems.length > 0) {
          arrayStrIndx.push(tmpStrIndx);
          listArryMoreRgnts.push(arryItems);
        }
      }
    });
    if (listArryMoreRgnts.length > 0) {
      console.log('***  listArryMoreRgnts-length: ' + listArryMoreRgnts.length);
      let count2 = 0;
      listArryMoreRgnts.forEach((arryMoreRgnts) => {
        count2++;
        this.maxIndxItems = count2;
        this.setArrayItems(arryMoreRgnts, arrayStrIndx[count2 - 1]);
      });
    }
  }

  validateContentHTML(srtContent: string) {
    let result = false;
    if (srtContent && this.mUtilities.validateStringIncludes(srtContent, this.mUtilities.getArrayElementsHTML())) {
      result = true;
    }
    return result;
  }

  cleanAllParameters() {
    console.log('***  cleanAllParameters ***');
    this.arrayResponses = [];
    console.log('***  arrayCardContent-length: ' + this.arrayCardContent.length);
    this.arrayCardContent.forEach((itemC:any) => {
      const resetCard = itemC;
      resetCard.resetParams();
      const cardRgntRst = resetCard.reagent;
      if (this.mUtilities.existInJSON(cardRgntRst, '"Disabled"') && cardRgntRst.Disabled) {
        resetCard.hideReagent();
      }
    });
  }

  cleanParameters() {
    console.log('***  cleanParameters ***');
    console.log('***  chngIndex: ' + this.chngIndex);
    if (this.chngIndex) {
      let strClnParam = '';
      console.log('***  previousIndex: ' + this.previousIndex);
      const arrayLR = this.arrayListReagents;
      console.log('***  arrayLR-length: ' + arrayLR.length);
      if (this.mIndexItems === 0 && this.mIndexItems === this.previousIndex) {
        console.warn({ reagent: this.mReagent });
        if (this.mUtilities.existInJSON(this.mReagent, '"Previous"') && this.mUtilities.existInJSON(this.mReagent, '"PreviousIndex"')) {
          let prevIndx = this.mReagent.PreviousIndex;
          let previous = this.mReagent.Previous;
          console.log('***  prevIndx: ' + prevIndx + ', previous: ' + previous);
          strClnParam = arrayLR[prevIndx][previous - 1].Param;
        } else if (this.mUtilities.existInJSON(this.mReagent, '"Previous"')) {
          let previous = this.mReagent.Previous;
          console.log('***  previous: ' + previous);
          strClnParam = arrayLR[0][previous - 1].Param;
        } else if (this.mUtilities.existInJSON(this.mReagent, '"Param"')) {
          strClnParam = this.mReagent.Param;
        }
      } else {
        let strRgnt = JSON.stringify(arrayLR[this.previousIndex][0]).toString();
        console.log({ strRgnt: strRgnt });
        let jsonRgnt = JSON.parse(strRgnt);
        console.log({ jsonRgnt: jsonRgnt });
        if (this.mUtilities.existInJSON(jsonRgnt, '"Previous"') && this.mUtilities.existInJSON(jsonRgnt, '"PreviousIndex"')) {
          let prevIndx = jsonRgnt.PreviousIndex;
          let previous = jsonRgnt.Previous;
          console.log('***  prevIndx: ' + prevIndx + ', previous: ' + previous);
          strClnParam = arrayLR[prevIndx][previous - 1].Param;
        } else if (this.mUtilities.existInJSON(jsonRgnt, '"Previous"')) {
          let previous = jsonRgnt.Previous;
          console.log('***  previous: ' + previous);
          strClnParam = arrayLR[0][previous - 1].Param;
        } else if (this.mUtilities.existInJSON(jsonRgnt, '"Param"')) {
          strClnParam = jsonRgnt.Param;
        }
      }
      console.log('***  strClnParam: ' + strClnParam);
      if (strClnParam) {
        console.log('***  arrayResponses-length: ' + this.arrayResponses.length);
        let newArrayResponses: Array<any> = [];
        let bndContinue = true;
        this.arrayResponses.forEach((resp) => {
          if (bndContinue) {
            newArrayResponses.push(resp);
          }
          if (resp.param == strClnParam) {
            bndContinue = false;
          }
        });
        console.log('***  newArrayResponses-length: ' + newArrayResponses.length);
        if (newArrayResponses.length < this.arrayResponses.length) {
          this.flgClnParams = true;
          this.arrayResponses = [];
          this.arrayResponses = newArrayResponses;
          console.log('***  arrayResponses-length: ' + this.arrayResponses.length);
          console.log({ arrayResponses: this.arrayResponses });
        }
      }
    }
  }

  cleanParametersFromResponses(hideCard: any) {
    console.log('***  cleanParametersFromResponses ***');
    console.warn({ arrayResponses: this.arrayResponses });
    console.log("***  indxClnNxt: " + this.indxClnNxt + ', flgDecrease: ' + this.flgDecrease);
    this.arrayListReagents.forEach((lstReagents) => {
      this.arrayCardContent.forEach((itemC:any) => {
        const resetCard = itemC;
        const cardRgntRst = resetCard.reagent;
        lstReagents.forEach((rgntRst) => {
          if (this.arrayIndexClnNxt && this.arrayIndexClnNxt.length > 0) {
            if (cardRgntRst.NoReagent != this.nextView && cardRgntRst.NoReagent === rgntRst.NoReagent && !this.mUtilities.existParamInResponses(this.arrayResponses, rgntRst.Param)) {
              console.warn({ cardRgntRst: cardRgntRst });
              resetCard.resetParams();
              if (hideCard && this.mUtilities.existInJSON(cardRgntRst, '"Disabled"') && cardRgntRst.Disabled) {
                this.getDecreaseTotal(resetCard, cardRgntRst);
                console.warn('***  resetCard.hideReagent()...');
                resetCard.hideReagent();
              }
            }
          } else if (cardRgntRst.NoReagent === rgntRst.NoReagent && !this.mUtilities.existParamInResponses(this.arrayResponses, rgntRst.Param)) {
            console.warn({ cardRgntRst: cardRgntRst });
            resetCard.resetParams();
            if (hideCard && this.mUtilities.existInJSON(cardRgntRst, '"Disabled"') && cardRgntRst.Disabled) {
              this.getDecreaseTotal(resetCard, cardRgntRst);
              console.warn('***  resetCard.hideReagent()...');
              resetCard.hideReagent();
            }
          }
        });
      });
    });
  }
  /*****  CATCH EVENTS INIT *****/
  nextFocus(itemNext:any) {
    console.warn('***  nextFocus ***');
    console.log({ item: itemNext });
    let nxtReagent: any;
    let nxtRgnt = itemNext.page.next;
    if (!this.mReagent || (this.mReagent && this.mReagent.NoReagent != nxtRgnt)) {
      nxtReagent = this.mUtilities.getPreviousReagentByIndexAndNoReagent(this.arrayListReagents, this.mIndexItems, nxtRgnt);
    } else if (this.mReagent) {
      nxtReagent = this.mReagent;
    }
    console.warn('***  completeCalculator: ' + this.completeCalculator);
    if (!this.completeCalculator) {
      this.focusCurrentReagent(nxtReagent);
    } else {
      this.getResult();
    }
  }

  changeValue(itemValue:any) {
    console.warn('***  changeValue ***');
    console.log({ item: itemValue });
    this.flgShow = false;
    this.flgDecrease = false;
    this.flgClnNxtCndtn = false;
    this.previousIndex = this.mIndexItems;
    //this.incTotal = 0;
    this.increaseTotal = 0;
    this.indxClnNxt = -1;
    let indxItems = (isNaN(itemValue.page.index) ? itemValue.page.index : parseInt('' + itemValue.page.index));
    this.chngIndex = ((this.mIndexItems != indxItems) ? true : false);
    let strIndex = '' + itemValue.page.index;
    if (strIndex) {
      this.mIndexItems = parseInt(strIndex);
    }
    console.warn('***  mIndexItems: ' + this.mIndexItems);
    this.currentParam = itemValue.response.param;
    console.warn('***  currentParam: ' + this.currentParam);
    this.currentValue = itemValue.response.value;
    console.warn('***  currentValue: ' + this.currentValue);
    let flgInc = itemValue.page.flgInc;
    console.warn('***  flgInc: ' + flgInc);
    let strInc = '' + itemValue.page.increase;
    if (strInc) {
      this.increaseTotal = parseInt(strInc);
    }
    /*if (!this.currentValue && this.increaseTotal > 0) {
      this.increaseTotal = this.increaseTotal * -1;
    }*/
    console.warn('***  increaseTotal: ' + this.increaseTotal);
    const exstNxt = this.mUtilities.existInJSON(itemValue, '"next"');
    const itemType = itemValue.response.type;
    console.warn('***  itemType: ' + itemType);
    if (this.currentValue
      || (!this.currentValue && this.mUtilities.existParamInResponses(this.arrayResponses, this.currentParam))) {
      let flgClnCards = false;
      if (exstNxt) {
        this.previousNext = this.nextView;
        console.warn({ previousReagent: this.previousReagent });
        if (this.previousReagent && this.mUtilities.existInJSON(this.previousReagent, '"ConditionalOption"') && !this.currentValue) {
          this.flgClnNxtCndtn = true;
        } else if (this.previousReagent && this.mUtilities.existInJSON(this.previousReagent, '"ValidateConditions"')) {
          this.flgClnNxtCndtn = true;
        } else if (this.previousReagent && this.mUtilities.existInJSON(this.previousReagent, '"ChangeOption"')) {
          this.flgClnNxtCndtn = true;
        }
        let strNext = '' + itemValue.page.next;
        this.nextView = (strNext.includes('.') ? parseFloat(strNext) : parseInt(strNext));
        console.warn('***  previousNext: ' + this.previousNext + ', nextView: ' + this.nextView);
        if (this.nextView && (this.nextView < this.previousNext || this.nextView > this.previousNext)) {
          this.flgChngNext = true;
        } else if (this.nextView && this.nextView == this.previousNext) {
          this.flgChngNext = itemValue.page.show;
        }
        this.updPrevious = this.flgChngNext;
        console.warn('***  updPrevious: ' + this.updPrevious);
        if (this.mUtilities.existInJSON(itemValue, '"finalOption"')) {
          console.log('***  updateReagent()...');
          this.updateReagent(itemValue.response.finalOption);
          if (this.previousNext > this.nextView) {
            flgClnCards = true;
          }
        }
      } else if (flgInc) {
        this.flgChngNext = (this.currentValue == '' ? false : true);
        console.warn('***  flgChngNext: ' + this.flgChngNext);
        console.warn({ arrayInc: this.arrayInc });
        if (this.flgChngNext && this.mUtilities.existParamInArray(this.arrayInc, this.currentParam)) {
          this.flgChngNext = false;
        } else {
          console.warn('***  this.arrayInc.push()...');
          this.arrayInc.push(this.currentParam);
        }
      }
      console.warn('***  flgClnCards: ' + flgClnCards + ', flgClnNxtCndtn: ' + this.flgClnNxtCndtn);
      const chngRespValue = this.updateArrayResponses(itemValue.response, flgClnCards);
      if (chngRespValue) {
        console.log('***  cleanResults()...');
        this.cleanResults();
      }
      if (!this.mUtilities.validateResults(this.mStrResult, this.mHtmlResult)) {
        let finalOption = false;
        this.flgFocusResult = true;
        console.log('***  currentValue: ' + this.currentValue);
        if (this.mUtilities.existInJSON(itemValue, '"finalOption"') && itemValue.response.finalOption && this.currentValue) {
          finalOption = true;
          console.warn('***  flgClnCards: ' + flgClnCards);
          if (flgClnCards) {
            this.flgShow = true;
            console.log('***  showHideCardContent()...');
            this.showHideCardContent(flgClnCards, finalOption);
          }
          if (this.mUtilities.existInJSON(itemValue, '"focus"')) {
            this.flgFocusResult = itemValue.response.focus;
            console.warn('***  flgFocusResult: ' + this.flgFocusResult);
          }
        }
        console.warn('***  finalOption: ' + finalOption);
        if (finalOption) {
          console.warn('***  FinalOption  ***');
          if (!this.mReagent) {
            console.log('***  updateReagent()...');
            this.updateReagent(finalOption);
          }
        } else if (exstNxt) {
          let strNext = '' + itemValue.page.next;
          this.nextView = (strNext.includes('.') ? parseFloat(strNext) : parseInt(strNext));
          console.warn('***  nextView: ' + this.nextView);
          console.log('***  updateReagent()...');
          this.updateReagent(false);
          this.flgShow = itemValue.page.show;
          console.warn('***  flgShow: ' + this.flgShow);
          console.log('***  showHideCardContent()...');
          this.showHideCardContent(this.flgClnNxtCndtn, false);
        } else {
          let strNoReagent = '' + itemValue.page.noReagent;
          console.log('***  strNoReagent: ' + strNoReagent);
          if (strNoReagent != 'undefined') {
            this.nextView = (strNoReagent.includes('.') ? (parseFloat(strNoReagent) + 1.0) : (parseInt(strNoReagent) + 1));
          }
          console.warn('***  nextView: ' + this.nextView);
          console.log('***  updateReagent()...');
          this.updateReagent(false);
        }
        console.log('***  validateTotalReagent()...');
        this.validateTotalReagent();
        console.log('***  calculatorIsComplete()...');
        this.calculatorIsComplete(finalOption, itemType);
        this.focusAndScrollReagent(finalOption, itemType);
      } else {
        console.warn('***  The results are already available!!');
      }
    } else {
      console.warn('***  Parameter value was cleared!!');
    }
  }

  changeOption(itemOption:any, indx:any) {
    console.warn('***  changeOption ***');
    console.log({ item: itemOption });
    console.log('***  indx: ' + indx);
    this.flgShow = false;
    this.flgClnNxtCndtn = false;
    this.arrayIndexClnNxt = [];
    this.previousIndex = this.mIndexItems;
    let indxItems = parseInt(itemOption.page.index + '');
    if (this.mIndexItems != indxItems) {
      this.chngIndex = true;
    } else {
      this.chngIndex = false;
    }
    let strIndex = '' + itemOption.page.index;
    if (strIndex) {
      this.mIndexItems = parseInt(strIndex);
    }
    console.warn('***  mIndexItems: ' + this.mIndexItems);
    const exstNxtOptn = this.mUtilities.existInJSON(itemOption, '"next"');
    if (exstNxtOptn) {
      let strNext = '' + itemOption.page.next;
      this.nextView = (strNext.includes('.') ? parseFloat(strNext) : parseInt(strNext));
      console.warn('***  nextView: ' + this.nextView);
    }
    const itemType = itemOption.response.type;
    console.warn('***  itemType: ' + itemType);
    this.currentParam = itemOption.response.param;
    console.warn('***  currentParam: ' + this.currentParam);
    if (exstNxtOptn) {
      this.previousReagent = this.mUtilities.getPreviousReagentByParam(this.arrayListReagents, this.currentParam);
      console.warn({ previousReagent: this.previousReagent });
      if (this.previousReagent && this.mUtilities.existInJSON(this.previousReagent, '"ChangeOption"')) {
        this.flgClnNxtCndtn = true;
      }
    }
    console.warn('***  flgClnNxtCndtn: ' + this.flgClnNxtCndtn);
    const chngRespValue = this.updateArrayResponses(itemOption.response, false);
    if (chngRespValue) {
      console.log('***  cleanResults()...');
      this.cleanResults();
    }
    if (!this.mUtilities.validateResults(this.mStrResult, this.mHtmlResult)) {
      if (exstNxtOptn) {
        console.log('***  updateReagent()...');
        this.updateReagent(false);
        if (this.mUtilities.existInJSON(itemOption, '"show"')) {
          this.flgShow = itemOption.page.show;
        }
        console.warn('***  flgShow: ' + this.flgShow);
        console.log('***  cleanParameters()...');
        this.cleanParameters();
        console.log('***  showHideCardContent()...');
        this.showHideCardContent(this.flgClnNxtCndtn, false);
      } else {
        console.log('***  updateReagent()...');
        this.updateReagent(false);
      }
      console.log('***  validateTotalReagent()...');
      this.validateTotalReagent();
      //this.bndDisabled = false;
      console.log('***  arrayResponses-length: ' + this.arrayResponses.length);
      this.calculatorIsComplete(false, itemType);
      this.focusAndScrollReagent(false, itemType);
    } else {
      console.warn('***  The results are already available!!');
    }
  }
  /*****  CATCH EVENTS END *****/
  updateArrayResponses(chngResponse: any, clnResp: boolean) {
    console.log('***  updateArrayResponses ***');
    let chngRespValue = false;
    chngResponse = this.mUtilities.chkUpdateResponse(this.mReagent, chngResponse);
    console.warn({ chngResponseChk: chngResponse });
    let strRespValue = chngResponse.value;
    console.warn('***  flgClnNxtCndtn: ' + this.flgClnNxtCndtn + ', clnResp: ' + clnResp);
    if (this.flgClnNxtCndtn) {
      console.warn('***  mIndexItems: ' + this.mIndexItems + ', currentParam: ' + this.currentParam);
      console.log('***  updateArrayResponsesExcludingParameters()...');
      this.updateArrayResponsesExcludingParameters();
      console.warn('***  indxClnNxt: ' + this.indxClnNxt);
      if (this.indxClnNxt > 0 || this.arrayIndexClnNxt.length > 0) {
        chngRespValue = true;
      }
    }
    let count = 0;
    let indxResp = -1;
    let bndContinue = true;
    let arryRespLngth = this.arrayResponses.length;
    console.warn('***  chngRespValue: ' + chngRespValue + ', arryRespLngth: ' + arryRespLngth);
    //console.log({arrayResponses: this.arrayResponses});
    this.arrayResponses.forEach((resp) => {
      if (chngResponse.param && resp.param.toString() === chngResponse.param.toString() && strRespValue) {
        bndContinue = false;
        chngRespValue = true;
        console.warn({ udpResponse: chngResponse });
        indxResp = count;
        console.log('***  updateArrayResponses-One[' + indxResp + ']...');
        this.arrayResponses[indxResp] = chngResponse;
      } else if (chngResponse.param && resp.param.toString() === chngResponse.param.toString()) {
        chngRespValue = true;
        indxResp = count;
      }
      count++;
    });
    if (!this.mReagent) {
      console.warn('***  currentParam: ' + this.currentParam);
      this.mReagent = this.mUtilities.getPreviousReagentByParam(this.arrayListReagents, this.currentParam);
      console.warn({ mReagent: this.mReagent });
    }
    console.warn('***  bndContinue: ' + bndContinue + ', chngRespValue: ' + chngRespValue);
    if (bndContinue) {
      if (chngResponse.param && strRespValue) {
        console.warn({ chngResponse: chngResponse });
        console.log('***  arrayResponses.push()...');
        this.arrayResponses.push(chngResponse);
        //console.warn({arrayResponses: this.arrayResponses});
      } else if (chngRespValue) {
        if (strRespValue) {
          console.log('***  updateArrayResponsesExcludingParameters()...');
          this.updateArrayResponsesExcludingParameters();
        } else {
          console.warn('***  currentParam: ' + this.currentParam);
          const crntReagent = this.mUtilities.getPreviousReagentByParam(this.arrayListReagents, this.currentParam);
          console.warn({ crntReagent: crntReagent });
          if (crntReagent.Items && crntReagent.Items.length == 1) {
            if (this.mUtilities.existParamInResponses(this.arrayResponses, chngResponse.param.toString())) {
              console.log('***  updateArrayResponses-Two[' + indxResp + ']...');
              this.arrayResponses[indxResp] = chngResponse;
            }
          } else {
            console.log('***  TODO: Validate case...');
          }
        }
      }
    } else if (chngRespValue && this.mReagent && this.mReagent.Type != 'Range' && this.mIndexItems == 0 && indxResp >= 0) {
      console.log('***  updateArrayResponsesExcludingParameters()...');
      this.updateArrayResponsesExcludingParameters();
      if (this.mUtilities.existParamInResponses(this.arrayResponses, chngResponse.param.toString())) {
        console.log('***  updateArrayResponses-Two[' + indxResp + ']...');
        this.arrayResponses[indxResp] = chngResponse;
      } else {
        console.log('***  arrayResponses.push()...');
        this.arrayResponses.push(chngResponse);
      }
    } else if (this.mIndexItems > 0 && indxResp >= 0) {
      let strParamsCln2: string = '';
      let count2 = 0;
      this.arrayResponses.forEach((resp2) => {
        if (count2 > indxResp) {
          if (strParamsCln2) {
            strParamsCln2 += ',' + resp2.param;
          } else {
            strParamsCln2 = resp2.param;
          }
        }
        count2++;
      });
      console.warn('***  strParamsCln2: ' + strParamsCln2);
      if (strParamsCln2) {
        console.log('***  arrayResponses-length: ' + this.arrayResponses.length);
        const newArrayRespExcl = this.mUtilities.getArrayResponsesExcludingParameters(this.arrayResponses, strParamsCln2);
        if (newArrayRespExcl.length < this.arrayResponses.length) {
          this.flgClnParams = true;
        }
        this.arrayResponses = [];
        this.arrayResponses = newArrayRespExcl;
      }
    }
    console.log({ arrayResponses: this.arrayResponses });
    console.warn('***  chngRespValue: ' + chngRespValue);
    return chngRespValue;
  }

  updateArrayResponsesExcludingParameters() {
    let strParamsCln = this.mUtilities.getArrayExcludingParameters(this.arrayListReagents, this.currentParam, this.currentValue);
    console.warn('***  strParamsCln: ' + strParamsCln);
    if (strParamsCln && strParamsCln.includes('|')) {
      console.log({ mReagent: this.mReagent });
      console.warn('***  nextView: ' + this.nextView);
      let prevIndxNxt: any;
      if (this.previousReagent && this.mUtilities.existInJSON(this.previousReagent, '"NextCondition"')) {
        prevIndxNxt = this.previousReagent.NextCondition;
        this.indxClnNxt = this.mUtilities.getIndexCleanNext(strParamsCln, this.currentParam, this.nextView, prevIndxNxt);
        console.warn('***  indxClnNxt: ' + this.indxClnNxt);
      } else if (this.previousReagent && !this.mUtilities.existInJSON(this.previousReagent, '"Next"') && this.mUtilities.existInJSON(this.previousReagent, '"ChangeOption"')) {
        this.arrayIndexClnNxt = this.mUtilities.getArrayIndexCleanNext(strParamsCln, this.currentParam, this.nextView);
        console.warn({ arrayIndexClnNxt: this.arrayIndexClnNxt });
      }
      console.warn('***  strParamsCln: ' + strParamsCln + ', currentParam: ' + this.currentParam);
      let excludeClnParam = this.mUtilities.getExcludeClnParamInResponses(this.arrayResponses, strParamsCln, this.currentParam);
      console.log('***  excludeClnParam: ' + excludeClnParam);
      if (excludeClnParam && this.mUtilities.existParamInResponses(this.arrayResponses, excludeClnParam)) {
        this.flgDecrease = true;
      }
      console.warn('***  flgDecrease: ' + this.flgDecrease);
      const newArryRespExcl = this.mUtilities.getArrayResponsesExcludingParameters(this.arrayResponses, strParamsCln);
      if (newArryRespExcl.length < this.arrayResponses.length) {
        this.flgClnParams = true;
      }
      this.arrayResponses = [];
      this.arrayResponses = newArryRespExcl;
    }
  }

  getResult() {
    console.log('***  getResult ***');
    this.setResponses();
    console.warn('***  flgFunction: ' + this.flgFunction);
    this.showResult = true;
    if (this.flgFocusResult) {
      setTimeout(() => {
        console.warn({ noteResult: this.noteResultElement });
        if (this.noteResultElement) {
          console.warn('***  noteResultElement.setFocus()...');
          this.noteResultElement.setFocus();
        }
      }, this.timeoutFocusResult);
    }
    this.titleResults = this.dataResults.Title;
    if (this.flgFunction) {
      this.getResultFromCalculatorBusinessLogic();
    } else {
      let resultFromTR: any;
      if (this.mFScore) {
        resultFromTR = this.mUtilities.getResultFromTableResults(this.arrayResponses, this.dataResults, this.tableResults, this.mStrCase, this.flgScore, this.mFScore);
      } else {
        resultFromTR = this.mUtilities.getResultFromTableResults(this.arrayResponses, this.dataResults, this.tableResults, this.mStrCase, this.flgScore, this.mScore);
      }
      console.warn({ result: resultFromTR });
      if (resultFromTR) {
        if (this.mUtilities.existInJSON(resultFromTR, 'title') && resultFromTR.title) {
          this.titleResults = resultFromTR.title;
        }
        this.mStrResult = resultFromTR.result;
        this.mObservation = resultFromTR.observation;
      }
      if (this.mStrResult && this.mUtilities.validateStringIncludes(this.mStrResult, this.mUtilities.getArrayElementsHTML())) {
        this.mHtmlResult = this.sanitizer.bypassSecurityTrustHtml(this.mStrResult);
        console.log('***  mHtmlResult: ' + this.mHtmlResult);
        this.mStrResult = '';
      }
    }
  }

  setResponses() {
    console.log('***  setResponses()  ***');
    console.log('***  arrayResponses-length: ' + this.arrayResponses.length);
    let flgItemScore = this.mUtilities.validateItemScore(this.arrayResponses);
    let flgScoreDecimal = false;
    if (this.mUtilities.validateScoreDecimal(this.arrayResponses)) {
      flgScoreDecimal = true;
      this.mFScore = 0.0;
    } else if (this.mUtilities.validateScoreInteger(this.arrayResponses)) {
      this.mScore = 0;
    }
    console.warn('*** flgItemScore: ' + flgItemScore);
    console.warn({ crrntRgnt: this.mReagent });
    console.warn('***  mStrCase: ' + this.mStrCase);
    this.arrayResponses.forEach((itemResp) => {
      if (flgItemScore && (this.mUtilities.existInJSON(itemResp, 'score') || this.mUtilities.existInJSON(itemResp, 'value'))) {
        let strValue = itemResp.value;
        let strScore = itemResp.score;
        console.warn('***  strScore: ' + strScore + ', strValue: ' + strValue);
        const crrntValue = (strScore ? '' + strScore : '' + strValue);
        console.warn('***  crrntValue: ' + crrntValue);
        if (flgScoreDecimal) {
          const valueFScore = (crrntValue ? this.mFScore + parseFloat(crrntValue) : this.mFScore);
          console.log('***  valueFScore: ' + valueFScore);
          let strValue = '' + valueFScore;
          let arryStrValue = strValue.split('.');
          if (arryStrValue && ('' + arryStrValue[1]).length > 1) {
            let vluNumber = Number(strValue);
            let rndNum: any;
            rndNum = this.mUtilities.roundNumberIntl(vluNumber, 1);
            //console.log('***  rndNum: ' + rndNum);
            if (rndNum && isNaN(rndNum)) {
              this.mFScore = rndNum;
            } else if (rndNum) {
              let rndNumber = Number(rndNum);
              //console.log('***  rndNumber: ' + rndNumber);
              this.mFScore = parseFloat(rndNumber.toString());
            }
          } else {
            this.mFScore = valueFScore;
          }
          //console.warn('***  mFScore: ' + this.mFScore);
        } else if (crrntValue) {
          const valueScore = parseInt(crrntValue);
          this.mScore += valueScore;
          //console.warn('***  mScore: ' + this.mScore);
        }
      } else if (!flgItemScore) {
        console.warn({ crrntResp: itemResp });
        this.mStrCase += this.mUtilities.getStrCase(this.mReagent, itemResp);
      }
    });
    console.warn('***  mScore: ' + this.mScore);
    console.warn('***  mFScore: ' + this.mFScore);
    console.warn('***  mStrCase: ' + this.mStrCase);
  }

  getResultFromCalculatorBusinessLogic() {
    //console.log('***  getResultFromCalculatorBusinessLogic  ***');
    let jsonParams = this.mUtilities.getParamsJSON(this.arrayResponses);
    console.log({ params: jsonParams });
    console.log('***  jsonParams: ' + JSON.stringify(jsonParams));
    let strMethod = this.mCalculatorData.Function.CalculatorCode;
    console.log('***  strMethod: ' + strMethod);
    this.mHtmlResult = this.sanitizer.bypassSecurityTrustHtml(calculatorBusinessLogicObject.getCalculatorResult(strMethod, jsonParams));
    console.log('***  mHtmlResult: ' + this.mHtmlResult);
  }

  async getCalculatorData(item: any) {
    console.log('***  getCalculatorData item: ' + JSON.stringify(item));
    console.log('***  getCalculatorData item: ', item.FileName);
    console.log('***  getCalculatorData item: ', item.BaseUrl);    
    //await this.controllersIonicService.showLoader().finally(() => {
    //this.calculatorsDynamicService.getJsonDataFromHttpClient(item.FileName, item.BaseUrl)
    this.calculatorsDynamicService.getJsonLocalDataFromHttpClient(item.FileName)//LOCAL
      .then((result: any) => {
        console.warn(' getCalculatorData RESULT',result);
        this.mCalculatorData = this.calculatorsDynamicService.getCalculatorDetail();
        console.log("***  currentData: " + JSON.stringify(this.mCalculatorData));
      })
      .catch(ex => {
        console.error(ex);
        this.exception.next(true);
      })
      .finally(() => {
        console.warn('Complete getJsonDataFromService...');
        this.controllersIonicService.hideLoader();
        if (this.mCalculatorData) {
          this.successRequest.next(true);
          this.exception.next(false);
          this.initData();
        } else {
          this.successRequest.next(false);
          this.exception.next(true);
        }
      });
   // });
  }

  updateReagent(finalOption: boolean) {
    console.log('***  updateReagent  ***');
    let existIndex = false;
    if (this.mIndexItems) {
      existIndex = true;
    }
    console.warn('***  existIndex: ' + existIndex);
    console.warn({ mReagent: this.mReagent });
    console.warn('***  finalOption: ' + finalOption + ', updPrevious: ' + this.updPrevious);
    if (this.updPrevious) {
      this.updPrevious = false;
      this.previousReagent = this.mUtilities.getPreviousReagentByParam(this.arrayListReagents, this.currentParam);
      console.warn({ previousReagent: this.previousReagent });
    }
    console.warn('***  mIndexItems: ' + this.mIndexItems);
    if (finalOption && this.mIndexItems == 0 && this.nextView <= 1) {
      console.warn('***  finalOption: ' + finalOption);
      this.mReagent = this.arrayListReagents[0][0];
      console.warn({ udpRgnt: this.mReagent });
    } else {
      this.mStrCase = '';
      let indxLR = 0;
      this.arrayListReagents.forEach((lstReagents) => {
        this.arrayCardContent.forEach((itemC:any) => {
          const crntCard = itemC;
          const cardRgnt = crntCard.reagent;
          lstReagents.forEach((reagent) => {
            if (existIndex && this.mIndexItems == indxLR && this.nextView > 0
              && this.nextView == reagent.NoReagent && reagent.NoReagent === cardRgnt.NoReagent) {
              console.warn('***  cardNoReagent-One: ' + cardRgnt.NoReagent);
              console.log({ cardRgnt: cardRgnt });
              if (!finalOption) {
                console.warn('***  isReset-One: ' + this.isReset);
                if (!this.isReset) {
                  this.mReagent = reagent;
                  console.warn({ udpRgnt: this.mReagent });
                }
              }
            } else if (!existIndex && this.nextView > 0
              && this.nextView == reagent.NoReagent && reagent.NoReagent == cardRgnt.NoReagent) {
              console.warn('***  cardNoReagent-Two: ' + cardRgnt.NoReagent);
              console.log({ cardRgnt: cardRgnt });
              if (!finalOption) {
                console.warn('***  isReset-Two: ' + this.isReset);
                if (!this.isReset) {
                  this.mReagent = reagent;
                  console.warn({ udpRgnt: this.mReagent });
                }
              }
            }
          });
        });
        indxLR++;
      });
    }
  }

  focusCurrentReagent(nextReagent: any) {
    console.log('***  focusCurrentReagent  ***');
    console.warn('***  mIndexItems: ' + this.mIndexItems);
    if (nextReagent) {
      console.warn({ nextReagent: nextReagent });
      this.mStrCase = '';
      let indxLR = 0;
      this.arrayListReagents.forEach((lstReagents) => {
        this.arrayCardContent.forEach((itemC:any) => {
          const crntCard = itemC;
          const cardRgnt = crntCard.reagent;
          for (let indxR = 0; indxR < lstReagents.length; indxR++) {
            const reagent = lstReagents[indxR];
            if (this.mIndexItems == indxLR && nextReagent.NoReagent == reagent.NoReagent && reagent.NoReagent === cardRgnt.NoReagent) {
              console.log({ cardRgnt: cardRgnt });
              setTimeout(() => {
                console.warn('***  crntCard.setFocusReagent()...');
                crntCard.setFocusReagent();
              }, 150);
              break;
            }
          }
        });
        indxLR++;
      });
    }
  }

  focusAndScrollReagent(finalOption: boolean, itemType: any) {
    console.log('***  focusAndScrollReagent  ***');
    console.warn('***  finalOption: ' + finalOption + ', mIndexItems: ' + this.mIndexItems);
    if (!finalOption && !this.completeCalculator) {
      console.log({ crrntReagent: this.mReagent });
      console.warn('***  isReset-Two: ' + this.isReset + ', flgFocusNext-Two: ' + this.flgFocusNext);
      this.mStrCase = '';
      let indxLR = 0;
      this.arrayListReagents.forEach((lstReagents) => {
        this.arrayCardContent.forEach((itemC:any) => {
          const crntCard = itemC;
          const cardRgnt = crntCard.reagent;
          lstReagents.forEach((reagent) => {
            if (this.mIndexItems == indxLR && this.mReagent.NoReagent == reagent.NoReagent && reagent.NoReagent === cardRgnt.NoReagent) {
              console.log({ cardRgnt: cardRgnt });
              if (!finalOption) {
                this.flgFocusNext = true;
                console.warn('***  isReset: ' + this.isReset);
                if (!this.isReset && this.mUtilities.existInJSON(this.mReagent, '"Focus"')) {
                  this.flgFocusNext = this.mReagent.Focus;
                }
                console.warn('***  flgFocusNext: ' + this.flgFocusNext + ', flgFocusResult: ' + this.flgFocusResult);
                setTimeout(() => {
                  if (!this.isReset && this.flgFocusNext) {
                    if (this.flgFocusResult) {
                      if (itemType && itemType != 'Input' && this.mReagent && this.mReagent.Type === 'Input') {
                        console.warn('***  mReagent-Type: ' + this.mReagent.Type + ', itemType: ' + itemType);
                        console.warn('***  crntCard.setFocusReagent()...');
                        crntCard.setFocusReagent();
                      }
                      this.setFocusAndScrollAppReagent();
                    }
                  } else {
                    if (indxLR == this.arrayListReagents.length) {
                      this.isReset = false;
                    } else {
                      console.log('***  indxLR: ' + indxLR);
                    }
                  }
                }, 150);
              }
            }
          });
        });
        indxLR++;
      });
    }
  }

  setFocusInitElement() {
    console.warn('***  setFocusInitElement  ***');
    setTimeout(() => {
      console.warn({ noteInit: this.noteInitElement });
      console.warn('***  noteInitElement.setFocus()...');
      this.noteInitElement.setFocus();
    }, this.timeoutFocus);
  }

  setFocusAndScrollAppReagent() {
    const currentAppReagent = document.getElementById("appReagent" + this.mIndexItems + '' + this.mReagent.NoReagent);
    if (currentAppReagent) {
      console.warn({ attributeNames: currentAppReagent.getAttributeNames() });
      setTimeout(() => {
        console.warn('***  currentAppReagent.scrollIntoView()...');
        currentAppReagent.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'center'
        });
      }, this.timeoutFocus);
    }
  }

  showHideCardContent(clnParams: boolean, fnlOption: boolean) {
    console.log('***  showHideCardContent  ***');
    console.warn("***  arrayCardContent-length: " + this.arrayCardContent.length);
    console.warn("***  arrayListReagents-length: " + this.arrayListReagents.length);
    console.log({ arryLstRgnts: this.arrayListReagents });
    console.warn("***  flgShow: " + this.flgShow);
    console.log("***  mIndexItems: " + this.mIndexItems + ", nextView: " + this.nextView);
    let arrayStrNext = '';
    let crrntCrdNoRgnt: any;
    let indxLR = 0;
    this.arrayListReagents.forEach((lstReagents) => {
      this.arrayCardContent.forEach((itemC:any) => {
        const crntCard = itemC;
        const cardRgnt = crntCard.reagent;
        lstReagents.forEach((reagent) => {
          if (this.mIndexItems == indxLR && this.nextView > 0
            && this.nextView == reagent.NoReagent && reagent.NoReagent == cardRgnt.NoReagent) {
            //console.log("***  CASE ONE  ***");
            console.warn({ crntRgnt: this.mReagent });
            if (this.mUtilities.existInJSON(this.mReagent, '"Next"')) {
              const oneStrNext = '' + this.mReagent.Next;
              console.log("***  one-updateArrayNext()...");
              arrayStrNext = this.mUtilities.updateArrayNext(arrayStrNext, oneStrNext);
            }
            console.warn("***  one: maxIndxItems: " + this.maxIndxItems + ', arrayStrNext: ' + arrayStrNext);
            if (this.flgShow) {
              console.warn({ oneCard: cardRgnt });
              crntCard.showReagent();
              if (this.mUtilities.existInJSON(cardRgnt, '"Disabled"')) {
                crrntCrdNoRgnt = cardRgnt.NoReagent;
                console.warn("***  one-crrntCrdNoRgnt: " + crrntCrdNoRgnt);
                console.log("***  one-fnlOption: " + fnlOption);
                this.flgClnParams = fnlOption;
                console.log("***  one-flgClnParams: " + this.flgClnParams);
              }
            } else if (this.maxIndxItems > 0 && indxLR > 0 || (indxLR == 0 && crntCard.reagent.NoReagent > 1)) {
              console.warn({ oneCard: cardRgnt });
              this.getDecreaseTotal(crntCard, cardRgnt);
              if (this.mUtilities.existInJSON(cardRgnt, '"Disabled"')) {
                console.log("***  one-crntCard.hideReagent()...");
                crntCard.hideReagent();
              }
            }
          } else if (this.nextView > 0 && this.maxIndxItems > 0 && this.mIndexItems == reagent.Index) {
            //console.log("***  CASE TWO  ***");
            const twoNoRgnt = '' + reagent.NoReagent;
            if (this.mUtilities.existParamInResponses(this.arrayResponses, reagent.Param) || (arrayStrNext && arrayStrNext.includes(twoNoRgnt))) {
              if (arrayStrNext && this.mUtilities.existInJSON(reagent, '"Next"')) {
                const twoStrNext = '' + reagent.Next;
                console.log("***  two-updateArrayNext()...");
                arrayStrNext = this.mUtilities.updateArrayNext(arrayStrNext, twoStrNext);
                console.warn("***  two-arrayStrNext: " + arrayStrNext);
              }
              crntCard.showReagent();
            } else {
              console.log({ twoCard: crntCard.reagent });
            }
          }
        });
      });
      indxLR++;
    });
    console.warn("***  chngIndex: " + this.chngIndex + ', clnParams: ' + clnParams);
    if (this.chngIndex || clnParams) {
      console.log("***  arrayStrNext: " + arrayStrNext);
      console.warn("***  flgClnParams: " + this.flgClnParams);
      if (this.flgClnParams || (this.arrayIndexClnNxt && this.arrayIndexClnNxt.length > 0)) {
        this.flgClnParams = false;
        let flgHideCard = false;
        if (clnParams) {
          flgHideCard = true;
        }
        console.log("***  one-cleanParametersFromResponses()...");
        this.cleanParametersFromResponses(flgHideCard);
        console.warn("***  one-showStateCardContent()...");
        this.showStateCardContent(crrntCrdNoRgnt, arrayStrNext);
      } else {
        console.warn("***  two-showStateCardContent()...");
        this.showStateCardContent(crrntCrdNoRgnt, arrayStrNext);
      }
    }
  }

  showStateCardContent(crrntCrdNoRgnt: any, arrayNext: string) {
    //console.warn("***  mIndexItems: "+ this.mIndexItems +", hideCard: "+ hideCard);
    console.log("***  previousIndex: " + this.previousIndex);
    let indxLR = 0;
    console.warn({ arrayResponses: this.arrayResponses });
    console.warn("***  crrntCrdNoRgnt: " + crrntCrdNoRgnt + ', arrayNext: ' + arrayNext);
    console.warn('***  indxClnNxt: ' + this.indxClnNxt);
    this.arrayListReagents.forEach((lstReagents) => {
      this.arrayCardContent.forEach((itemC:any) => {
        const crntCard = itemC;
        const cardRgnt = crntCard.reagent;
        if (this.mIndexItems != indxLR) {
          console.warn('***  showStateCard-One  ***');
          lstReagents.forEach((reagent2) => {
            if (!crrntCrdNoRgnt && indxLR == this.previousIndex && reagent2.NoReagent == cardRgnt.NoReagent
              && (!arrayNext || (arrayNext && !arrayNext.includes(cardRgnt.NoReagent)))) {
              console.warn('***  showStateCard-1.1  ***');
              if (!this.mUtilities.existParamInResponses(this.arrayResponses, reagent2.Param)) {
                crntCard.resetParams();
                crntCard.hideReagent();
              }
            } else if (!crrntCrdNoRgnt && reagent2.NoReagent == cardRgnt.NoReagent
              && (!arrayNext || (arrayNext && !arrayNext.includes(cardRgnt.NoReagent)))) {
              console.warn('***  showStateCard-1.2  ***');
              if (this.mUtilities.existInJSON(reagent2, '"Disabled"')) {
                console.log({ cardDisable: cardRgnt });
                if (reagent2.Disabled) {
                  console.warn({ crntHideCard: crntCard.reagent });
                  crntCard.resetParams();
                  crntCard.hideReagent();
                } else {
                  crntCard.getSateReagent();
                }
              }
            } else if (!crrntCrdNoRgnt && reagent2.NoReagent == cardRgnt.NoReagent
              && (arrayNext && arrayNext.includes(cardRgnt.NoReagent))) {
              console.warn('***  showStateCard-1.3  ***');
              if (this.mUtilities.existInJSON(cardRgnt, '"Next"')) {
                const strNext = '' + cardRgnt.Next;
                console.log("***  updateArrayNext()...");
                arrayNext = this.mUtilities.updateArrayNext(arrayNext, strNext);
              }
            }
          });
        }
      });
      indxLR++;
    });
  }

  getDecreaseTotal(crntCard: any, cardRgnt: any) {
    console.log('***  getDecreaseTotal  ***');
    if (crntCard && cardRgnt) {
      if (this.mUtilities.existInJSON(cardRgnt, '"Disabled"') && cardRgnt.Disabled) {
        const showReagent = crntCard.flgShowReagent;
        console.warn('***  one-NoReagent: ' + cardRgnt.NoReagent + ', showReagent: ' + showReagent + ', indxClnNxt: ' + this.indxClnNxt);
        if (this.indxClnNxt && cardRgnt.NoReagent == this.indxClnNxt && this.mUtilities.existInJSON(cardRgnt, '"IncreaseTotal"')
          && (this.flgDecrease || showReagent)) {
          console.warn('*** one-flgDecrease: ' + this.flgDecrease + ', showReagent: ' + showReagent);
          this.increaseTotal = (parseInt(cardRgnt.IncreaseTotal + '') * -1);
          console.warn('***  one-decreaseTotal: ' + this.increaseTotal);
        }
      }
    }
  }

  validateTotalReagent() {
    console.warn('***  sumAllReactants: ' + this.sumAllReactants);
    //console.log('***  increaseTotal: ' + this.increaseTotal);
    if (this.flgShow && this.mReagent
      && this.mUtilities.existInJSON(this.mReagent, '"IncreaseTotal"')
      && this.mUtilities.existInJSON(this.mReagent, '"Disabled"')) {
      this.increaseTotal = parseInt(this.mReagent.IncreaseTotal + '');
    }
    console.log('***  totalReagents: ' + this.totalReagents);
    this.newTotalReagents = this.totalReagents;
    console.log({ mReagent: this.mReagent });
    console.log({ previousRgnt: this.previousReagent });
    //console.log('***  incTotal: ' + this.incTotal);
    console.warn('***  flgChngNext: ' + this.flgChngNext + ', increaseTotal: ' + this.increaseTotal);
    if ((this.flgChngNext && this.increaseTotal > 0) || (this.increaseTotal < 0)) {
      this.increaseAccumulated += this.increaseTotal;
    }
    console.log('***  increaseAccumulated: ' + this.increaseAccumulated);
    console.log('***  newTotalReagents: ' + this.newTotalReagents);
    if (this.increaseAccumulated != 0) {
      this.newTotalReagents += this.increaseAccumulated;
    }
    this.sumAllReactants = this.newTotalReagents;
    console.warn('***  sumAllReactants: ' + this.sumAllReactants);
  }

  calculatorIsComplete(finalOption: boolean, itemType: any) {
    console.log('***  calculatorIsComplete  ***');
    console.log('***  arrayResponses: ' + this.arrayResponses.length);
    console.log('***  sumAllReactants: ' + this.sumAllReactants);
    if (this.arrayResponses.length >= this.sumAllReactants) {
      this.completeCalculator = true;
    } else {
      this.showResult = false;
      this.completeCalculator = false;
    }
    console.warn('***  showAutoResult: ' + this.showAutoResult);
    console.warn('***  completeCalculator: ' + this.completeCalculator + ', flgShowCalBttn: ' + this.flgShowCalBttn);
    if (this.showAutoResult && (finalOption || (!this.flgShowCalBttn && this.completeCalculator)
      || (this.completeCalculator && itemType && itemType != 'Input' && itemType != 'Check'))) {
      this.getResult();
    }
  }

  cleanResults() {
    this.showResult = false;
    if (this.mStrResult) {
      this.mStrResult = this.mHtmlResult;
    } else if (this.mHtmlResult) {
      this.mHtmlResult = this.mStrResult;
    }
  }

  resetCalculator() {
    console.log('***  resetCalculator  ***');
    console.log('***  cleanResults()...');
    this.cleanResults();
    this.nextView = 0;
    this.mIndexItems = 0;
    this.previousIndex = 0;
    console.warn('***  totalReagents: ' + this.totalReagents);
    this.newTotalReagents = this.totalReagents;
    this.mStrCase = '';
    if (this.mScore) {
      this.mScore = this.mFScore;
    } else {
      this.mFScore = this.mScore;
    }
    this.increaseTotal = 0;
    this.increaseAccumulated = 0;
    this.arrayInc = [];
    this.arrayResponses = [];
    this.sumAllReactants = this.totalReagents;
    this.cleanAllParameters();
    this.mReagent = this.arrayListReagents[0][0];
    console.warn({ reagent: this.mReagent });
    this.isReset = true;
    this.setFocusInitElement();
    this.isEnabledCalcular = false;
    this.calculatorIsComplete(false, '');
  }

  finishView() {
    console.log('***  finishView  ***');
    this.navCtrl.back();
  }

  segmentChanged(event: any) {
    this.valueSelected = event.detail.value;
  }


  getInfomationByTypeDeeplink(id: any) {
    this.exception.next(false);
    this.controllersIonicService.showLoader().finally(() => {
      this.getInformationSub = this.plmAssetsEngineService
        .getElectronicInformationByIdDeepLink(id)
        .subscribe({
          next: (calculator: any) => {
            if (calculator) {
              console.log({ calculator: calculator });
              let itemCal = calculator;
              console.log({ item: itemCal });
              this.getCalculatorData(itemCal);
              this.addTrackingActivity(itemCal);
              this.trackingFATitle(itemCal.ElectronicTitle);
              this.electronicId=id;
              this.showBanner$.next(true);
              console.log('ElectronicId ', this.electronicId);

              this.successRequest.next(true);
              this.exception.next(false);
            } else{
              this.successRequest.next(false);
              this.exception.next(true);
            }
          },
          error: () => {
            this.controllersIonicService.hideLoader().finally(() => {
              this.exception.next(true);
            });
          },
          complete: () => {
             this.controllersIonicService.hideLoader().finally(() => {
              this.controllersIonicService.hideLoader();
            });
          },
        });
    });
  }

  addTrackingActivity(electronicInformation: any) {
    console.log('addTrackingActivity - electronicInformation',electronicInformation );
    const today = new Date().getTime();
    let latitude = '';
    let longitude = '';
    let ip: '';
    const clientPosition = this.globalVarsService.getGeolocationClient();
    const clientAddress = this.globalVarsService.getClientAddressIp();
    if (clientPosition) {
      latitude = clientPosition.latitude.toString();
      longitude = clientPosition.longitude.toString();
    }
    if (clientAddress) {
      ip = clientAddress.ip;
    }
      const data: IInfoTracking = {
        BranchId: null,
        CodeString: this.globalVarsService.getClientInfoValue().codeString,
        Date: '\/Date(' + today.toString() + '+0200)\/',
        ElectronicId: electronicInformation.ElectronicId,
        EntityId: InfoEntities.Calculator,
        EventId: null,
        Label: 'Calculadora - Deeplink',
        LabelValue: electronicInformation.ElectronicTitle,
        SearchAddressIP: null,
        SearchLatitude: latitude,
        SearchLongitude: longitude,
        SearchText: null,
        SearchTypeId: SearchType.parametrizado,
        SourceId: this.globalVarsService.getInfoTrackingSource()
      };
      this.plmTrackingEngineService.addInfoTracking(data);
      console.log('>>>>> DATA CALCULATOR DL <<<<<', data);
  }

  trackingFATitle(title:any ) {
    const titleReplace = title.split(' ').join('_');
    console.log('CalculatorOverview', { title: titleReplace });
    //this.fa.trackingFATitle(titleReplace);
  }


}