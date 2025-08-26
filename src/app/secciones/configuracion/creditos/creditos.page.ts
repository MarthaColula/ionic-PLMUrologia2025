import { Component, OnInit } from '@angular/core';
import { InAppBrowserService, GlobalvarsService, ConnectionService } from '../../../services/indexServices';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-creditos',
  templateUrl: './creditos.page.html',
  styleUrls: ['./creditos.page.scss'],
  standalone: false,
})
export class CreditosPage implements OnInit {

  protected version: string;
  protected year: number;
  protected applicationName: string;

  constructor(
    private inAppBrowser: InAppBrowserService,
    private globalVars: GlobalvarsService,
    private connectionService: ConnectionService,
  ) {
    this.version = environment.applicationInfo.version;
    this.year = new Date().getFullYear();
    this.applicationName = environment.applicationInfo.name;
  }

  ngOnInit() { }

  async openResource(fileName: string) {
    if (await this.connectionService.isConnected()) {
      this.inAppBrowser.openResource(fileName, this.globalVars.getCountryKey());
    } else {
      this.connectionService.displayWarningMsg('Créditos');
    }
  }

}
