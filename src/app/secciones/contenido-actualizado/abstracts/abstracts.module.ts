import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AbstractsPageRoutingModule } from './abstracts-routing.module';

import { AbstractsPage } from './abstracts.page';
import { ComponentesModule } from 'src/app/componentes/componentes-module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AbstractsPageRoutingModule,
    ComponentesModule
  ],
  declarations: [AbstractsPage]
})
export class AbstractsPageModule {}
