import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ResumenAbstractPageRoutingModule } from './resumen-abstract-routing.module';

import { ResumenAbstractPage } from './resumen-abstract.page';
import { ComponentesModule } from 'src/app/componentes/componentes-module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ResumenAbstractPageRoutingModule,
    ComponentesModule
  ],
  declarations: [ResumenAbstractPage]
})
export class ResumenAbstractPageModule {}
