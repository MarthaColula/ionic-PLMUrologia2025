import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InteractionIcdPageRoutingModule } from './interaction-icd-routing.module';

import { InteractionIcdPage } from './interaction-icd.page';
import { ComponentesModule } from 'src/app/componentes/componentes-module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InteractionIcdPageRoutingModule,
    ComponentesModule
  ],
  declarations: [InteractionIcdPage]
})
export class InteractionIcdPageModule {}
