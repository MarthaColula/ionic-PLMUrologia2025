import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InteraccionesMedicamentosasPageRoutingModule } from './interacciones-medicamentosas-routing.module';

import { InteraccionesMedicamentosasPage } from './interacciones-medicamentosas.page';
import { ComponentesModule } from 'src/app/componentes/componentes-module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InteraccionesMedicamentosasPageRoutingModule,
    ComponentesModule
  ],
  declarations: [InteraccionesMedicamentosasPage]
})
export class InteraccionesMedicamentosasPageModule {}
