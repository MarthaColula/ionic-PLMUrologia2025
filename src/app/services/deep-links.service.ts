import { Injectable} from "@angular/core";
import { NgZone } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { App, URLOpenListenerEvent } from '@capacitor/app';



@Injectable({
  providedIn: "root",
})
export class DeepLinksService {

  deeplinkMatch: boolean = false;

  constructor(
    private router: Router,
    private zone: NgZone,
  ) {}

  //DeepLink
    checkDeepLinkReceived() {
      console.log('checkDeepLinkReceived');
      return new Promise<void>((resolve, reject) => {
        // Evento "appUrlOpen" del deeplink
        App.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
          console.log('Deeplink recibido(service)', event);
          this.zone.run(() => {
            const slug = event.url.split("plmsaluddelamujercol://").pop();
            console.log('Slug deeplink', slug);
            if (slug) {
              console.log('Deeplink válido', slug);
              const parts = slug.split("/"); // ['', 'atlas', '19872']
              console.log('Slug parts', parts);
              console.log('Slug parts length', parts.length);
              if (parts.length === 2){
                //Si el deeplink se dirige a un ID
                console.log('deeplink - ID');
                const path = `/${parts[0]}`; 
                const id = Number(parts[1]); 
                console.log('Slug path', path);
                console.log('slug id', id);
                const navigationExtras: NavigationExtras = {
                  state: {
                    deeplinkId: id,
                  }
                };
                this.deeplinkMatch = true;
                console.log('DEEPLINK ID NAV EXTRAS', navigationExtras);
                this.router.navigateByUrl(path, navigationExtras);
                resolve(); 
              } else if( parts.length > 2){
                //Si el deepLink es a IPPA
                console.log('deeplink - IPPA');
                const path = `/${parts[0]}`;
                const categoryId = Number(parts[1]); 
                const divisionId = Number(parts[2]); 
                const pharmaFormId = Number(parts[3]); 
                const productId = Number(parts[4]); 
                console.log('Slug', slug);
                console.log('Slug categoryId', categoryId);
                console.log('Slug divisionId', divisionId);
                console.log('Slug pharmaFormId', pharmaFormId);
                console.log('Slug productId', productId);
                //const ippaPath = path+'/'+categoryId+'/'+divisionId+'/'+pharmaFormId+'/'+productId;
                const navigationExtras: NavigationExtras = {
                  state: {
                    categoryId: categoryId,
                    divisionId: divisionId,
                    pharmaFormId: pharmaFormId,
                    productId: productId
                  }
                };
                this.deeplinkMatch = true;
                console.log('DEEPLINK IPPA NAV EXTRAS', navigationExtras);                
                this.router.navigateByUrl(slug);
                resolve(); 
              } else {
                // Si el deeplink se dirige a una seccion general
                console.log('deeplink - SECCIÓN');
                this.deeplinkMatch = true;
                this.router.navigateByUrl(slug);
                resolve(); 
              }
            } else {
              console.log('Deeplink no válido');
              this.deeplinkMatch = false;
              resolve();
            }
          });
        });

        this.deeplinkMatch = false;
        resolve();
        
      });
    }


}
