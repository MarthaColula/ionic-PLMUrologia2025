import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { Platform } from '@ionic/angular';
import { environment } from 'src/environments/environment';

interface Scripts {
  name: string;
  src: string;
}

export const LocalJavaScriptsAllowed: Scripts[] = [
  { name: 'calculatorBusinessLogic', src: 'src/assets/js/calculatorBusinessLogic.js' }
];

export const ExternalJavaScriptsAllowed: Scripts[] = [
  { name: 'calculatorBusinessLogic', src: 'https://www.plmconnection.com/plmservices/Tools/Colombia/saluddelamujer/calculators/js/calculatorBusinessLogic.js' }
];


@Injectable({
  providedIn: 'root'
})
export class DynamicScriptLoaderService {

  private time: string;
  
  private renderer2: Renderer2
  private scripts: any = {};

  constructor(
    private plt: Platform,
    rendererFactory: RendererFactory2,
    @Inject(DOCUMENT) private document: Document,
  ) {

    this.time = '?t=' + new Date().getTime();
    
    this.renderer2 = rendererFactory.createRenderer(null, null);
    //TODO: Comment 'environment.production' for local test...
   /*if (environment.production) {

      ExternalJavaScriptsAllowed.forEach((script) => {
        console.log(script.name);
        console.log(script.src+this.time);
        this.scripts[script.name] = {
          loaded: false,
          src: script.src + this.time,
          id: script.name
        };
      });
      return;
    } */


    LocalJavaScriptsAllowed.forEach((script) => {
      this.scripts[script.name] = {
        loaded: false,
        src: script.src,
        id: script.name
      };
    }); 
  }

  async loadScript(name: string) {
    return await new Promise(async (resolve, reject) => {
      if (!this.scripts[name].loaded) {
        let htmlHead = this.document.head;
        let script = this.document.createElement('script');
        script.type = 'text/javascript';
        script.src = this.scripts[name].src;
        script.id = this.scripts[name].id;
        this.renderer2.appendChild(htmlHead, script);
        script.onload = () => {
          this.scripts[name].loaded = true;
          return resolve({ script: name, loaded: true, status: 'Loaded' });
        };
        script.onerror = (error: any) => {
          return reject({ script: name, loaded: false, status: 'Exception' })
        };
      } else {
        return resolve({ script: name, loaded: true, status: 'Already Loaded' });
      }
    });
  }

  removeScript(name: string) {
    return new Promise((resolve) => {
      if (this.scripts[name].loaded) {
        let script = this.document.getElementById(this.scripts[name].id);
        if (!script) {
          return resolve({ script: name, loaded: false, status: 'Dont exist script tags id' });
        }
        script.remove();
        this.scripts[name].loaded = false;
        resolve({ script: name, loaded: false, status: 'Remove' });
      }
      return resolve({ script: name, loaded: false, status: 'Dont exist script tags id' });
    });
  }

}
