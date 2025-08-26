import { Injectable } from '@angular/core';
import { Playlist } from 'capacitor-plugin-playlist';
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PodcastService {

  currentTime$ = new BehaviorSubject<number>(0);
  duration$ = new BehaviorSubject<number>(0);
  progressPercent$ = new BehaviorSubject<number>(0);
  isPlaying$ = new BehaviorSubject<boolean>(false);
  durationValidRange$ = new BehaviorSubject<number>(0);

  interval: any = null;

  constructor() {
    Playlist.addListener('status', (data: any) => {
      const update = data?.status?.value;
      
      if (update) {
        this.currentTime$.next(update.currentPosition);
        console.log('updateCurrentTime',update.currentPosition);
        this.duration$.next(update.duration);
        this.progressPercent$.next(update.playbackPercent);
        this.isPlaying$.next(update.status === 'playing');
      }
    });
  }

  startTickTimer() {
    console.log('startTickTimer - init');
    this.stopTickTimer(); // Este es para evitar duplicados
    this.interval = setInterval(() => {
      console.log('startTickTimer - this.interval', this.interval);
      if (this.isPlaying$.value) {
        console.log('startTickTimer - this.isPlaying$', this.isPlaying$.value);
        const current = this.currentTime$.value + 1;
        const duration = this.duration$.value;
        this.durationValidRange$.next(duration);
        console.log('this.durationValidRange', this.durationValidRange$);
        if (current <= duration) {
          console.log('startTickTimer - current/duration', current, duration);
          this.currentTime$.next(current);
          const percent = (current / duration) * 100;
          console.log('startTickTimer - percent', percent);
          this.progressPercent$.next(percent);
        }
      }
    }, 1000);
  }
  
  stopTickTimer() {
    console.log('stopTickTimer - init');
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
      console.log('stopTickTimer - this.interval', this.interval);
    }
  }

  async initialize() {
    await Playlist.initialize();
  }

  async addTrack(track: any) {
    await Playlist.addItem({ item: track });
  }

  async play() {
    await Playlist.play();
    this.isPlaying$.next(true);
    this.startTickTimer(); // INICIA el contador
  }

  async pause() {
    await Playlist.pause();
    this.isPlaying$.next(false);
    this.stopTickTimer(); // DETIENE el contador
  }

  async stop() {
    await Playlist.pause();
    await Playlist.seekTo({ position: 0 });
  }

  async next() {
    await Playlist.skipForward();
  }

  async previous() {
    await Playlist.skipBack();
  }

  async seekTo(position: number) {
    await Playlist.seekTo({ position });
  }

}


