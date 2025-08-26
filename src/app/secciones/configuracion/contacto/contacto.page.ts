import { Component, OnDestroy, OnInit } from '@angular/core';
import { EmailComposer } from 'capacitor-email-composer';
import { CallNumber } from 'capacitor-call-number';
import { Browser } from '@capacitor/browser';
import { PlmClientsEngineService, GlobalvarsService, ControllersIonicService } from '../../../services/indexServices';
import { IEmail } from '../../../interfaces/models';
import { Subscription, BehaviorSubject } from 'rxjs';
import { Capacitor } from '@capacitor/core';


@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.page.html',
  styleUrls: ['./contacto.page.scss'],
  standalone: false,
})
export class ContactoPage implements OnInit, OnDestroy{

  private subContactRequest!: Subscription;
  protected exception = new BehaviorSubject<boolean>(false);
  protected response: any;
  private result!: Array<any>;

  constructor(
    private globalVars: GlobalvarsService,
    private plmClientsEngineService: PlmClientsEngineService,
    private controllersIonicService: ControllersIonicService,
  ) { }

  ngOnInit() { }

  ngOnDestroy(): void {
    if (this.subContactRequest) {
      this.subContactRequest.unsubscribe();
    }
  }

  ionViewWillEnter() {
    this.controllersIonicService.showLoader()
      .finally(() => {
        this.ngOnDestroy();
        this.checkResultService();
      });
  }


  async sendEmail() {
    const checkEmailAvailability = await EmailComposer.hasAccount();
    const hasAccount = await checkEmailAvailability;

    if (!hasAccount) {
      console.log('No hay cuenta de email configurada en el dispositivo.');
      return;
    }
    try {
      const result = await EmailComposer.open({
        to: this.response.getContactResult.ContactEmail,
        subject: 'Comentarios y Sugerencias',
        isHtml: false,
        //attachments: [] // Añadir archivos adjuntos aquí
        //cc: ['copia@example.com'],
        //bcc: ['copiaoculta@example.com'],
        //body: 'Contenido del email',
      });
      console.log('Email abierto.', result);

    } catch (error) {
      console.error('Error al abrir el email.', error);
    }
  }

  async callNumber() {
    console.log('CALL NUMBER');
    let phoneNumber = '' + this.response.getContactResult.Lada + this.response.getContactResult.PhoneOne;
    phoneNumber = phoneNumber.replace(/[^0-9]/g, '');
    console.log('PHONE NUMBER', phoneNumber);
    try {
      const result = await CallNumber.call({ number: phoneNumber });
      console.log('Contacto', 'successfull CallNumber', result);
    } catch (err) {
      console.log('Ocurrió un problema. No se ha iniciado la llamada', err);
    }
  }

  getContact(countryKey: string) {
    console.warn('Contacto', 'plmClientsEngineService.getContactRequest()...')
    this.subContactRequest =
      this.plmClientsEngineService.getContactRequest(countryKey)
        .subscribe({
          next: () => { },
          error: ex => {
            this.controllersIonicService.hideLoader()
              .finally(() => {
                console.error('Contacto', ex);
                this.retry();
              });
          },
          complete: () => {
            console.log('Contacto', 'succesfull getContactRequest');
            this.checkResultService();
          }
        });
  }

  retry() {
    this.controllersIonicService.presentAlertRetry('Contacto')
      .then((values: any) => {
        console.error('Contacto', { values: values });
        const reintentar: boolean = values.data.opcion;
        if (reintentar) {
          this.exception.next(false);
          this.ionViewWillEnter();
        } else {
          this.exception.next(true);
        }
      })
      .catch(ex => {
        console.error('Contacto', ex);
      });
  }

  checkResultService() {
    this.result = this.plmClientsEngineService.getContact().getValue();
    console.log('Contacto', '***  result: ' + JSON.stringify(this.result));
    if (this.result && this.result.length > 0) {
      const indice = this.searchContactResultByCountry(this.globalVars.getCountryKey());
      if (this.result[indice].value.getContactResult) {
        this.response = this.result[indice].value;
        this.controllersIonicService.hideLoader();
      } else {
        console.log('Contacto', '***  getContactByDefault()...', this.response);
        this.getContactByDefault();
      }
    } else {
      console.log('Contacto', '***  getContact()...');
      this.getContact(this.globalVars.getCountryKey());
    }
  }

  searchContactResultByCountry(countryKey: string) {
    let indice: number = 0;
    if (Array.isArray(this.result)) {
      this.result.forEach((element, index) => {
        if (element.countryKey === countryKey) {
          indice = index;
        }
      });
    }
    return indice;
  }

  getContactByDefault() {
    if (this.subContactRequest) {
      this.subContactRequest.unsubscribe();
    }
    const indice = this.searchContactResultByCountry('MEX');
    console.error('Contacto', '***  indice: ' + indice);
    if (indice) {
      this.controllersIonicService.hideLoader();
      this.response = this.result[indice].value;
    } else {
      this.getContact('MEX');
    }
  }


}
