import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RespuestaCorrectaPageRoutingModule } from './respuesta-correcta-routing.module';

import { RespuestaCorrectaPage } from './respuesta-correcta.page';
import { ComponentesModule } from 'src/app/componentes/componentes-module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RespuestaCorrectaPageRoutingModule,
    ComponentesModule
  ],
  declarations: [RespuestaCorrectaPage]
})
export class RespuestaCorrectaPageModule {}
