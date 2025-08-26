import { Component, OnInit } from '@angular/core';
import { PushNotificationsService } from 'src/app/services/indexServices';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {

  constructor(
    private pushNotService: PushNotificationsService
  ) { }

  ngOnInit() {
    console.warn('Home', '***  initPushNotifications()...');
    this.pushNotService.initPushNotifications();
  }

}
