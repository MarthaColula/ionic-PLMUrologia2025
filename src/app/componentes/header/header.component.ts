import { Component, Input, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { PopmenuComponent } from '../popmenu/popmenu.component';
import { IonIcon, IonHeader, IonButtons } from "@ionic/angular/standalone";
import { PushNotificationsService } from 'src/app/services/push-notifications.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: false,
})
export class HeaderComponent implements OnInit {

  @Input() changePrefix = false;

    constructor( 
    private popoverCtrl: PopoverController,
    protected pushNotificationsService: PushNotificationsService
  ) { }

  ngOnInit() {}
  
  async mostrarPop() {
    const popover = await this.popoverCtrl.create({
      component: PopmenuComponent,
      event: event,
      mode: 'ios',
      cssClass: "popover_class"
    });

    await popover.present();
  }

}