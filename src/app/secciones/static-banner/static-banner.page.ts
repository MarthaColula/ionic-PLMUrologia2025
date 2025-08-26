import { Component, OnInit, AfterViewInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Platform } from '@ionic/angular';
import { environment } from '../../../environments/environment';
import { DeepLinksService } from '../../services/deep-links.service';

@Component({
  selector: 'app-static-banner',
  templateUrl: './static-banner.page.html',
  styleUrls: ['./static-banner.page.scss'],
  standalone: false,
})
export class StaticBannerPage implements OnInit, AfterViewInit {

  navigationHome: boolean;
  staticBannerURL: string;
  time: string;

  constructor(
    protected plt: Platform,
    private navCtrl: NavController,
    private deepLinksService: DeepLinksService
  ) {
    this.staticBannerURL = environment.staticBannerURL;
    this.time = '?t=' + new Date().getTime();
    this.navigationHome = false;
  }

  ngOnInit() {
    setTimeout(() => {
      if (this.navigationHome === false) {
        if(this.deepLinksService.deeplinkMatch === true){ // matchdeeplink
          console.warn('No Redirige....');
        } else{
          console.warn('Redirige....');
          this.navCtrl.navigateRoot(['/home']);
        }
      }
    }, 5000);
  }

  ngAfterViewInit(): void {
    // this.deepLinksService.deeplinksSubscribe();
  }

  ionViewWillEnter() {
    console.warn('ionViewWillEnter');
  }

  errorLoadImage() {
    this.navigationHome = true;
   // this.navCtrl.navigateRoot(['/home']);
      console.log('this.deepLinksService.matchdeeplink', this.deepLinksService.deeplinkMatch);
      if(this.deepLinksService.deeplinkMatch === true){
        console.warn('No Redirige....');
      } else{
        console.warn('Redirige....');
        this.navCtrl.navigateRoot(['/home']);
      }
  }

}
