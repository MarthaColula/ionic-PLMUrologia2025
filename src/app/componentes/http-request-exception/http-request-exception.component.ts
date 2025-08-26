import { Component, OnInit, Output, EventEmitter, Input, AfterViewInit } from '@angular/core';
import { ControllersIonicService } from '../../services/indexServices';

@Component({
  selector: 'app-http-request-exception',
  templateUrl: './http-request-exception.component.html',
  styleUrls: ['./http-request-exception.component.scss'],
  standalone: false,
})
export class HttpRequestExceptionComponent implements OnInit, AfterViewInit {

  @Output() retryNow: EventEmitter<void> = new EventEmitter<void>();
  @Input() sectionName: string;
  @Input() showAlert: any = false;
  
  showMessage: boolean;

  constructor(private controllersIonicService: ControllersIonicService) { }

  ngOnInit() { }

  ngAfterViewInit(): void {
    if (this.showAlert) {
      this.alertRetry();
    }
  }

  public tryAgain() {
    this.retryNow.emit();
  }

  private alertRetry() {
    this.controllersIonicService.presentAlertRetry(this.sectionName)
      .then((values: any) => {
        const data = values.data;
        if (data) {
          console.warn({data: data});
          const reintentar: boolean = values.data.opcion;
          if (reintentar) {
            this.retryNow.emit();
          } else {
            this.showMessage = true;
          }
        }
      });
  }

}
