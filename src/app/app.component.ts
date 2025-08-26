import { Component } from '@angular/core';
import {
  UserStorageService,
  GlobalvarsService,
  InAppBrowserService,
  InteractionsService,
  DeepLinksService,
  FirebaseAnalyticsService,
  //PushNotificationsService,
} from './services/indexServices';
import { NavController, Platform } from '@ionic/angular';
import { SplashScreen } from '@capacitor/splash-screen';
import { environment } from 'src/environments/environment';
import { Capacitor } from '@capacitor/core';
import { NavigationExtras } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  deeplinkMatch: boolean = false;
  pushEnabled: boolean = false;

  constructor(
    //private pushNotificationsService: PushNotificationsService,
    private deeplinkService: DeepLinksService,
    private inAppBrowserService: InAppBrowserService,
    private globalVarsService: GlobalvarsService,
    private userStorageService: UserStorageService,
    private navCtrl: NavController,
    private platform: Platform,
    //private favoritesService: FavouritesService,
    private interactionService: InteractionsService,
    private fa: FirebaseAnalyticsService,
  ) {
    this.initializeApp()
  }

  ngOnInit() {
    console.log('AppComponent - OnInit');
  }

  initializeApp() {
    this.platform.ready()
      .then(async () => {

        console.warn('AppComponent', '**  startFirebaseAnalytics()...')

        document.addEventListener('deviceready', () => {
          SplashScreen.hide();
        });


        this.interactionService.initService().then(() => {
          console.warn('initService finish');
        });

        /////////////////////// FirebaeAnalytics ////////////////////
        // Set the collection enabled property when the app starts
        this.fa.setCollectionEnabled(true);
        console.warn('AppComponent', '**  initFb()...');
        this.fa.initFb();

        await this.getParams();

        this.globalVarsService.initialize()
          .finally(() => {
            console.log('getPlatform CAPACITOR', Capacitor.getPlatform());
          })
      });
  }

  async getParams(): Promise<void> {
    console.warn('AppComponent', '***  getParams  ***');
    try {
      console.warn('GetParams', '**  userStorageService.getUserInfo()()...');
      // Esperar a que se complete la primera promesa
      const info = await this.userStorageService.getUserInfo();
      console.warn('CapacitorPreference', '**  info: ' + JSON.stringify(info));

      if (info) {
        if (info.prefijo !== environment.applicationInfo.prefix) {
          console.log('info.prefijo', info.prefijo, 'appInfoPRefix', environment.applicationInfo.prefix);
          console.log('UPDATE DE PREFIJO');
          const navigationExtras: NavigationExtras = {
            state: {
              mail: info.email,
              prefix: environment.applicationInfo.prefix
            }
          };
          console.log('NAV EXTRAS', navigationExtras);
          await this.navCtrl.navigateRoot(['/perfil'], navigationExtras);
        } else {
          console.log('NO HAY UPDATE DE PREFIJO es igual (else)');
          console.log('Toda la información es correcta');
          console.log('Usuario existe en CapacitorPreference', info);
          this.globalVarsService.setClientInfo(info);
          console.warn('AppComponent', '**  codeString: ' + this.globalVarsService.getClientInfoValue().codeString);

          await this.deeplinkService.checkDeepLinkReceived();  // Esperamos la validación del deeplink
          // Si no hubo deeplink, redirigimos al home
          console.log('Si no hubo deeplink, redirigimos al home');
          if (!this.deeplinkService.deeplinkMatch) {
            await this.navCtrl.navigateRoot(['/home']);
            console.log('Redireccionando al Home');
          }
        }
      } else {
        console.warn('Usuario no existe en CapacitorPreference');
        console.log('Inicia verificación en NativeStorage');

        try {
          const nativeInfo = await this.userStorageService.loadUserInfo();
          console.warn('UserStorageService', '**  info: ', nativeInfo);

          if (nativeInfo) {
            console.log('Usuario existe en NativeStorage');
            // Se setea en Preference
            await this.userStorageService.saveUserInfo(nativeInfo);
            console.warn('AppComponent', '**  codeString: ' + this.globalVarsService.getClientInfoValue().codeString);

            // Comprobación de que la data se guardo en Preference
            const migratedInfo = await this.userStorageService.getUserInfo();
            console.log('Se trajo la información de NativeStorage a Preference', migratedInfo);

            if (migratedInfo.prefijo !== environment.applicationInfo.prefix) {
              console.log('UPDATE DE PREFIJO');
              const navigationExtras: NavigationExtras = {
                state: {
                  mail: migratedInfo.email,
                  prefix: environment.applicationInfo.prefix
                }
              };
              console.log('NAV EXTRAS', navigationExtras);
              await this.navCtrl.navigateRoot(['/perfil'], navigationExtras);
            } else {
              console.log('NO HAY UPDATE DE PREFIJO es difererente al prefix(else) 2 ');
              console.log('Toda la información es correcta');

              await this.deeplinkService.checkDeepLinkReceived();  // Esperamos la validación del deeplink
              await this.navCtrl.navigateRoot(['/home']);
              console.log('Redireccionando al Home');
            }
          } else {
            console.warn('Usuario Nuevo');
            await this.navCtrl.navigateRoot(['/registro']);
            console.log('Redireccionando a registro');
          }
        } catch (e) {
          console.warn('Error al cargar datos desde NativeStorage:', e);
          throw e; // Propagar el error
        }
      }
    } catch (error) {
      console.warn('Error en getParams:', error);
      throw error; // Propagar el error
    }
  }
}
