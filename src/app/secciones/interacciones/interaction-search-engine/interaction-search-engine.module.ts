import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InteractionSearchEnginePageRoutingModule } from './interaction-search-engine-routing.module';

import { InteractionSearchEnginePage } from './interaction-search-engine.page';
import { ComponentesModule } from 'src/app/componentes/componentes-module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InteractionSearchEnginePageRoutingModule,
    ComponentesModule
  ],
  declarations: [InteractionSearchEnginePage]
})
export class InteractionSearchEnginePageModule {}
