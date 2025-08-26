import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss'],
  standalone: false,
})
export class SpinnerComponent implements OnInit {

  loader: any = {};
  
  constructor() {
    if (environment.applicationInfo.loaderSponsor) {
      this.loader = {
        default: false,
        sponsor: true
      };
    } else {
      this.loader = {
        default: true,
        sponsor: false
      };
    }
  }

  ngOnInit() {}

}
