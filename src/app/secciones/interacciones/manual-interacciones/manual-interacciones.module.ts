import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ManualInteraccionesPageRoutingModule } from './manual-interacciones-routing.module';

import { ManualInteraccionesPage } from './manual-interacciones.page';
import { ComponentesModule } from 'src/app/componentes/componentes-module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ManualInteraccionesPageRoutingModule,
   ComponentesModule
  ],
  declarations: [ManualInteraccionesPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ManualInteraccionesPageModule {}
