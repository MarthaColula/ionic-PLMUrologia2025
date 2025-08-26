import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { FirebaseAnalytics } from '@capacitor-community/firebase-analytics';
import { Device } from '@capacitor/device';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FirebaseAnalyticsService {
  
  private analyticsInitialized = false;
  analyticsEnabled = true;
  
  constructor( private router: Router) {
    //this.initFb();
  }
  
  async initFb() {
    try {
      if ((await Device.getInfo()).platform == 'web') {
        FirebaseAnalytics.initializeFirebase(environment.firebaseConfig);
      }
      this.analyticsInitialized = true;
      console.log('Firebase Analytics initialized successfully');
      
      this.setupRouterTracking();
      await this.setCollectionEnabled(this.analyticsEnabled);
      /*
      console.log('FirebaseAnalyticsService', '>>> START Firebase Analytics');
      this.router.events
      .subscribe((event: any) => {
        if (event instanceof NavigationStart) {
          console.warn('FirebaseAnalyticsService', { urlFA: event.url });
          this.setCurrentScreen(event.url);
        }
      });
      */
    } catch (error) {
      console.error('Failed to initialize Firebase Analytics:', error);
    }
  }

  public trackFAEventClick(nameSection: string, title: string) {
    console.warn('FirebaseAnalyticsService', 'click ', nameSection + title);
    this.logEvent( 'Click_' + nameSection, {Title: title});
  }
  
  public trackingFATitle(title: any) {
    const titleReplace = title.split(' ').join('_');
    console.warn('FirebaseAnalyticsService', 'title: ' + titleReplace );
    this.setCurrentScreen(titleReplace);
  }

  private setupRouterTracking() {
    console.warn('FirebaseAnalyticsService', '>>> START Firebase Analytics');
    /*
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.setCurrentScreen(event.urlAfterRedirects || event.url);
    });
    */
    this.router.events
      .subscribe((event: any) => {
        if (event instanceof NavigationStart) {
          console.warn('FirebaseAnalyticsService', { urlFA: event.url });
          this.setCurrentScreen(event.url);
        }
      });
  }
  
  private async ensureInitialized() {
    if (!this.analyticsInitialized) {
      throw new Error('Firebase Analytics is not initialized');
    }
  }

  async setUserId(userId: string) {
    try {
      await this.ensureInitialized();
      await FirebaseAnalytics.setUserId({
        userId: userId
      });
    } catch (error) {
      console.error('Error setting user ID:', error);
    }
  }

  async setUserProperty(name: string, value: string) {
    try {
      await this.ensureInitialized();
      await FirebaseAnalytics.setUserProperty({
        name,
        value
      });
    } catch (error) {
      console.error('Error setting user property:', error);
    }
  }

  async logEvent(name: string, params?: any) {
    try {
      await this.ensureInitialized();
      await FirebaseAnalytics.logEvent({
        name,
        params
      });
    } catch (error) {
      console.error('Error logging event:', error);
    }
  }

  async setCurrentScreen(screenName: string) {
    try {
      await this.ensureInitialized();
      await FirebaseAnalytics.setScreenName({
        screenName: screenName,
        nameOverride: screenName
      });
    } catch (error) {
      console.error('Error setting screen name:', error);
    }
  }

  async setCollectionEnabled(enabled: boolean) {
    try {
      await this.ensureInitialized();
      await FirebaseAnalytics.setCollectionEnabled({
        enabled
      });
      console.log('setCollectionEnabled--->');
    } catch (error) {
      console.error('Error setting collection enabled:', error);
    }
  }

}
