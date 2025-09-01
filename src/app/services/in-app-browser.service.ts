import { Injectable } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { AppLauncher } from '@capacitor/app-launcher';
import { Browser } from '@capacitor/browser';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InAppBrowserService {

  public isCapacitor = false;

  constructor(
    private router: Router,
    private plt: Platform
  ) {
    if (this.plt.is('capacitor')) {
      this.isCapacitor = true; 
    }
  }

  openResource(fileName: string, countryKey: string, otherPath?: string) {
    const endPointTools = environment.appTools;
    let filePath = '';
    if (!otherPath) {
      const regionName = this.getRegionNameByCountryKey(countryKey);
      filePath = `${endPointTools.protocol}://${endPointTools.server}/${endPointTools.pathName}/${regionName}/${endPointTools.folderName}/resources/`;
    } else {
      filePath = otherPath;
    }

    if (fileName === 'privacyNotice.html' || fileName === 'termsAndConditions.html' || fileName === 'credits.html') {
      this.open(filePath + fileName, undefined, 'body{margin-top: 25px;margin-left: 25px;margin-right: 25px;}');
      console.warn('InAppBrowser', '1 ->  ', filePath + fileName);
    } else {
      this.open(filePath + fileName);
      console.warn('InAppBrowser', '2 ->  ', filePath + fileName);
    }
  }

  async open(url: string, target?: string, codeCSS?: string) {
    console.warn('InAppBrowser', '***  open  ***');
    try {
      console.warn('InAppBrowser', '**  url: ' + url);
      if (url.startsWith('plmUrologia://')) {
        if (this.plt.is('android')) {
          this.processDeepLink(url);
        } else {
          console.warn('InAppBrowser', '**  AppLauncher.openUrl()...');
          await AppLauncher.openUrl({ url });
        }
        return
      }
      if (this.plt.is('android') && url.includes('.pdf')) {
        target = '_system';
      }
      const options = {
        toolbarColor: '#000000',
      };
      if (target === '_blank') {
        console.warn('InAppBrowser', '**  Browser.open('+ url +','+ target +')...');
        await Browser.open({ url, windowName: target });
      } else {
        console.warn('InAppBrowser', '**  Browser.open('+ url +')...');
        await Browser.open({ url });
      }
    } catch (error) {
      console.error('InAppBrowser', 'Error abriendo el navegador', error);
      if (url.startsWith('http')) {
        await AppLauncher.openUrl({ url });
      }
    }
  }

  
  private processDeepLink(url: string) {
    console.warn('InAppBrowser', '***  processDeepLink  ***');
    const url_push = url.toString();
    console.log('InAppBrowser', 'showNotification url_push: ' + url_push);
    if(url_push.includes('plmUrologia')){
      const slug = url_push.split("plmUrologia://").pop();
      if (slug) {
        console.log('InAppBrowser', 'Deeplink válido: ' + slug);
        const parts = slug.split("/"); // ['', 'atlas', '19872']
        if (parts.length === 2){
          //Si el deeplink se dirige a un ID
          console.log('InAppBrowser', 'deeplink - ID');
          const path = `/${parts[0]}`;
          const id = Number(parts[1]);
          const navigationExtras: NavigationExtras = {
            state: {
              deeplinkId: id,
            }
          };
          //this.deeplinkMatch = true;
          console.warn('InAppBrowser', 'router.navigateByUrl()...');
          this.router.navigateByUrl(path, navigationExtras);
        } else if( parts.length > 2){
          //Si el deepLink es a IPPA
          console.warn('InAppBrowser', 'deeplink - IPPA');
          const path = `/${parts[0]}`;
          const categoryId = Number(parts[1]);
          const divisionId = Number(parts[2]);
          const pharmaFormId = Number(parts[3]);
          const productId = Number(parts[4]);
          const navigationExtras: NavigationExtras = {
            state: {
              categoryId: categoryId,
              divisionId: divisionId,
              pharmaFormId: pharmaFormId,
              productId: productId
            }
          };
          //this.deeplinkMatch = true;
          console.warn('InAppBrowser', 'router.navigateByUrl(IPPA)...');
          this.router.navigateByUrl(slug, );
        } else {
          // Si el deeplink se dirige a una seccion general
          console.log('InAppBrowser', 'deeplink - SECCIÓN');
          //this.deeplinkMatch = true;
          console.warn('InAppBrowser', 'router.navigateByUrl(slug)...');
          this.router.navigateByUrl(slug);
        }
      } else {
        console.warn('InAppBrowser', 'Deeplink no válido');
        //this.deeplinkMatch = false;
      }
    }
  }

  private getRegionNameByCountryKey(countryKey: string) {
    let regionName = '';
    switch (countryKey) {
      case 'CAD': 
      regionName = 'Centroamerica'; 
      break;
      case 'CHI': 
      regionName = 'Chile'; 
      break;
      case 'COL': 
      regionName = 'Colombia'; 
      break;
      case 'ECU': 
      regionName = 'Ecuador';
      break;
      case 'MEX': 
      regionName = 'Mexico'; 
      break;
      case 'PER': 
      regionName = 'Peru'; 
      break;
      case 'WTI': 
      regionName = 'West Indies'; 
      break;
      default: 
      regionName = 'Mexico'; 
      break;
    }
    return regionName;
  }

  private openLocalDocumentAndroidTest() {
    const assetDirectory = 'assets/resources/MEX';
    console.warn('InAppBrowser', assetDirectory);
    if (this.plt.is('android')) {
      window.open('file:///android_asset/www/assets/resources/MEX/termsAndConditions.html', '_blank');
    }
  }
}
