import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListaCiePageRoutingModule } from './lista-cie-routing.module';

import { ListaCiePage } from './lista-cie.page';
import { ComponentesModule } from 'src/app/componentes/componentes-module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListaCiePageRoutingModule,
    ComponentesModule
  ],
  declarations: [ListaCiePage]
})
export class ListaCiePageModule {}
