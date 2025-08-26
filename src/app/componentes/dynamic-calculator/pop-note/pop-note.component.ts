import { Component, OnInit, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ModalController } from '@ionic/angular';
import { UtilitiesCalculator } from '../../../interfaces/utilities-calculator';

@Component({
  selector: 'app-pop-note',
  templateUrl: './pop-note.component.html',
  styleUrls: ['./pop-note.component.scss'],
  standalone: false,
})
export class PopNoteComponent implements OnInit {

  @Input()
  utilities: UtilitiesCalculator;

  @Input() title: string;

  @Input() note: string;
  
  protected noteHTML: any;

  constructor(
    private sanitizer: DomSanitizer,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    if (this.validateContentHTMLinNote(this.note)) {
      this.noteHTML = this.getContentHTMLinNote(this.note);
    }
  }

  async closeModel() {
    const close: string = "Modal Removed";
    await this.modalCtrl.dismiss(close);
  }
  
  validateContentHTMLinNote(srtContent: string) {
    return (srtContent && this.utilities.validateStringIncludes(srtContent,this.utilities.getArrayElementsHTML()));
  }

  getContentHTMLinNote(srtContent: string) {
    return this.sanitizer.bypassSecurityTrustHtml(srtContent);
  }

}
