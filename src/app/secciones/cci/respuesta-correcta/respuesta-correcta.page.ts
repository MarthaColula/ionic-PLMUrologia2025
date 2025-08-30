import { Component, OnInit } from "@angular/core";
import { BehaviorSubject, Subscription } from "rxjs";
import { AlertController, Platform } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ControllersIonicService, GlobalvarsService, SocialService, PlmClientsEngineService } from "src/app/services/indexServices"
//DeepLinksService


@Component({
  selector: 'app-respuesta-correcta',
  templateUrl: './respuesta-correcta.page.html',
  styleUrls: ['./respuesta-correcta.page.scss'],
  standalone: false,
})
export class RespuestaCorrectaPage implements OnInit {

  title: any;
  reference: any;
  authors: any;

  logo: any;
  logoImage: any;
  showLogoFile!: boolean;

  discussion: any;
  discussionFile: any;
  discussionImage: any;
  showDiscussionFile!: boolean;

  authorsPhoto: any = environment.authorsPhotos;

  subQueryParams!: Subscription;
  successRequest = new BehaviorSubject<boolean>(false);
  exception = new BehaviorSubject<boolean>(false);

  constructor(
    /*private alertController: AlertController,
    private plt: Platform,*/
    private activatedRoute: ActivatedRoute,
    private router: Router,
    /*private socialService: SocialService,
    private plmClientEngineService: PlmClientsEngineService,
    private controllersIonicService: ControllersIonicService,
    private globalVarsService: GlobalvarsService,
    private _deepLinksService: DeepLinksService,*/
  ) {
    this.getParams()
  }

  ngOnInit() { }

  async getParams() {
    const params = this.router.getCurrentNavigation()!.extras.state!;
    console.log('>>> Params', params);
    console.warn('Respuesta Corrrecta', '*** params: ' + JSON.stringify(params));
    this.subQueryParams = this.activatedRoute.queryParams.subscribe(() => {
      if (params["deeplink"] !== undefined) {
        let id = params["deeplink"].id;
        this.title = 'Caso Clinico'
      } else {

        this.title = params["title"];
        this.discussion = params["discussion"],
          this.discussionFile = params["discussionFile"],
          this.reference = params["reference"],
          this.authors = params["authors"],
          this.logo = params["logo"]

        this.successRequest.next(true);
        this.exception.next(false);
      }

      if (this.discussionFile === null || this.discussionFile === '') {
        this.showDiscussionFile = false;
      } else {
        this.showDiscussionFile = true;
        this.discussionImage = environment.clinicalCase + this.discussionFile;
      }

      if (this.logo === null || this.logo === '') {
        this.showLogoFile = false;
      } else {
        this.showLogoFile = true;
        this.logoImage = environment.clinicalCase + this.logo;
      };

    });
  }

}
