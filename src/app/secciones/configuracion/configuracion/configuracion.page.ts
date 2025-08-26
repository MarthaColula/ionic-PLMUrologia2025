import { Component, OnInit } from '@angular/core';
import { InAppBrowserService, GlobalvarsService, ConnectionService } from '../../../services/indexServices';

@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.page.html',
  styleUrls: ['./configuracion.page.scss'],
  standalone: false,
})
export class ConfiguracionPage implements OnInit {

  constructor(
    private globalVars: GlobalvarsService,
    private connectionService: ConnectionService,
    private inAppBrowserService: InAppBrowserService,
  ) { }
  
  ngOnInit() { }

  async openResource(fileName: string) {
    if (await this.connectionService.isConnected()) {
      this.inAppBrowserService.openResource(fileName, this.globalVars.getCountryKey());
    } else {
      if (fileName === 'privacyNotice.html') {
        this.connectionService.displayWarningMsg('Aviso de Privacidad');
      }
      if (fileName === 'termsAndConditions.html') {
        this.connectionService.displayWarningMsg('Términos y condiciones');
      }
    }
  }

}
