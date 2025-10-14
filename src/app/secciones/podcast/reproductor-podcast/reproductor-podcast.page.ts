import { Component, OnInit } from '@angular/core';
import {
  PodcastService,
  ControllersIonicService,
  PlmAssetsEngineService,
  PlmTrackingEngineService,
  FirebaseAnalyticsService,
  GlobalvarsService
} from 'src/app/services/indexServices';
import { AudioTrack } from 'capacitor-plugin-playlist';
import { Platform } from "@ionic/angular";
import { Router, ActivatedRoute } from "@angular/router";
import { Subscription, BehaviorSubject } from "rxjs";
import { IInfoTracking } from 'src/app/interfaces/PLMTrackingEngine';
import { InfoEntities, SearchType } from 'src/app/interfaces/catalogs';


@Component({
  selector: 'app-reproductor-podcast',
  templateUrl: './reproductor-podcast.page.html',
  styleUrls: ['./reproductor-podcast.page.scss'],
  standalone: false,
})
export class ReproductorPodcastPage implements OnInit {


  trackId: any;
  assetUrl: any;
  title: any;
  artist: any;
  album: any;
  albumArt: any;
  electronicId: any;

  duration: number = 0;
  currentTime: number = 0;
  progress: number;
  isPlaying: boolean = false;
  isSeeking: boolean = false;

  podcastData: any;
  durationValidRange: number;
  maxValue: number = 0;
  podPlay: boolean = false;

  intents = 0;

  subQueryParams: Subscription;
  exceptionPodcast = new BehaviorSubject<boolean>(false);
  getInformationSubPodcast: Subscription;
  successRequest = new BehaviorSubject<boolean>(false);
  exception = new BehaviorSubject<boolean>(false);
  getInformationSub: Subscription;

  showBanner: boolean | undefined;
   closeBanner: boolean;

  constructor(
    public controllersIonicService: ControllersIonicService,
    public plmAssetsEngineService: PlmAssetsEngineService,
    public plmTrackingEngineService: PlmTrackingEngineService,
    public firebaseAnalyticsService: FirebaseAnalyticsService,
    public globalVarsService: GlobalvarsService,
    public podcastService: PodcastService,
    public plt: Platform,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.getParams();
  }

  ngOnInit() {
    this.podcastService.currentTime$.subscribe(t => {
      if (!this.isSeeking) {
        this.currentTime = t;
      }
    });
    this.podcastService.duration$.subscribe(d => {
      this.duration = d;
      this.maxValue = d;
    });

    this.podcastService.progressPercent$.subscribe(p => this.progress = p);
  }

  async getParams() {
    const params = this.router.getCurrentNavigation()?.extras.state;
    this.subQueryParams = this.route.queryParams.subscribe(async () => {
      console.log('getParams - params', params);
      if (params && params['deeplinkId'] !== undefined) {
        console.log('params incluye DL', params);
        const id = params['deeplinkId'];
        console.warn('ReproductorPodcast', '***  getPodcastByIdDeepLink()...');
        this.getPodcastByIdDeepLink(id);
      } else if (params && params['podcast']) {
        this.podcastData = params['podcast'];
        this.album = this.podcastData.Description; // ElectronicDescription;
        this.assetUrl = this.podcastData.BaseUrl + this.podcastData.FileName;
        this.title = this.podcastData.ElectronicTitle; // ElectronicTitle;

        this.trackId = this.podcastData.ElectronicId.toString();
        //this.albumArt = this.podcastData.AlbumArt;
        //this.artist = this.podcastData.Artist;

        const track: AudioTrack = {
          trackId: this.trackId,
          assetUrl: this.assetUrl,
          title: this.title,
          artist: 'PLM Urología',
          album: this.album,
          albumArt: 'https://www.plmconnection.com/plmservices/Tools/Mexico/podcast/thumbnails/plmmedmov5_iconoposdcast_fibrilacionliomont_20240620.png',
        };

        await this.podcastService.initialize();
        await this.podcastService.addTrack(track);

        this.electronicId = this.podcastData.ElectronicId;
        this.successRequest.next(true);
        this.exception.next(false);
      }

    });
  }

   ionViewWillEnter() {
    this.showBanner = true;
  }

   ionViewDidLeave() {
    this.showBanner = false;
  }
  
   bannerClose(event) {
    console.log({ close: event });
    this.closeBanner = event;
  }

  formatTime(time: number): string {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${this.pad(minutes)}:${this.pad(seconds)}`;
  }

  pad(num: number): string {
    return num < 10 ? '0' + num : num.toString();
  }

  onRangeChange(event: any) {
    const position = event.detail.value;
    this.isSeeking = true;
    this.currentTime = position; // actualiza la vista
    this.podcastService.seekTo(position).then(() => {
      this.isSeeking = false;
    });
  }

  play() {
    this.podcastService.play();
    this.isPlaying = true;
    this.podPlay = true;
  }

  pause() {
    this.podcastService.pause();
    this.isPlaying = false;
  }

  forward() {
    const newPosition = this.currentTime + 5;
    const max = this.duration || 0;
    const updatePosition = Math.min(newPosition, max);
    this.podcastService.seekTo(updatePosition);
  }

  back() {
    const newPosition = this.currentTime - 5;
    const updatePosition = Math.max(newPosition, 0);
    this.podcastService.seekTo(updatePosition);
  }

  stop() {
    this.podcastService.stop();
  }

  next() {
    this.podcastService.next();
  }

  previous() {
    this.podcastService.previous();
  }

  ///////////// REP.PODCAST DEEPLINK ///////////

  getPodcastByIdDeepLink(id: any) {
    this.exception.next(false);
    this.controllersIonicService.showLoader().finally(() => {
      console.warn('ReproductorPodcast', '***  getPodcastByIdDeepLink(' + id + ')...');
      this.getInformationSub = this.plmAssetsEngineService
        .getElectronicInformationByIdDeepLink(id)
        .subscribe({
          next: async (podcast: any) => {
            console.log('ReproductorPodcast', podcast);
            if (podcast) {
              this.addTrackingActivity(podcast);
              this.podcastData = podcast;
              this.album = this.podcastData.ElectronicDescription;
              this.assetUrl = this.podcastData.BaseUrl + this.podcastData.FileName;
              this.title = this.podcastData.ElectronicTitle;
              this.trackId = this.podcastData.ElectronicId.toString();
              //this.albumArt = this.podcastData.AlbumArt;
              //this.artist = this.podcastData.Artist;

              const track: AudioTrack = {
                trackId: this.trackId,
                assetUrl: this.assetUrl,
                title: this.title,
                artist: 'PLM Urología',
                album: this.album,
                albumArt: 'https://www.plmconnection.com/plmservices/Tools/Mexico/podcast/thumbnails/plmmedmov5_iconoposdcast_fibrilacionliomont_20240620.png',
              };

              await this.podcastService.initialize();
              await this.podcastService.addTrack(track);

              this.electronicId = this.podcastData.ElectronicId;
              this.successRequest.next(true);
              this.exception.next(false);
            }
            else {
              this.controllersIonicService.hideLoader().finally(() => {
                this.successRequest.next(false);
                this.exception.next(true);
              });
            }
          },
          error: () => {
            this.controllersIonicService.hideLoader().finally(() => {
              if (this.intents < 1) {
                this.intents++;
                this.retry(id);
              } else {
                this.successRequest.next(false);
                this.exception.next(true);
              }
            });
          },
          complete: () => {
            this.controllersIonicService.hideLoader().finally(() => {
              this.controllersIonicService.hideLoader();
              this.successRequest.next(true);
              const titleReplace = this.podcastData.ElectronicTitle.split(' ').join('_');
              this.trackingFATitle(titleReplace);
            });
          },
        });
    });
  }

  addTrackingActivity(electronicInformation: any) {
    console.log('addTrackingActivity - electronicInformation', electronicInformation);
    const today = new Date().getTime();
    let latitude = "";
    let longitude = "";
    let ip: any;
    const clientPosition = this.globalVarsService.getGeolocationClient();
    const clientAddress = this.globalVarsService.getClientAddressIp();
    if (clientPosition) {
      latitude = clientPosition.latitude.toString();
      longitude = clientPosition.longitude.toString();
    }
    if (clientAddress) {
      ip = clientAddress.ip;
    }
    const data: IInfoTracking = {
      BranchId: null,
      CodeString: this.globalVarsService.getClientInfoValue()?.codeString,
      Date: "/Date(" + today.toString() + "+0200)/",
      ElectronicId: electronicInformation.ElectronicId,
      EntityId: InfoEntities.Podcast,
      EventId: null,
      Label: 'ReproductorPodcast - Deeplink',
      LabelValue: electronicInformation.ElectronicTitle.trim(),
      SearchAddressIP: ip,
      SearchLatitude: latitude,
      SearchLongitude: longitude,
      SearchText: "",
      SearchTypeId: SearchType.parametrizado,
      SourceId: this.globalVarsService.getInfoTrackingSource(),
    };
    this.plmTrackingEngineService.addInfoTracking(data);
    console.log('Tracking PodcastDL ', data);
  }

  trackingFATitle(title: string) {
    const titleReplace = title.split(' ').join('_');
    console.log('ReproductorPodcast', { title: titleReplace });
    this.firebaseAnalyticsService.trackingFATitle(titleReplace);
  }

  retry(retryID: any) {
    setTimeout(() => {
      console.warn('***  retry - intents: ' + this.intents);
      if (this.intents <= 1) {
        console.warn('***  retry - getPodcastByIdDeepLink()...');
        this.getPodcastByIdDeepLink(retryID);
      } else {
        this.successRequest.next(false);
        this.exception.next(true);
      }
    }, 500);
  }

}
