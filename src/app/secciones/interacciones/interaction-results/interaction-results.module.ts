import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InteractionResultsPageRoutingModule } from './interaction-results-routing.module';

import { InteractionResultsPage } from './interaction-results.page';
import { ComponentesModule } from 'src/app/componentes/componentes-module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InteractionResultsPageRoutingModule,
    ComponentesModule
  ],
  declarations: [InteractionResultsPage]
})
export class InteractionResultsPageModule {}
