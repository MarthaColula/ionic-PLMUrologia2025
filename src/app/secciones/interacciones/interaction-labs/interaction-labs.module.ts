import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InteractionLabsPageRoutingModule } from './interaction-labs-routing.module';

import { InteractionLabsPage } from './interaction-labs.page';
import { ComponentesModule } from 'src/app/componentes/componentes-module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InteractionLabsPageRoutingModule,
    ComponentesModule
  ],
  declarations: [InteractionLabsPage]
})
export class InteractionLabsPageModule {}
