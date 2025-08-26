import { Component, OnInit, QueryList, ViewChildren, OnDestroy, AfterViewInit } from '@angular/core';
import { IonCheckbox } from '@ionic/angular';
import { PlmClientsEngineService, GlobalvarsService, ControllersIonicService } from '../../../services/indexServices';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-sugerencias',
  templateUrl: './sugerencias.page.html',
  styleUrls: ['./sugerencias.page.scss'],
  standalone: false,
})
export class SugerenciasPage implements OnInit, OnDestroy, AfterViewInit {

  @ViewChildren(IonCheckbox) checkBoxQueryList!: QueryList<IonCheckbox>;

  checkBoxs: any[] = [];
  indiceSelected: number = 0;

  private subCommentTypes!: Subscription;
  private subCheckBoxChange!: Subscription;
  private subAddClientCommen!: Subscription;

  comments: any;
  myInput: string = '';
  textArea = false;
  isenabled: boolean = false;

  constructor(
    private controllersIonicService: ControllersIonicService,
    private plmClientsEngineService: PlmClientsEngineService,
    private globalVarsService: GlobalvarsService) {
    const arrayComments = this.plmClientsEngineService.getCommentTypesByPrefix().getValue();
    console.warn({ arrayComments: arrayComments });
    if (Array.isArray(arrayComments) && arrayComments.length > 0) {
      this.comments = arrayComments;
    } else {
      this.getComment();
    }
  }

  ngOnInit() { }

  ngAfterViewInit(): void {
    this.checkBoxs = this.checkBoxQueryList.toArray();
    this.subCheckBoxChange =
      this.checkBoxQueryList.changes.subscribe(() => {
        this.checkBoxs = this.checkBoxQueryList.toArray();
      });
  }

  ngOnDestroy(): void {
    if (this.subCheckBoxChange) {
      this.subCheckBoxChange.unsubscribe();
    }
    if (this.subCommentTypes) {
      this.subCommentTypes.unsubscribe();
    }
    if (this.subAddClientCommen) {
      this.subAddClientCommen.unsubscribe();
    }
  }

  async getComment() {
    this.controllersIonicService.showLoader().finally(() => {
      this.subCommentTypes =
        this.plmClientsEngineService
          .getCommentTypesByPrefixRequest(this.globalVarsService.getDeviceInfo().TargetName, environment.applicationInfo.prefix)
          .subscribe({
            next: () => {
              const arrayComments = this.plmClientsEngineService.getCommentTypesByPrefix().getValue();
              if (Array.isArray(arrayComments)) {
                this.comments = arrayComments;
              } else {
                this.comments = [];
              }
              console.warn({ comments: this.comments });
            },
            error: () => {
              this.controllersIonicService.hideLoader()
                .finally(() => {
                  this.comments = [];
                  console.warn({ comments: this.comments });
                });
            },
            complete: () => {
              this.controllersIonicService.hideLoader();
            }
          });
    });
  }

  textComent() {
    if (this.myInput.trim().length >= 8) {
      this.textArea = true;
    } else {
      this.textArea = false;
      this.controllersIonicService.presentToast('Ingrese el comentario, con al menos 8 caracteres, para continuar.');
    }
    this.validationInput();
  }

  selectedComent(index: number) {
    this.indiceSelected = index;
    this.checkBoxs.forEach((item: IonCheckbox, indice) => {
      if (indice !== index) {
        item.checked = false;
        item.disabled = false;
      } else {
        item.disabled = true;
      }
    });
    this.validationInput();
  }

  validationInput() {
    if (this.indiceSelected >= 0 && this.textArea === true) {
      this.isenabled = true;
    } else {
      this.isenabled = false;
    }
  }

  sendComment() {
    this.ngOnDestroy();
    this.controllersIonicService.showLoader()
      .finally(() => {
        let userComment = this.myInput.trim();
        userComment = userComment.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
        const commentTypeId = this.comments[this.indiceSelected].CommentTypeId;
        const branchId = this.comments[this.indiceSelected].BranchId;
        const businessUnitId = this.comments[this.indiceSelected].BusinessUnitId;
        const distributionId = this.comments[this.indiceSelected].DistributionId;
        const prefixId = this.comments[this.indiceSelected].PrefixId;
        const targetId = this.comments[this.indiceSelected].TargetId;
        this.subAddClientCommen =
          // tslint:disable-next-line: max-line-length
          this.plmClientsEngineService.addClientCommentRequest(commentTypeId, branchId, businessUnitId, distributionId, prefixId, targetId, userComment.toLowerCase(), this.globalVarsService.getClientInfoValue().codeString)
            .subscribe({
              next: () => { },
              error: () => {
                this.controllersIonicService.hideLoader()
                  .finally(() => {
                    // tslint:disable-next-line: max-line-length
                    this.controllersIonicService.presentToast('Vaya, tenemos problemas para procesar su solicitud. Inténtalo de nuevo más tarde.');
                  });
              },
              complete: () => {
                console.log('succesfull getCommentTypesByPrefixRequest');
                this.controllersIonicService.hideLoader()
                  .finally(() => {
                    this.isenabled = false;
                    this.myInput = '';
                    this.checkBoxs.forEach((item: IonCheckbox) => {
                      item.checked = false;
                    });
                    this.controllersIonicService.presentToast('Su sugerencia ha sido enviada correctamente.');
                  });
              }
            });
      });
  }

}
