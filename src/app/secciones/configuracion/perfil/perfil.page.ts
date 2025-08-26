import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { App, URLOpenListenerEvent } from '@capacitor/app';
import { ISaveMobileLocationAppClient, IUpdateMobileLocationAppClient } from '../../../interfaces/models';
import {
  DataService,
  UserStorageService,
  ControllersIonicService,
  PlmClientsEngineService,
  GlobalvarsService,
  InAppBrowserService,
} from '../../../services/indexServices';
import { BehaviorSubject, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: false,
})
export class PerfilPage implements OnInit, AfterViewInit, OnDestroy {

  profileForm!: FormGroup; // operador de no-nulidad, verificar funcionalidad
  email!: string;
  codestring!: string;
  newPrefix!: boolean;
  newUser: boolean | undefined;
  updateUser: boolean | undefined;
  mParams: any;
  flgCountry: boolean = false;
  flgSpeciality: boolean = false;

  stateByCountrySuccess = new BehaviorSubject<boolean>(false);
  locationsByStateSuccess = new BehaviorSubject<boolean>(false);
  getSpecialitiesSuccess = new BehaviorSubject<boolean>(false);
  getSubspecialitiesSuccess = new BehaviorSubject<boolean>(false);

  loader = new BehaviorSubject<boolean>(true);
  stateByCountryBehaviorSub: Subscription;
  locationsByStateBehaviorSub: Subscription;
  getSpecialitiesBehaviorSub: Subscription;
  getSubspecialitiesBehaviorSub: Subscription;
  SubRegisterAppClientRequest: Subscription;
  subRegisterAppClient: Subscription;
  countryLada: string;
  phoneLada: string;
  countries: any[] = [];
  states: any[] = [];
  locations: any[] = [];
  professions: any[] = [];
  professionsbyparents: any[] = [];
  specialities: any[] = [];
  subspecialities: any[] = [];
  professionbyParent: any;
  showSpecialityLicense: boolean;
  showSpeciality: boolean;
  showsubSpeciality: boolean;
  SubQueryParams: Subscription;
  SubProfessionsRequest: Subscription;
  SubCountriesRequest: Subscription;
  SubClientDetailByEmail: Subscription;
  SubProfessionsByParent: Subscription;
  SubGetSubspecialities: Subscription;
  SubStateByCountryRequest: Subscription;
  SubLocationsByState: Subscription;
  SubUpdateAppClientRequest: Subscription;
  SubValidationMessageRequest: Subscription;
  SubSpecialitiesRequest: Subscription;
  showProfessionalLicence: boolean;
  showTipoProfesional: boolean;
  showLocation: boolean;
  showStates: boolean;
  clientInformationDetailByEmail: any;
  validationMessages: any;

  constructor(
    private assetsData: DataService,
    private userStorageService: UserStorageService,
    private controllersIonicService: ControllersIonicService,
    private plmClientsEngineService: PlmClientsEngineService,
    private globalVarsService: GlobalvarsService,
    private inAppBrowserService: InAppBrowserService,
    private navCtrl: NavController,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.mParams = this.router.getCurrentNavigation()?.extras.state;
    console.warn('Perfil', '**  route.queryParams.subscribe(()...', this.mParams);
    this.SubQueryParams = this.route.queryParams.subscribe(() => {
      this.mParams = (this.mParams ? this.mParams : this.router.getCurrentNavigation()?.extras.state);
      console.log('Perfil - this.mParams', (this.mParams ? JSON.stringify(this.mParams) : 'NULL'));
    });
    const errorMessage = this.assetsData.getValidationMessage().getValue();
    if (errorMessage !== null) {
      this.validationMessages = errorMessage.profile;
    } else {
      this.SubValidationMessageRequest =
        this.assetsData.getValidationMessageRequest()
          .subscribe({
            next: (result: any) => {
              this.validationMessages = result.profile;
            },
            error: (ex: any) => { console.error(ex); },
            complete: () => { console.log('successfully getValidationMessageRequest'); }
          });
    }
    this.getParams();
  }

  ngOnInit(): void {
    this.validation();
  }

  ngAfterViewInit(): void {
    console.warn('Perfil', 'ngAfterViewInit-displayClientDetail()...');
    this.displayClientDetail();
  }

  ngOnDestroy(): void {
    if (this.SubQueryParams) {
      this.SubQueryParams.unsubscribe();
    }
    if (this.SubProfessionsRequest) {
      this.SubProfessionsRequest.unsubscribe();
    }
    if (this.SubClientDetailByEmail) {
      this.SubClientDetailByEmail.unsubscribe();
    }
    if (this.SubGetSubspecialities) {
      this.SubGetSubspecialities.unsubscribe();
    }
    if (this.SubStateByCountryRequest) {
      this.SubStateByCountryRequest.unsubscribe();
    }
    if (this.SubLocationsByState) {
      this.SubLocationsByState.unsubscribe();
    }
    if (this.SubRegisterAppClientRequest) {
      this.SubRegisterAppClientRequest.unsubscribe();
    }
    if (this.subRegisterAppClient) {
      this.subRegisterAppClient.unsubscribe();
    }
    if (this.SubUpdateAppClientRequest) {
      this.SubUpdateAppClientRequest.unsubscribe();
    }
    if (this.SubValidationMessageRequest) {
      this.SubValidationMessageRequest.unsubscribe();
    }
    if (this.SubSpecialitiesRequest) {
      this.SubSpecialitiesRequest.unsubscribe();
    }
  }

  ionViewWillLeave() {
    this.getSpecialitiesUnSubscribe();
    this.getSubspecialitiesUnSubscribe();
    this.getStateByCountryUnSubscribe();
    this.getLocationsByStateUnSubscribe();
    this.ngOnDestroy();
  }

  async validation() {
    this.profileForm = this.formBuilder.group({
      FirstName: ['', Validators.compose([Validators.pattern('[a-zA-ZáéíóúñÁÉÍÓÚÑ ]*'), Validators.minLength(3), Validators.required])],
      LastName: ['', Validators.compose([Validators.pattern('[a-zA-ZáéíóúñÁÉÍÓÚÑ ]*'), Validators.required])],
      SecondLastName: ['', Validators.compose([Validators.pattern('[a-zA-ZáéíóúñÁÉÍÓÚÑ ]*'), Validators.required])],
      Email: ['', Validators.compose([Validators.maxLength(70), Validators.email, Validators.required])],
      Profession: ['', Validators.required],
      ProfessionType: ['', ''],
      ProfessionalLicense: ['', ''],
      Speciality: ['', ''],
      SpecialityProfessionalLicense: ['', ''],
      subSpeciality: ['', ''],
      subSpecialityProfessionalLicense: ['', ''],
      Country: ['', Validators.required],
      State: ['', ''],
      Location: ['', ''],
      Mobile: ['', Validators.compose([Validators.minLength(7), Validators.maxLength(10), Validators.pattern('[0-9]+')])],
      Terms: [false, Validators.requiredTrue],
      Policy: [false, Validators.requiredTrue]
    }, {});
  }

  async getParams() {
    console.warn('Perfil', 'getProfessions()...');
    this.getProfessions();
    console.warn('Perfil', 'getCountries()...');
    this.getCountries();
    console.log('Perfil - getParams');
    let loadPreferenceUserInfo = this.userStorageService.getUserInfo();
    loadPreferenceUserInfo.then(async (info: any) => {
      console.warn('CapacitorPreference', '*** infoo: ', info);
      if (info) {
        console.log('getParams - userInfo - codeString', info.codeString);
        if (info.codeString) {
          console.log('Usuario Registrado');
          console.log('codestring', info.codeString);
          if (info.prefijo === environment.applicationInfo.prefix) {
            console.log('getParamas - prefijo / prefix', info.prefijo, environment.applicationInfo.prefix);
            this.updateUser = true;
            console.log('Update - updateUSer', this.updateUser);
          }
          this.email = info.email;
          console.log('getParams - this.email', this.email);
          this.sameEmail();
        }
      } else {
        console.log('NO HAYY INFORMACION');
        console.log('Usuario No Registrado');
        const params = this.mParams
        console.log('Params', params);
        if (params) {
          this.email = params['mail'];
          if (params['prefix']) {
            this.newUser = true;
            this.newPrefix = true;
          }
          if (params['newUser']) {
            this.newPrefix = true;
            this.newUser = false;
          }
          if (this.SubClientDetailByEmail) {
            this.SubClientDetailByEmail.unsubscribe();
            this.controllersIonicService.hideLoader()
              .finally(() => {
                this.sameEmail();
              });
          } else {
            this.sameEmail();
          }
        }
      }
    }).catch((e) => {
      console.warn('Error al cargar datos desde Preferences:', e);
    });
  }

  sameEmail() {
    console.log('Perfil', '***  sameEmail  ***');
    this.controllersIonicService.hideLoader().finally(() => {
      console.warn('Perfil', 'email: ' + this.email);
      if (this.email !== '') {
        this.getClientInformationDetailByEmail(this.email);
      }
    });
  }

  getClientInformationDetailByEmail(email: string) {
    console.log('getClientInformationDetailByEmail - email', email);
    this.controllersIonicService.hideLoader()
      .finally(() => {
        this.controllersIonicService.showLoader()
          .finally(() => {
            this.SubClientDetailByEmail =
              this.plmClientsEngineService.getClientDetailByEmailRequest(email)
                .subscribe({
                  next: () => {
                    const objResult = this.plmClientsEngineService.getClientDetailByEmail().getValue();
                    console.log('getClientInformationDetailByEmail - objResult', objResult);
                    if (objResult.Email !== undefined) {
                      this.clientInformationDetailByEmail = objResult;
                      console.log('getClientInformationDetailByEmail - clientInformationDetailByEmail', this.clientInformationDetailByEmail);
                      this.userStorageService.userInfo.clientID = this.clientInformationDetailByEmail.ClientId;
                    } else {
                      this.clientInformationDetailByEmail = null;
                    }
                  },
                  error: (ex: any) => {
                    this.controllersIonicService.hideLoader()
                      .finally(() => {
                        console.error(ex);
                      });
                  },
                  complete: () => {
                    console.log('successfully completed getClientDetailByEmailRequest');
                    this.controllersIonicService.hideLoader().finally(() => {
                      this.displayClientDetail();
                    });
                  }
                });
          });
      });
  }

  async displayClientDetail() {
    console.log('---->', this.clientInformationDetailByEmail);
    console.log('Perfil', 'displayClientDetail', '***  updateUser: ' + this.updateUser);
    if (this.updateUser) {
      this.profileForm.controls['Terms'].clearValidators();
      this.profileForm.controls['Policy'].clearValidators();
      this.profileForm.controls['Terms'].updateValueAndValidity();
      this.profileForm.controls['Policy'].updateValueAndValidity();
    }

    if (this.clientInformationDetailByEmail) {
      if (this.clientInformationDetailByEmail.Email !== undefined) {
        this.loader.next(false);
        this.profileForm.controls['FirstName'].setValue(this.clientInformationDetailByEmail.FirstName);
        this.profileForm.controls['LastName'].setValue(this.clientInformationDetailByEmail.LastName);
        this.profileForm.controls['SecondLastName'].setValue(this.clientInformationDetailByEmail.SecondLastName);
        this.profileForm.controls['Email'].setValue(this.email);
        this.profileForm.controls['Email'].disable();
        if (this.clientInformationDetailByEmail.Mobile !== '') {
          const phoneInfo: any[] = this.clientInformationDetailByEmail.Mobile.split('\u0020');
          const phoneNumber: string = phoneInfo.pop();
          const longitud = phoneNumber.length;
          if (longitud >= 7 && longitud <= 10) {
            this.profileForm.controls['Mobile'].setValue(phoneNumber);
          }
        }
        if (this.clientInformationDetailByEmail.Profession) {
          console.error('Perfil', '**  ParentId: ' + this.clientInformationDetailByEmail.Profession.ParentId);
          console.warn('Perfil', { profession: this.clientInformationDetailByEmail.Profession });
          if (this.clientInformationDetailByEmail.Profession.ParentId !== null) {
            this.profileForm.controls['Profession'].setValue(this.clientInformationDetailByEmail.Profession.ParentId);
            await this.getSpecialities(this.clientInformationDetailByEmail.Profession.ParentId);
            this.getSpecialitiesBehaviorSub =
              this.getSpecialitiesSuccess.subscribe((value: any) => {
                console.warn('Perfil', 'succesSpecialities: ' + value);
                if (this.clientInformationDetailByEmail.Profession.ParentId && this.showTipoProfesional === true) {
                  this.profileForm.controls['ProfessionType'].setValue(this.clientInformationDetailByEmail.Profession.ProfessionId);
                  this.getSpecialitiesUnSubscribe();
                  this.displayCountry();
                }
              });
          } else {
            console.error('Perfil', '**  ProfessionId: ' + this.clientInformationDetailByEmail.Profession.ProfessionId);
            if (this.clientInformationDetailByEmail.Profession.ProfessionId === 7) {
              this.profileForm.controls['Profession'].setValue(this.clientInformationDetailByEmail.Profession.ProfessionId);
              this.getSpecialitiesBehaviorSub =
                this.getSpecialitiesSuccess.subscribe((value: any) => {
                  if (this.showProfessionalLicence) {
                    console.warn('Perfil', '**  ProfessionalLicense: ' + this.clientInformationDetailByEmail.Profession.ProfessionalLicense);
                    this.profileForm.controls['ProfessionalLicense'].setValue(this.clientInformationDetailByEmail.Profession.ProfessionalLicense);
                  }
                  console.error('Perfil', '**  success: ' + value + ', showSpeciality: ' + this.showSpeciality);
                  if (value === true && this.showSpeciality === false) {
                    this.getSpecialitiesUnSubscribe();
                    this.displayCountry();
                  }

                  let specialityProfessionalLicense: string = '';
                  if (this.clientInformationDetailByEmail.Speciality !== null) {
                    console.log('Perfil', this.clientInformationDetailByEmail.Speciality.ProfessionalLicense);
                    specialityProfessionalLicense = this.clientInformationDetailByEmail.Speciality.ProfessionalLicense;
                    console.warn('Perfil', '**  specialityProfessionalLicense: ' + specialityProfessionalLicense);
                    this.profileForm.controls['SpecialityProfessionalLicense'].setValue(specialityProfessionalLicense);
                  }
                  console.error('Perfil', '**  success: ' + value + ', showSpeciality: ' + this.showSpeciality);
                  if (value === true && this.showSpeciality === true) {
                    if (this.clientInformationDetailByEmail.Speciality) {
                      console.warn('asignamos la especialidad');
                      console.warn(this.clientInformationDetailByEmail.Speciality.SpecialityId);

                      if (this.clientInformationDetailByEmail.Speciality.SpecialityId === 58) {
                        console.warn('entramos a medicina general');
                        this.profileForm.controls['SpecialityProfessionalLicense'].clearValidators();
                        this.profileForm.controls['SpecialityProfessionalLicense'].setValue('');
                        this.profileForm.controls['SpecialityProfessionalLicense'].updateValueAndValidity();
                        this.showSpecialityLicense = false;
                        this.showProfessionalLicence = false
                        this.showsubSpeciality = false;
                      }

                      this.profileForm.controls['Speciality'].setValue(this.clientInformationDetailByEmail.Speciality.SpecialityId);
                      console.warn('Perfil', '**  controls.SpecialityProfessionalLicense.setValue(' + specialityProfessionalLicense + ')...');
                      this.profileForm.controls['SpecialityProfessionalLicense'].setValue(this.clientInformationDetailByEmail.Speciality.ProfessionalLicense);
                      this.profileForm.controls['subSpecialityProfessionalLicense'].setValue(this.clientInformationDetailByEmail.Subspeciality.SubspecialityLicense);
                      this.getSubspecialitiesBehaviorSub =
                        this.getSubspecialitiesSuccess.subscribe((subspecialities: any) => {
                          console.warn('init getSubspecialitiesSuccess');
                          console.warn(subspecialities);
                          console.warn(this.showsubSpeciality);
                          if (subspecialities === true && this.showsubSpeciality === false) {
                            this.getSpecialitiesUnSubscribe();
                            this.getSubspecialitiesUnSubscribe();
                          }
                          if (subspecialities === true && this.showsubSpeciality === true) {
                            if (this.clientInformationDetailByEmail.Subspeciality) {
                              this.profileForm.controls['subSpeciality'].setValue(this.clientInformationDetailByEmail.Subspeciality.SubspecialityId);
                              this.profileForm.controls['subSpecialityProfessionalLicense'].setValue(this.clientInformationDetailByEmail.Subspeciality.SubspecialityLicense);
                            }
                            this.getSpecialitiesUnSubscribe();
                            this.getSubspecialitiesUnSubscribe();
                          }
                        });
                      const flgSPL = (specialityProfessionalLicense ? true : false);
                      console.error('Perfil', '**  flgSPL: ' + flgSPL + ', SpecialityId: ' + this.clientInformationDetailByEmail.Speciality.SpecialityId);
                      console.warn('Perfil', '**  getSubspecialities()...');
                      this.getSubspecialities(this.clientInformationDetailByEmail.Speciality.SpecialityId, flgSPL);
                    }
                  } else if (!this.flgSpeciality && this.clientInformationDetailByEmail.Profession.ProfessionId) {
                    console.error('Perfil', '**  getSpecialities()...');
                    this.getSpecialities(this.clientInformationDetailByEmail.Profession.ProfessionId);
                  }
                });
            }
            this.displayCountry();
          }
          this.controllersIonicService.hideLoader().finally(() => console.log('successfull displayClientDetail'));
        } else {
          this.controllersIonicService.hideLoader().finally(() => console.log('successfull displayClientDetail'));
          this.displayCountry();
        }

      } else {
        this.profileForm.controls['Email'].setValue(this.email);
        this.profileForm.controls['Email'].disable();
        this.controllersIonicService.hideLoader().finally(() => console.log('successfull displayClientDetail'));
      }
    } else {
      this.profileForm.controls['Email'].setValue(this.email);
      this.profileForm.controls['Email'].disable();
      this.controllersIonicService.hideLoader().finally(() => console.log('successfull displayClientDetail'));
    }
  }

  async getSpecialities(ProfessionId: number) {
    console.warn('Perfil', '**  getSpecialities  **');
    this.flgSpeciality = true;
    console.error('Perfil', '**  flgSpeciality: ' + this.flgSpeciality);
    if (ProfessionId === 7 || ProfessionId === 8) {
      this.showProfessionalLicence = true;
      this.profileForm.controls['ProfessionalLicense'].setValue('');
      this.profileForm.controls['ProfessionalLicense'].setValidators(
        [Validators.required,
        Validators.minLength(5),
        Validators.maxLength(15),
        Validators.pattern('^[0-9\s\\-a-zA-Z]+$')]);
      this.profileForm.controls['ProfessionalLicense'].updateValueAndValidity();
    } else {
      this.profileForm.controls['ProfessionalLicense'].clearValidators();
      this.showProfessionalLicence = false;
    }
    console.warn('Perfil', '**  showProfessionalLicence: ' + this.showProfessionalLicence);
    console.error('Perfil', '**  ProfessionId: ' + ProfessionId + ', Profession: ' + this.profileForm.value.Profession);
    if (this.profileForm.value.Profession === 22) {
      this.getProfessionsByParent(22);
    } else {
      console.error('Perfil', '**  showTipoProfesional: ' + this.showTipoProfesional);
      if (this.showTipoProfesional) {
        console.error('Perfil', '**  ProfessionType-clearValidators()...');
        this.profileForm.controls['ProfessionType'].setValue('');
        this.profileForm.controls['ProfessionType'].clearValidators();
        this.profileForm.controls['ProfessionType'].updateValueAndValidity();
        this.showTipoProfesional = false;
      }
      if (this.loader.getValue()) {
        this.controllersIonicService.showLoader().finally(() => {
          this.getSpecialitiesRequest(ProfessionId);
        });
      } else {
        this.getSpecialitiesRequest(ProfessionId);
      }
    }
  }

  async getSpecialitiesRequest(ProfessionId: number) {
    console.error('Perfil', '**  getSpecialitiesRequest  **');
    if (this.SubSpecialitiesRequest) {
      this.SubSpecialitiesRequest.unsubscribe();
    }
    this.SubSpecialitiesRequest =
      this.plmClientsEngineService.getSpecialitiesRequest(ProfessionId)
        .subscribe({
          next: () => {
            const arraySpecialities = this.plmClientsEngineService.getSpecialities().getValue();
            if (Array.isArray(arraySpecialities)) {
              if (arraySpecialities.length > 1) {
                arraySpecialities.shift();
                this.specialities = arraySpecialities;
                this.showSpeciality = true;
                this.showsubSpeciality = false;
                this.profileForm.controls['Speciality'].setValue('');
                this.profileForm.controls['Speciality'].setValidators(Validators.required);
                this.profileForm.controls['Speciality'].updateValueAndValidity();
                this.profileForm.controls['SpecialityProfessionalLicense'].setValue('');
                this.profileForm.controls['SpecialityProfessionalLicense'].setValidators(
                  [Validators.required,
                  Validators.minLength(5),
                  Validators.maxLength(15),
                  Validators.pattern('^[0-9\s\\-a-zA-Z]+$')]);
                this.profileForm.controls['SpecialityProfessionalLicense'].updateValueAndValidity();
              } else {
                this.profileForm.controls['ProfessionalLicense'].clearValidators();
                this.profileForm.controls['subSpeciality'].clearValidators();
                this.profileForm.controls['subSpecialityProfessionalLicense'].clearValidators();
                this.profileForm.controls['Speciality'].clearValidators();
                this.profileForm.controls['SpecialityProfessionalLicense'].clearValidators();
                this.profileForm.controls['ProfessionalLicense'].setValue('');
                this.profileForm.controls['Speciality'].setValue('');
                this.profileForm.controls['subSpeciality'].setValue('');
                this.profileForm.controls['SpecialityProfessionalLicense'].setValue('');
                this.profileForm.controls['subSpecialityProfessionalLicense'].setValue('');
                this.showSpeciality = false;
                this.showsubSpeciality = false;
              }
            }
          },
          error: (ex: any) => {
            this.controllersIonicService.hideLoader().finally(() => {
              this.profileForm.controls['ProfessionalLicense'].setValue('');
              this.profileForm.controls['Speciality'].setValue('');
              this.profileForm.controls['subSpeciality'].setValue('');
              this.profileForm.controls['SpecialityProfessionalLicense'].setValue('');
              this.profileForm.controls['subSpecialityProfessionalLicense'].setValue('');
              this.profileForm.controls['subSpeciality'].clearValidators();
              this.profileForm.controls['subSpecialityProfessionalLicense'].clearValidators();
              this.profileForm.controls['Speciality'].clearValidators();
              this.profileForm.controls['SpecialityProfessionalLicense'].clearValidators();
              this.showSpeciality = false;
              this.showsubSpeciality = false;
              console.error({ specialities: ex });
            });
          },
          complete: () => {
            this.controllersIonicService.hideLoader().finally(() => {
              console.log('successfull getSpecialitiesRequest');
              if (Array.isArray(this.specialities)) {
                this.getSpecialitiesSuccess.next(true);
              } else {
                this.getSpecialitiesSuccess.next(false);
              }
              console.error('Perfil', '**  getSpecialitiesSuccess: ' + this.getSpecialitiesSuccess);
            });
          }
        });
  }

  getSpecialitiesUnSubscribe() {
    if (this.getSpecialitiesBehaviorSub) {
      this.getSpecialitiesBehaviorSub.unsubscribe();
    }
  }

  async getSubspecialities(SpecialityId: number, flgSPL?: boolean) {
    console.warn('init getSubspecialities');
    this.showSpecialityLicense = true;
    this.showProfessionalLicence = true;
    console.warn('Perfil', '**  showSpecialityLicense: ' + this.showSpecialityLicense + ', showProfessionalLicence: ' + this.showProfessionalLicence);
    if (SpecialityId >= 1) {
      this.profileForm.controls['subSpeciality'].setValue('');
      this.profileForm.controls['subSpecialityProfessionalLicense'].setValue('');
      console.error('Perfil', '**  SpecialityId: ' + SpecialityId);
      if (SpecialityId === 58) { // medicina general !!
        console.warn('entramos a medicina general');
        this.profileForm.controls['SpecialityProfessionalLicense'].clearValidators();
        if (!flgSPL) {
          console.warn('Perfil', '**  four-controls.SpecialityProfessionalLicense.setValue(empty)...');
          this.profileForm.controls['SpecialityProfessionalLicense'].setValue('');
        }
        this.profileForm.controls['SpecialityProfessionalLicense'].updateValueAndValidity();
        this.showSpecialityLicense = false;
        this.showProfessionalLicence = false
        this.showsubSpeciality = false;
        console.warn('Perfil', '**  showSpecialityLicense: ' + this.showSpecialityLicense + ', showProfessionalLicence: ' + this.showProfessionalLicence + ', showsubSpeciality: ' + this.showsubSpeciality);
      } else {
        if (!flgSPL) {
          console.warn('Perfil', '**  five-controls.SpecialityProfessionalLicense.setValue(empty)...');
          this.profileForm.controls['SpecialityProfessionalLicense'].setValue('');
        }
        this.profileForm.controls['SpecialityProfessionalLicense'].setValidators(
          [Validators.required,
          Validators.minLength(5),
          Validators.maxLength(15),
          Validators.pattern('^[0-9\s\\-a-zA-Z]+$')]);
        this.profileForm.controls['SpecialityProfessionalLicense'].updateValueAndValidity();
        if (this.loader.getValue()) {
          this.controllersIonicService.showLoader().finally(() => {
            this.getSubspecialitiesRequest(SpecialityId);
          });
        } else {
          await this.getSubspecialitiesRequest(SpecialityId);
        }
      }
    } else {
      this.showsubSpeciality = false;
    }
  }

  async getSubspecialitiesRequest(SpecialityId: number) {
    this.SubGetSubspecialities =
      this.plmClientsEngineService.getSubspecialitiesRequest(SpecialityId)
        .subscribe({
          next: () => {
            const arraySubspecialities = this.plmClientsEngineService.getSubspecialities().getValue();
            if (Array.isArray(arraySubspecialities)) {
              if (arraySubspecialities.length > 1) {
                arraySubspecialities.shift();
                this.subspecialities = arraySubspecialities;
                console.warn(arraySubspecialities);
                this.showsubSpeciality = true;
                //this.profileForm.controls['subSpeciality'].setValidators(Validators.required);
                this.profileForm.controls['subSpecialityProfessionalLicense'].setValidators([
                  Validators.minLength(5),
                  Validators.maxLength(15),
                  Validators.pattern('^[0-9\s\\-a-zA-Z]+$')]
                );
              } else {
                this.profileForm.controls['subSpeciality'].clearValidators();
                this.profileForm.controls['subSpecialityProfessionalLicense'].clearValidators();
                this.profileForm.controls['subSpeciality'].updateValueAndValidity();
                this.profileForm.controls['subSpecialityProfessionalLicense'].updateValueAndValidity();
                this.showsubSpeciality = false;
              }
            } else {
              this.profileForm.controls['subSpeciality'].clearValidators();
              this.profileForm.controls['subSpeciality'].updateValueAndValidity();
              this.profileForm.controls['subSpecialityProfessionalLicense'].clearValidators();
              this.profileForm.controls['subSpecialityProfessionalLicense'].updateValueAndValidity();
              this.showsubSpeciality = false;
            }
          },
          error: (ex: any) => {
            console.error({ subspecialities: ex });
            this.showsubSpeciality = false;
            this.controllersIonicService.hideLoader();
          },
          complete: () => {
            if (Array.isArray(this.subspecialities)) {
              this.getSubspecialitiesSuccess.next(true);
            } else {
              this.getSubspecialitiesSuccess.next(false);
            }
            console.log('successful getSubspecialities');
            this.controllersIonicService.hideLoader();
          }
        });
  }

  getSubspecialitiesUnSubscribe() {
    if (this.getSubspecialitiesBehaviorSub) {
      this.getSubspecialitiesBehaviorSub.unsubscribe();
    }
  }

  async getProfessionsByParent(ProfessionId: number) {
    console.error('Perfil', '**  getProfessionsByParent  **');
    this.controllersIonicService.showLoader().finally(() => {
      this.SubProfessionsByParent =
        this.plmClientsEngineService.getProfessionsByParentRequest(ProfessionId)
          .subscribe({
            next: () => {
              const arrayProfession = this.plmClientsEngineService.getProfessionsByParent().getValue();
              if (Array.isArray(arrayProfession)) {
                this.professionsbyparents = arrayProfession;
              }
              if (this.professionsbyparents.length > 1) {
                this.showTipoProfesional = true;
                this.profileForm.controls['ProfessionType'].setValidators(Validators.required);
              } else {
                this.profileForm.controls['ProfessionType'].clearValidators();
                this.profileForm.controls['ProfessionType'].updateValueAndValidity();
                this.showTipoProfesional = false;
              }
            },
            error: (ex: any) => {
              this.controllersIonicService.hideLoader().finally(() => {
                console.error({ getProfessionsByParent: ex });
              });
            },
            complete: () => {
              this.controllersIonicService.hideLoader().finally(() => {
                this.getSpecialitiesSuccess.next(false);
                console.error('Perfil', '**  getSpecialitiesSuccess: ' + this.getSpecialitiesSuccess.getValue());
                console.log('successfull getProfessionsByParent');
              });
            }
          });
    });
  }



  getPhoneLada(LocationId: number) {
    for (const location of this.locations) {
      if (location.LocationId === LocationId) {
        this.profileForm.get('Location')?.setValue(LocationId);
        this.phoneLada = `(${location.PhoneLada})`;
        const lada = (location.PhoneLada + '').length;
        this.profileForm.controls['Mobile'].clearValidators();
        this.profileForm.controls['Mobile'].setValidators([Validators.minLength(10), Validators.maxLength(10), Validators.pattern('[0-9]+')]);
        this.profileForm.controls['Mobile'].updateValueAndValidity();
        /*
        switch (lada) {
          case 2:
            this.profileForm.controls['Mobile'].clearValidators();
            this.profileForm.controls['Mobile'].setValidators([
              Validators.minLength(8),
              Validators.maxLength(8),
              Validators.pattern('[0-9]+')
            ]);
            this.profileForm.controls['Mobile'].updateValueAndValidity();
            break;
          case 3:
            this.profileForm.controls['Mobile'].clearValidators();
            this.profileForm.controls['Mobile'].setValidators([
              Validators.minLength(7),
              Validators.maxLength(7),
              Validators.pattern('[0-9]+')
            ]);
            this.profileForm.controls['Mobile'].updateValueAndValidity();
            break;
          default:
            this.profileForm.controls['Mobile'].clearValidators();
            // tslint:disable-next-line:max-line-length
            this.profileForm.controls['Mobile'].setValidators([Validators.minLength(7), Validators.maxLength(10), Validators.pattern('[0-9]+')]);
            this.profileForm.controls['Mobile'].updateValueAndValidity();
            break;
        }
        */
        break;
      }
    }
  }

  //Professions

  async getProfessions() {
    if (this.SubProfessionsRequest) {
      this.SubProfessionsRequest.unsubscribe();
    }
    const profession = this.plmClientsEngineService.getprofession().getValue();
    if (Array.isArray(profession) && profession.length > 0) {
      this.filterProfessions();
    } else {
      this.SubProfessionsRequest =
        this.plmClientsEngineService.getProfessionsRequest()
          .subscribe({
            next: () => {
              const arrayProfession = this.plmClientsEngineService.getprofession().getValue();
              if (Array.isArray(arrayProfession)) {
                this.professions = arrayProfession;
                this.filterProfessions();
              }
            },
            error: (ex: any) => {
              console.error(ex);
              // this.professionsLoaded.next(false);
            },
            complete: () => {
              console.log('successfull getProfessions');
              // this.professionsLoaded.next(true);
            }
          });
    }
  }

  private filterProfessions() {
    this.professions = this.plmClientsEngineService.getprofession().getValue().filter((item: any) => {
      return (item.ProfessionName === 'MÉDICO');
    });
  }

  onChangeProfessionbyParent(Profession: any) {
    this.professionbyParent = Profession;
    console.log('Perfil', { 'onChangeProfessionbyParent()': Profession });
  }

  //Countries

  async getCountries() {
    if (this.SubCountriesRequest) {
      this.SubCountriesRequest.unsubscribe();
    }
    const countries = this.plmClientsEngineService.getCountries().getValue();
    if (Array.isArray(countries) && countries.length > 0) {
      this.getAvalibleCountries(countries);
    } else {
      this.SubCountriesRequest =
        this.plmClientsEngineService.getCountriesRequest()
          .subscribe({
            next: () => {
              const arrayCountries = this.plmClientsEngineService.getCountries().getValue();
              if (Array.isArray(arrayCountries)) {
                this.getAvalibleCountries(arrayCountries);
              }
            },
            error: (ex: any) => { console.error(ex); },
            complete: () => {
              console.log('successfull getCountries');
            }
          });
    }
  }

  getAvalibleCountries(countries: any) {
    this.countries = [];
    if (environment.applicationInfo.availableCountries.length > 0) {
      // availableCountries: []
    } else {
      for (const item of countries) {
        if (item.ID === environment.applicationInfo.countryKey) {
          this.countries.push(item);
          break;
        }
      }
    }
  }

  getStateByCountry(countryId: number) {
    console.warn('Perfil', '**  getStateByCountry(' + countryId + ')');
    this.flgCountry = true;
    console.log('Perfil', '**  flgCountry: ' + this.flgCountry);
    for (const country of this.countries) {
      if (country.CountryId === countryId) {
        this.countryLada = `+${country.CountryLada}`;
        this.phoneLada = '';
      }
    }
    if (this.loader.getValue()) {
      this.controllersIonicService.showLoader().finally(() => {
        this.getStateByCountryRequest(countryId);
      });
    } else {
      this.getStateByCountryRequest(countryId);
    }
  }

  async getStateByCountryRequest(countryId: number) {
    console.warn('Perfil', '**  getStateByCountryRequest(' + countryId + ')');
    if (this.SubStateByCountryRequest) {
      this.SubStateByCountryRequest.unsubscribe();
    }
    this.SubStateByCountryRequest =
      this.plmClientsEngineService.getStateByCountryRequest(countryId)
        .subscribe({
          next: () => {
            this.states = [];
            const arrayState = this.plmClientsEngineService.getStateByCountry().getValue();
            if (Array.isArray(arrayState)) {
              arrayState.shift();
              if (arrayState.length > 1) {
                this.states = arrayState;
                this.showStates = true;
                this.profileForm.controls['State'].setValidators(Validators.required);
                this.profileForm.controls['Location'].updateValueAndValidity();
              } else {
                this.stateClearValidators();
              }
            } else {
              this.stateClearValidators();
            }
          },
          error: (ex: any) => {
            console.error(JSON.stringify(ex));
            this.controllersIonicService.hideLoader();
          },
          complete: () => {
            this.controllersIonicService.hideLoader();
            if (Array.isArray(this.states)) {
              this.stateByCountrySuccess.next(true);
            } else {
              this.stateByCountrySuccess.next(false);
            }
            console.log(' successfull getStateByCountryRequest');
          }
        });
  }

  stateClearValidators() {
    if (this.showStates) {
      this.profileForm.controls['State'].clearValidators();
      this.profileForm.controls['State'].setValue('');
      this.profileForm.controls['State'].updateValueAndValidity();
      this.showStates = false;
      this.states = [];
    }
    this.locationClearValidators();
  }

  getStateByCountryUnSubscribe() {
    if (this.stateByCountryBehaviorSub) {
      this.stateByCountryBehaviorSub.unsubscribe();
    }
  }

  getLocationsByState(StateId: number) {
    if (this.loader.getValue()) {
      this.controllersIonicService.showLoader().finally(() => {
        this.getLocationsByStateRequest(StateId);
      });
    } else {
      this.getLocationsByStateRequest(StateId);
    }
  }

  async getLocationsByStateRequest(StateId: number) {
    if (this.SubLocationsByState) {
      this.SubLocationsByState.unsubscribe();
    }
    this.SubLocationsByState =
      this.plmClientsEngineService.getLocationsByStateRequest(StateId)
        .subscribe({
          next: () => {
            this.locations = [];
            const arrayLocationsByState = this.plmClientsEngineService.getLocationsByState().getValue();
            if (Array.isArray(arrayLocationsByState)) {
              this.profileForm.controls['Location'].clearValidators();
              this.locations = arrayLocationsByState;
              this.showLocation = true;
              if (this.locations.length >= 1) {
                this.profileForm.controls['Location'].setValue('');
                this.profileForm.controls['Location'].setValidators(Validators.required);
                this.profileForm.controls['Location'].updateValueAndValidity();
              } else {
                this.locationClearValidators();
              }
            } else {
              this.locationClearValidators();
            }
          },
          error: (ex: any) => {
            console.error(ex);
            this.controllersIonicService.hideLoader();
          },
          complete: () => {
            if (Array.isArray(this.locations)) {
              this.locationsByStateSuccess.next(true);
            } else {
              this.locationsByStateSuccess.next(false);
            }
            console.log('successfull getLocationsByState');
            this.controllersIonicService.hideLoader();
          }
        });
  }

  locationClearValidators() {
    if (this.showLocation) {
      this.profileForm.controls['Location'].setValue('');
      this.profileForm.controls['Location'].clearValidators();
      this.profileForm.controls['Location'].updateValueAndValidity();
      this.showLocation = false;
      this.locations = [];
    }
  }

  getLocationsByStateUnSubscribe() {
    if (this.locationsByStateBehaviorSub) {
      this.locationsByStateBehaviorSub.unsubscribe();
    }
  }

  displayCountry() {
    for (const iterator of this.countries) {
      if (iterator.CountryId === this.clientInformationDetailByEmail.Country.CountryId) {
        this.profileForm.controls['Country'].setValue(this.clientInformationDetailByEmail.Country.CountryId);
        this.stateByCountryBehaviorSub =
          this.stateByCountrySuccess.subscribe((stateByCountrySucces: boolean) => {
            console.warn('Perfil', '**  succesState: ' + stateByCountrySucces);
            if (stateByCountrySucces === true && this.showStates === true) {
              if (this.clientInformationDetailByEmail.State) {
                this.profileForm.controls['State'].setValue(this.clientInformationDetailByEmail.State.StateId);
                this.locationsByStateBehaviorSub =
                  this.locationsByStateSuccess.subscribe((finishedLocation: boolean) => {
                    console.warn('Perfil', '**  succesLocations: ' + finishedLocation);
                    if (finishedLocation === true && this.showLocation === true) {
                      if (this.clientInformationDetailByEmail.LocationId > 0) {
                        this.profileForm.controls['Location'].setValue(this.clientInformationDetailByEmail.LocationId);
                        this.getPhoneLada(this.clientInformationDetailByEmail.LocationId);
                        this.getLocationsByStateUnSubscribe();
                        this.getStateByCountryUnSubscribe();
                        this.loader.next(true);
                      } else {
                        this.getLocationsByStateUnSubscribe();
                        this.getStateByCountryUnSubscribe();
                      }
                    }
                    if (finishedLocation === true && this.showLocation === false) {
                      this.getLocationsByStateUnSubscribe();
                      this.getStateByCountryUnSubscribe();
                    }
                  });
                this.getLocationsByState(this.clientInformationDetailByEmail.State.StateId);
              } else {
                this.getStateByCountryUnSubscribe();
              }
            }
            console.warn('Perfil', '**  succes: ' + stateByCountrySucces + ', showStates: ' + this.showStates);
            if (stateByCountrySucces === true && this.showStates === false) {
              this.loader.next(true);
              this.getStateByCountryUnSubscribe();
            } else if (!this.flgCountry && this.clientInformationDetailByEmail.Country.CountryId) {
              console.error('Perfil', '**  getStateByCountry()...');
              this.getStateByCountry(this.clientInformationDetailByEmail.Country.CountryId);
            }
          });
        if (this.updateUser) {
          this.profileForm.controls['Terms'].clearValidators();
          this.profileForm.controls['Policy'].clearValidators();
          this.profileForm.controls['Terms'].updateValueAndValidity();
          this.profileForm.controls['Policy'].updateValueAndValidity();
        }
        break;
      }
    }
  }

  //Buttons (Registrar/Actualizar)

  register() {
    console.log('REGISTER')
    this.controllersIonicService.showLoader().finally(() => {
      const FirstNameToSend = this.profileForm.get('FirstName')?.value;
      const LastNameToSend = this.profileForm.get('LastName')?.value;
      const SecondLastNameToSend = this.profileForm.get('SecondLastName')?.value;
      const EmailToSend = this.profileForm.get('Email')?.value;
      let ProfessionToSend = this.profileForm.get('Profession')?.value;
      let ProfessionType = this.profileForm.get('ProfessionType')?.value;
      const ProfessionalLicenseToSend = this.profileForm.get('ProfessionalLicense')?.value;
      let SpecialityToSend = this.profileForm.get('Speciality')?.value;
      const SpecialityProfessionalLicenseToSend = this.profileForm.get('SpecialityProfessionalLicense')?.value;
      let subSpecialityToSend = this.profileForm.get('subSpeciality')?.value;
      const subSpecialityProfessionalLicenseToSend = this.profileForm.get('subSpecialityProfessionalLicense')?.value;
      let CountryToSend = this.profileForm.get('Country')?.value;
      let StateToSend = this.profileForm.get('State')?.value;
      const LocationToSend = this.profileForm.get('Location')?.value;
      const numberMobile = this.profileForm.get('Mobile')?.value;
      let MobileToSend = numberMobile;
      /*if (this.showStates === true && this.showLocation === true) {
        if (this.countryLada !== '' && this.phoneLada !== '' && numberMobile !== '') {
          MobileToSend = numberMobile;
        } else {
          if (numberMobile !== '') {
            MobileToSend = numberMobile;
          }
        }
      } else {
        if (numberMobile !== '' && this.countryLada !== '') {
          MobileToSend = numberMobile;
        } else {
          MobileToSend = numberMobile;
        }
      }*/
      if (ProfessionToSend !== '' || ProfessionToSend !== undefined || ProfessionToSend != null) {
        for (const profession of this.professions) {
          if (profession.ProfessionId === ProfessionToSend) {
            this.userStorageService.userInfo.profession = profession;
            ProfessionToSend = profession.ProfessionId;
          }
        }
      } else {
        this.userStorageService.userInfo.profession = null;
      }
      if (SpecialityToSend !== '' || SpecialityToSend !== undefined || SpecialityToSend != null) {
        for (const speciality of this.specialities) {
          if (speciality.SpecialityId === SpecialityToSend) {
            this.userStorageService.userInfo.speciality = speciality;
            SpecialityToSend = speciality.SpecialityId;
          }
        }
      } else {
        this.userStorageService.userInfo.speciality = null;
      }
      if (subSpecialityToSend !== '' || subSpecialityToSend !== undefined || subSpecialityToSend != null) {
        for (const subSpeciality of this.subspecialities) {
          if (subSpeciality.SubspecialityId === subSpecialityToSend) {
            subSpecialityToSend = subSpeciality.SubspecialityId;
          }
        }
      }
      if (CountryToSend !== '' || CountryToSend !== undefined || CountryToSend != null) {
        for (const country of this.countries) {
          if (country.CountryId === CountryToSend) {
            CountryToSend = country.ID;
            break;
          }
        }
      }
      if (StateToSend !== '' && StateToSend !== undefined && StateToSend != null) {
        const selectedState = this.states.find(state => state.StateId === StateToSend);
        if (selectedState !== undefined) {
          StateToSend = selectedState.ShortName;
        }
      }
      const saveclient: ISaveMobileLocationAppClient = {
        codePrefix: environment.applicationInfo.prefix,
        country: CountryToSend,
        email: EmailToSend,
        firstName: FirstNameToSend,
        lastName: LastNameToSend,
        latitude: null,
        locationId: LocationToSend,
        longitude: null,
        otherProfession: '',
        otherSpeciality: '',
        phone: MobileToSend,
        profession: ProfessionToSend,
        professionLicense: ProfessionalLicenseToSend,
        slastName: SecondLastNameToSend,
        source: 27,
        speciality: SpecialityToSend,
        specialityLicense: SpecialityProfessionalLicenseToSend,
        state: StateToSend,
        subspeciality: subSpecialityToSend,
        subspecialityLicense: subSpecialityProfessionalLicenseToSend,
        suburbId: 0,
        targetOutput: 3,
        zipCodeId: 0
      };
      console.warn('saveClient 1', saveclient);
      saveclient.targetOutput = this.globalVarsService.getDeviceInfo().TargetId;
      console.log('Perfil - Register - saveclient.targetOutput', saveclient.targetOutput);
      if (ProfessionType === '' || ProfessionType === '' || ProfessionType === undefined || ProfessionType == null) { } else {
        saveclient.profession = ProfessionType;
      }
      if (this.professionbyParent === '' || this.professionbyParent === ''
        || this.professionbyParent == null || this.professionbyParent === undefined) { } else {
        saveclient.profession = this.professionbyParent;
      }
      if (ProfessionToSend === '' || ProfessionToSend == null || ProfessionToSend === undefined) {
        saveclient.profession = null;
        ProfessionType = null;
        this.professionbyParent = null;
      }
      if (SpecialityToSend === '' || SpecialityToSend == null || SpecialityToSend === undefined) {
        saveclient.speciality = null;
      }
      if (subSpecialityToSend === '' || subSpecialityToSend == null || subSpecialityToSend === undefined) {
        saveclient.subspeciality = null;
      }
      if (LocationToSend === '' || LocationToSend == null || LocationToSend === undefined) {
        saveclient.locationId = 0;
      }
      this.postRegister(saveclient);
      console.warn('saveClient 2', saveclient);
    });
  }

  async update() {
    console.log('on update()');
    this.controllersIonicService.showLoader().finally(() => {
      const FirstNameToSend = this.profileForm.get('FirstName')?.value;
      const LastNameToSend = this.profileForm.get('LastName')?.value;
      const SecondLastNameToSend = this.profileForm.get('SecondLastName')?.value;
      const EmailToSend = this.profileForm.get('Email')?.value;
      let ProfessionToSend = this.profileForm.get('Profession')?.value;
      let ProfessionType = this.profileForm.get('ProfessionType')?.value;
      const ProfessionalLicenseToSend = this.profileForm.get('ProfessionalLicense')?.value;
      let SpecialityToSend = this.profileForm.get('Speciality')?.value;
      const SpecialityProfessionalLicenseToSend = this.profileForm.get('SpecialityProfessionalLicense')?.value;
      let subSpecialityToSend = this.profileForm.get('subSpeciality')?.value;
      const subSpecialityProfessionalLicenseToSend = this.profileForm.get('subSpecialityProfessionalLicense')?.value;
      let CountryToSend = this.profileForm.get('Country')?.value;
      let StateToSend = this.profileForm.get('State')?.value;
      const LocationToSend = this.profileForm.get('Location')?.value;
      const MobileToSend = this.profileForm.get('Mobile')?.value;
      const TermsToSend = this.profileForm.get('Terms')?.value;
      const PolicyToSend = this.profileForm.get('Policy')?.value;
      if (ProfessionToSend !== '' || ProfessionToSend !== undefined || ProfessionToSend !== null) {
        for (const profession of this.professions) {
          if (profession.ProfessionId === ProfessionToSend) {
            this.userStorageService.userInfo.profession = profession;
            ProfessionToSend = profession.ProfessionId;
            break;
          }
        }
      } else {
        this.userStorageService.userInfo.profession = null;
      }
      if (SpecialityToSend !== '' || SpecialityToSend !== undefined || SpecialityToSend !== null) {
        for (const speciality of this.specialities) {
          if (speciality.SpecialityId === SpecialityToSend) {
            this.userStorageService.userInfo.speciality = speciality;
            SpecialityToSend = speciality.SpecialityId;
            break;
          }
        }
      } else {
        this.userStorageService.userInfo.speciality = null;
      }
      if (subSpecialityToSend !== '' || subSpecialityToSend !== undefined || subSpecialityToSend !== null) {
        for (const subspeciality of this.subspecialities) {
          if (subspeciality.SubspecialityId === subSpecialityToSend) {
            // this.userStorageService.userInfo.subSpeciality = subspeciality;
            subSpecialityToSend = subspeciality.SubspecialityId;
            break;
          }
        }
      }
      if (CountryToSend !== '' || CountryToSend !== undefined || CountryToSend != null) {
        for (const country of this.countries) {
          if (country.CountryId === CountryToSend) {
            CountryToSend = country.ID;
            break;
          }
        }
      }
      if (StateToSend !== '' && StateToSend !== undefined && StateToSend != null) {
        const selectedState = this.states.find(state => state.StateId === StateToSend);
        if (selectedState !== undefined) {
          StateToSend = selectedState.ShortName;
        }
      }

      const updateClient: IUpdateMobileLocationAppClient = {
        codeString: this.globalVarsService.getClientInfoValue().codeString,
        firstName: FirstNameToSend,
        lastName: LastNameToSend,
        slastName: SecondLastNameToSend,
        email: EmailToSend,
        profession: ProfessionToSend,
        otherProfession: '',
        professionLicense: ProfessionalLicenseToSend,
        speciality: SpecialityToSend,
        otherSpeciality: '',
        specialityLicense: SpecialityProfessionalLicenseToSend,
        subspeciality: subSpecialityToSend,
        subspecialityLicense: subSpecialityProfessionalLicenseToSend,
        country: CountryToSend,
        latitude: null,
        locationId: LocationToSend,
        longitude: null,
        phone: MobileToSend,
        source: 27,
        state: StateToSend,
        suburbId: 0,
        targetOutput: 3,
        zipCodeId: 0
      };
      if (ProfessionType === '' || ProfessionType === '' || ProfessionType === undefined || ProfessionType === null) { } else {
        updateClient.profession = ProfessionType;
      }
      if (this.professionbyParent === '' || this.professionbyParent === '' || this.professionbyParent === null || this.professionbyParent === undefined) { } else {
        updateClient.profession = this.professionbyParent;
      }
      if (ProfessionToSend === '' || ProfessionToSend === null || ProfessionToSend === undefined) {
        updateClient.profession = null;
        ProfessionType = null;
        this.professionbyParent = null;
      }
      if (SpecialityToSend === '' || SpecialityToSend === null || SpecialityToSend === undefined) {
        updateClient.speciality = null;
      }
      if (subSpecialityToSend === '' || subSpecialityToSend === null || subSpecialityToSend === undefined) {
        updateClient.subspeciality = null;
      }
      if (LocationToSend === '' || LocationToSend === null || LocationToSend === undefined) {
        updateClient.locationId = 0;
      }
      console.warn('UPDATECLIENT', updateClient);
      this.postUpdate(updateClient);
    });
  }

  // ─── GET AND POST REQUEST ───────────────────────────────────────────────────────
  async postRegister(saveclient: any) {
    App.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
      console.log('Deeplink recibido(perfil)', event);
    });
    console.warn('PostRegister - saveClient', saveclient);
    this.SubRegisterAppClientRequest =
      this.plmClientsEngineService
        .registerAppClientRequest(saveclient)
        .subscribe({
          next: (responseData: any) => {
            console.warn('PostRegister - responseData', responseData);
            this.subRegisterAppClient =
              responseData.subscribe(async (valor: any) => {

                console.log('VALOR', valor);
                this.userStorageService.userInfo.codeString = valor;
                console.log('CODESTRING', this.userStorageService.userInfo.codeString);

                console.log('THIS.EMAIL', this.email);
                this.userStorageService.userInfo.email = this.email;
                console.log('EMAIL', this.userStorageService.userInfo.email);

                console.log('ENVIRONMENT.PREFIX', environment.applicationInfo.prefix);
                this.userStorageService.userInfo.prefijo = environment.applicationInfo.prefix;
                console.log('PREFIJO', this.userStorageService.userInfo.prefijo);

                this.globalVarsService.setClientInfo(this.userStorageService.userInfo);
                console.log('USERINFO', this.userStorageService.userInfo);

                this.userStorageService.saveUserInfo(this.userStorageService.userInfo)
                  .finally(() => {
                    this.globalVarsService.setClientInfo(this.userStorageService.userInfo);
                    this.navCtrl.navigateRoot(['/home']);
                    this.controllersIonicService.hideLoader().finally(() => {
                      this.controllersIonicService.presentToast('El registro fue exitoso');
                    });
                  });
                let loadPreferenceUserInfo = this.userStorageService.getUserInfo();
                loadPreferenceUserInfo.then((info: any) => {
                  console.log('LOAD USER INFO PREFERENCE', info);
                });
              });
          },
          error: (ex: any) => {
            console.error(JSON.stringify(ex));
            this.controllersIonicService.hideLoader().finally(() => {
              this.controllersIonicService.presentToast('Algo salio mal intentalo de nuevo o prueba más tarde.');
            });
          },
          complete: () => {
            console.log('succesfull registerAppClientRequest');
          }
        });
  }

  async postUpdate(updateClient: any) {
    console.log('postUpdate')
    console.log('postUpdate - updateClient', updateClient);
    this.SubUpdateAppClientRequest =
      this.plmClientsEngineService
        .updateAppClientRequest(updateClient).subscribe({
          next: () => {
            console.log('UPDATE', updateClient);
            this.userStorageService.updateUserInfo(updateClient)
              .finally(() => {
                this.controllersIonicService.hideLoader().finally(() => {
                  this.controllersIonicService.presentToast('Se actualizaron sus datos exitosamente');
                  this.navCtrl.navigateRoot(['/home']);
                });
              });
          },
          error: (ex: any) => {
            console.error(JSON.stringify(ex));
            this.controllersIonicService.hideLoader().finally(() => {
              this.controllersIonicService.presentToast('Algo salio mal intentalo de nuevo o prueba más tarde.');
            });
          },
          complete: () => { console.log('Succesful updateAppClientRequest'); }
        });
  }

  openResource(fileName: string) {
    this.inAppBrowserService.openResource(fileName, this.globalVarsService.getCountryKey());
  }
}
