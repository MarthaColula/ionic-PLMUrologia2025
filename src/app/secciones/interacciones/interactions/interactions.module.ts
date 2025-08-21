import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InteractionsPageRoutingModule } from './interactions-routing.module';

import { InteractionsPage } from './interactions.page';
import { ComponentesModule } from 'src/app/componentes/componentes-module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InteractionsPageRoutingModule,
    ComponentesModule
  ],
  declarations: [InteractionsPage]
})
export class InteractionsPageModule {}
