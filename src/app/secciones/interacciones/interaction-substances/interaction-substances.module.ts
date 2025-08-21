import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InteractionSubstancesPageRoutingModule } from './interaction-substances-routing.module';

import { InteractionSubstancesPage } from './interaction-substances.page';
import { ComponentesModule } from 'src/app/componentes/componentes-module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InteractionSubstancesPageRoutingModule,
    ComponentesModule
  ],
  declarations: [InteractionSubstancesPage]
})
export class InteractionSubstancesPageModule {}
