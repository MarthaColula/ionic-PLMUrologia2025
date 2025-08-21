import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListaSustanciasPageRoutingModule } from './lista-sustancias-routing.module';

import { ListaSustanciasPage } from './lista-sustancias.page';
import { ComponentesModule } from 'src/app/componentes/componentes-module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListaSustanciasPageRoutingModule,
    ComponentesModule
  ],
  declarations: [ListaSustanciasPage]
})
export class ListaSustanciasPageModule {}
