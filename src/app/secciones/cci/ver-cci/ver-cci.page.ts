import { Component, AfterViewInit, OnInit, OnDestroy, ViewChildren, QueryList } from "@angular/core";
import { BehaviorSubject, Subject, Subscription } from "rxjs";
import { AlertController, Platform, IonCheckbox } from '@ionic/angular';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { environment } from 'src/environments/environment';
import { 
  ControllersIonicService, 
  PlmTrackingEngineService, 
  GlobalvarsService, 
  SocialService, 
  PlmClientsEngineService, 
  PlmAssetsEngineService 
} from "src/app/services/indexServices"
import { AnswersClinicalCases } from 'src/app/interfaces/answersClinicalCases';
import { ElectronicInfo } from 'src/app/interfaces/editorialContent';
import { IInfoTracking } from 'src/app/interfaces/PLMTrackingEngine';
import { InfoEntities, SearchType } from 'src/app/interfaces/catalogs';

@Component({
  selector: 'app-ver-cci',
  templateUrl: './ver-cci.page.html',
  styleUrls: ['./ver-cci.page.scss'],
  standalone: false,
})
export class VerCciPage implements OnInit, AfterViewInit, OnDestroy {

  infoDataInput: ElectronicInfo | undefined;
  private modal: HTMLIonModalElement | undefined;
  
  @ViewChildren(IonCheckbox) checkBoxQueryList!: QueryList<IonCheckbox>;
  link: any;
  baseUrl: any;
  name: any;
  title: any;
  electronicId: 0 | undefined;

  logo: any;
  background: any;
  findings: any;
  physicalExplo: any;
  reference: any;
  discussion: any;
  askName: any;
  answers: any;
  answersDes: any;
  authors: any;
  logoFile! : boolean;
  logoImage: any;
  backgroundFile!: boolean;
  backgroundImage: any;
  findingsFile!: boolean;
  findingsImage: any;
  physicalExploFile!: boolean;
  physicalExploImage: any;
  physicalExploData!:boolean; 
  discussionFile: any;
  answersPercents: boolean = false;
  //clinicalCaseImage: string;

  finalAns: any;
  scoreAnswer: [] = [];
  numberTrueTotal:any;
  percentNumber:any;
  percentFinal: any = [];
  percentChoise: boolean = false;
  
  msgError!: string;
  textArea = false;
  isenabled!: boolean;
  checkBoxs!: any[];
  indiceSelected!: number;
  //sponsorBrand: any;

  showBanner$ = new BehaviorSubject(false);
  successRequest = new BehaviorSubject<boolean>(false);
  exception = new BehaviorSubject<boolean>(false);
  getInformationSub!: Subscription;
  subCheckBoxChange!: Subscription;
  subQueryParams!: Subscription;
  clinicalCasePageSubscriptions!: Subscription;
  clinicalCaseTitleSubscription!: Subscription;

  constructor(
    private alertController: AlertController,
    //private plt: Platform,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    //private socialService: SocialService,
    private plmClientEngineService: PlmClientsEngineService,
    private plmAssetsEngineService: PlmAssetsEngineService,
    private controllersIonicService: ControllersIonicService,
    private globalVarsService: GlobalvarsService,
    private trackingEngineService: PlmTrackingEngineService,
    //private alertControllerService: AlertControllerService,
    ) {
      this.getParams();
    }

  async presentAlert() {
    const alert = await this.alertController.create({
      mode: 'ios',
      header: 'Respuesta incorrecta',
      buttons: ['Vuelve a intentarlo'],
      cssClass: 'alertCasosClicos'
    });
    await alert.present();
    const alertElement: any = document.querySelector('ion-alert');
    alertElement.querySelector('.alert-message').innerHTML = '<img src="/assets/images/iconoMedalla.svg" class="imgInsignia mx-auto">';
  }

  ngOnInit() {
  /*const { protocol, server, pathName, pathName2 } = environment.clinicalCase;
  const countryKey = this.globalVarsService.getCountryKey();
  const countryName = this.globalVarsService.getCountryNameByCountryKey(countryKey);
  this.clinicalCaseImage = `${protocol}://${server}/${pathName}/${countryName}/${pathName2}/`
  console.log('ngOnInit clinicalCaseImage', this.clinicalCaseImage);
  console.log("***  ngOnInit()  ***");*/
  }

  ngAfterViewInit(): void {
    this.checkBoxs = this.checkBoxQueryList.toArray();
    this.subCheckBoxChange =
    this.checkBoxQueryList.changes.subscribe( () => {
      this.checkBoxs = this.checkBoxQueryList.toArray();
    });
    
  }
  
  ngOnDestroy(): void {
   // console.log('***  ngOnDestroy  ***');
    if (this.subQueryParams) {
      this.subQueryParams.unsubscribe();
    }
  }


  async getParams() {
    const params: any = this.router.getCurrentNavigation()?.extras.state;
    console.log('>>> Params', params);
    //const deeplink = this.deepLinksService.deeplinkMatch
    //console.log('getParams - deeplink', deeplink);
    this.subQueryParams = this.activatedRoute.queryParams.subscribe(() => {
      if (params.deeplinkId !== undefined) {
        console.log('params.deeplinkId', params.deeplinkId);
        let id = params.deeplinkId;
        this.getInfomationByTypeDeeplink(id);
      } else {
        this.title = params.title;
        this.electronicId = params.electronicid;
        this.showBanner$.next(true);
        if(this.electronicId!==0)
        this.getInteractiveClinicalCaseContent(this.electronicId!);
        //this.successRequest.next(true);
        //this.exception.next(false);
      }

    });
  }

  async getInteractiveClinicalCaseContent(electronicId: number){
    this.exception.next(false);
    await this.controllersIonicService.showLoader().finally(() => {
      this.clinicalCasePageSubscriptions = this.plmAssetsEngineService.getClinicalCaseByIdResult(this.electronicId!).subscribe({
        next: (data: any) => {

          console.warn('********* getAllClinicalCaseContent DATA **********', data);
          
          this.background = data.Background;
          this.findings = data.Findings;
          this.physicalExplo = data.PhysicalExplo;
          this.askName = data.Ask.AskName;
          this.logo = data.Logo.LogoFile;
          this.answers = data.Answers;
          console.log('ANSWERS DATA', this.answers);

          this.discussion = data.Discussion;
          this.discussionFile = data.DiscussionFile;
          this.reference = data.Reference;
          this.authors = data.Authors;

          //this.scoreAnswer = data.Answers.map(({NumberTrue}) => NumberTrue);
          this.scoreAnswer = data.Answers.map(({NumberTrue}: {NumberTrue: number}) => NumberTrue);

          this.numberTrueTotal  = this.scoreAnswer.reduce((total, item) => {
            return total + item;
          }, 0);

          if(this.numberTrueTotal < 1 || this.numberTrueTotal === undefined){
            this.answersPercents = false;
          } else {
            this.answersPercents = true
          }

          console.log('numberTrueTotal----->', this.numberTrueTotal );
       
          let index=0;
          this.scoreAnswer.forEach((score)=> {  
            this.percentNumber = ((score * 100) / this.numberTrueTotal).toFixed(1);
            this.answers[index].NumberTrue = this.percentNumber;
            index++;
          });


          if ( data.Logo.LogoFile === null || data.Logo.LogoFile === '' ){
            this.logoFile = false;
          } else {
            this.logoFile = true;
            this.logoImage = environment.clinicalCase + data.Logo.LogoFile;
          };

          if ( data.BackgroundFile === null || data.BackgroundFile === '' ){
            this.backgroundFile = false;
          } else {
            this.backgroundFile = true;
            this.backgroundImage = environment.clinicalCase + data.BackgroundFile;
          };

          if ( data.PhysicalExplo === null || data.PhysicalExplo === '' || data.PhysicalExplo === undefined ){
            this.physicalExploData = false;
          } else {
            this.physicalExploData = true;
          }

          if ( data.PhysicalExploFile === null || data.PhysicalExploFile === '' ){
            this.physicalExploFile = false;
          } else {
            this.physicalExploFile = true;
            this.physicalExploImage = environment.clinicalCase + data.PhysicalExploFile;
          };

          if ( data.FindingsFile === null || data.FindingsFile === '' ){
            this.findingsFile = false;
          } else {
            this.findingsFile = true;
            this.findingsImage = environment.clinicalCase + data.FindingsFile;
          };

          this.successRequest.next(true);
        },
        error: () => {
          this.controllersIonicService.hideLoader().finally(() => {
            this.exception.next(true);
          });
        },
        complete: () => {
          this.controllersIonicService.hideLoader();
        },
      });
    });
  }

  selectedComent(index: number) {
    this.indiceSelected = index;
    this.checkBoxs.forEach((item: IonCheckbox, indice: any) => {
      if ( indice !== index ) {
        item.checked = false;
        item.disabled = false;
      } else {
        item.disabled = true;
      }
    });
    this.validationInput();
  }

  validationInput() {
    if ( this.indiceSelected >= 0 && this.textArea === true ) {
      this.isenabled = true;
    } else {
      this.isenabled = false;
    }
  }

  updateSelectedValue(selectedObj: any, AnswerId: number) {
    const objIndex = this.answers.findIndex(((obj: any) => obj.AnswerTrue === selectedObj.AnswerTrue));
    this.answers[objIndex].AnswerId = Number(AnswerId);
    console.log('********** UPDATE SELECT **********',this.answers[objIndex]);
    this.finalAns = this.answers[objIndex];
  }

  answerHandler(event: any, object: any) {
    if (event.target.value !== 'undefined') {
      this .updateSelectedValue(object, event.target.value);
    } 
  }

  sendAnswer(){
    const answerContent = this.finalAns;
    if (answerContent.AnswerTrue === 1){
      const navigationExtras: NavigationExtras = {
        state: {
          discussion: this.discussion,
          discussionFile: this.discussionFile,
          reference: this.reference,
          title: this.title, 
          authors: this.authors,
          logo: this.logo
        }
      };
      console.log('NAVIGATION EXTRAS 1', navigationExtras);
      if( answerContent !== ''){
        this.router.navigate(['/respuesta-correcta'], navigationExtras);
        console.log('NAVIGATION EXTRAS 2', navigationExtras);
      } else {
        console.warn('*********** ANSWER CONTENT VACIO **********');
      }
    } else {
      this.presentAlert()
    }

    const data: AnswersClinicalCases = {
      AnswerId: answerContent.AnswerId,
      AskId: answerContent.AskId
    };
    this.plmClientEngineService.answerClinicalCase(data);
    console.log('*********** SENDED ANSWERS **********', data);
  } 

  showPercentChoises(){
    this.percentChoise = true;
  }

  getInfomationByTypeDeeplink(id: any) {
   // console.log('>>>>> DEEPLINK <<<<<');
    this.exception.next(false);
    this.controllersIonicService.showLoader().finally(() => {
      this.getInformationSub = this.plmAssetsEngineService
        .getContentDeeplinkResult(id)
        .subscribe({
          next: (data: any) => {
            console.log('>>>>>>> deeplink  data: ',data);
            console.log('data[1].ElectronicTitle', data[1].ElectronicTitle);
              this.title = data[1].ElectronicTitle;
              
            const electronicId = data.ElectronicId;
            console.log('getInfomationByTypeDeeplink - electronicId', electronicId);
            this.showBanner$.next(true);
            //Content interactive clinical case
              this.background = data[0].Background;
              this.findings = data[0].Findings;
              this.physicalExplo = data[0].PhysicalExplo;
              this.askName = data[0].Ask.AskName;
              this.logo = data[0].Logo.LogoFile;
              this.answers = data[0].Answers;
              this.discussion = data[0].Discussion;
              this.discussionFile = data[0].DiscussionFile;
              this.reference = data[0].Reference;
              this.authors = data[0].Authors;

              //this.scoreAnswer = data[0].Answers.map(({NumberTrue}) => NumberTrue);
              this.scoreAnswer = data.Answers.map(({NumberTrue}: any) => NumberTrue);
              this.numberTrueTotal  = this.scoreAnswer.reduce((total, item) => {
                return total + item;
              }, 0);
              if(this.numberTrueTotal < 1 || this.numberTrueTotal === undefined){
                this.answersPercents = false;
              } else {
                this.answersPercents = true
              }
    
              console.log('numberTrueTotal----->', this.numberTrueTotal );

              let index=0;
              this.scoreAnswer.forEach((score)=> {  
                this.percentNumber = ((score * 100) / this.numberTrueTotal).toFixed(1);
                this.answers[index].NumberTrue = this.percentNumber;
                index++;
              });

              if ( data[0].Logo.LogoFile === null || data[0].Logo.LogoFile === '' ){
                this.logoFile = false;
              } else {
                this.logoFile = true;
                this.logoImage = environment.clinicalCase + data[0].Logo.LogoFile;
              };
    
              if ( data[0].BackgroundFile === null || data[0].BackgroundFile === '' ){
                this.backgroundFile = false;
              } else {
                this.backgroundFile = true;
                this.backgroundImage = environment.clinicalCase + data[0].BackgroundFile;
              };
    
              if ( data[0].PhysicalExploFile === null || data[0].PhysicalExploFile === '' ){
                this.physicalExploFile = false;
              } else {
                this.physicalExploFile = true;
                this.physicalExploImage = environment.clinicalCase + data[0].PhysicalExploFile;
              };
    
              if ( data[0].FindingsFile === null || data[0].FindingsFile === '' ){
                this.findingsFile = false;
              } else {
                this.findingsFile = true;
                this.findingsImage = environment.clinicalCase + data[0].FindingsFile;
              };

              

              this.electronicId = data[1].ElectronicId;
  
            this.successRequest.next(true);

            this.addTrackingActivity(data);
          },
          error: () => {
            this.controllersIonicService.hideLoader().finally(() => {
              this.exception.next(true);
              this.msgError = 'Por el momento, el archivo no se encuentra disponible.';
            });
          },
          complete: () => {
            this.controllersIonicService.hideLoader().finally(() => {
              this.controllersIonicService.hideLoader();
              /*if (this.title) {
                this.successRequest.next(true);
              } else {
                this.successRequest.next(false);
                this.exception.next(true);
                this.msgError = 'Por el momento, el archivo no se encuentra disponible.';
              }*/
            });
          },
        });
    });
  }

  addTrackingActivity(electronicInformation: any) {
    console.log('addTrackingActivity - electronicInformation', electronicInformation);
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
      ElectronicId: electronicInformation[1].ElectronicId,
      EntityId: InfoEntities.CasosClinicosInteractivos,
      EventId: null,
      Label: 'Caso Clinico Interactivo - Deeplink',
      LabelValue: electronicInformation[1].ElectronicTitle,
      SearchAddressIP: null,
      SearchLatitude: latitude,
      SearchLongitude: longitude,
      SearchText: null,
      SearchTypeId: SearchType.parametrizado,
      SourceId: this.globalVarsService.getInfoTrackingSource()
    };
    this.trackingEngineService.addInfoTracking(data);
    console.log('>>>>> DATA CASO CLINICO INTERACTIVO DL <<<<<', data);
  }

  /*async presentAlert() {
    const alert = await this.alertController.create({
      mode: 'ios',
      header: 'Respuesta incorrecta',
      buttons: ['Vuelve a intentarlo'],
      message: `<img src="/assets/images/iconoRespuestaIncorrecta.svg"  class="imgInsignia mx-auto">`,
      cssClass: 'alertCasosClicos'
    });
    await alert.present();
  }*/

}
