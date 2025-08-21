import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ContenidoActualizadoPageRoutingModule } from './contenido-actualizado-routing.module';

import { ContenidoActualizadoPage } from './contenido-actualizado.page';
import { ComponentesModule } from 'src/app/componentes/componentes-module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ContenidoActualizadoPageRoutingModule,
    ComponentesModule
  ],
  declarations: [ContenidoActualizadoPage]
})
export class ContenidoActualizadoPageModule {}
