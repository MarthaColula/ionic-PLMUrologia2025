import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { AboutDataInfo } from '../../interfaces/models';

@Component({
  selector: 'app-about-data-accordion',
  templateUrl: './about-data-accordion.component.html',
  styleUrls: ['./about-data-accordion.component.scss'],
  standalone: false,

})
export class AboutDataAccordionComponent implements OnInit {

  @Input() aboutData: Array<any>;

  protected aboutDataItems?: AboutDataInfo[];

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit() {
    if (Array.isArray(this.aboutData)){
      console.log({aboutData: this.aboutData});
      this.aboutDataItems = [];
      this.aboutData.forEach((item) => {
        const constentSafeHtml = this.sanitizer.bypassSecurityTrustHtml(item.ContentHtmlString);
        this.aboutDataItems?.push({
          Title: item.Title,
          ContentHtmlString: item.ContentHtmlString,
          ConstentSafeHtml: constentSafeHtml
        });
      });
    }
  }

}
