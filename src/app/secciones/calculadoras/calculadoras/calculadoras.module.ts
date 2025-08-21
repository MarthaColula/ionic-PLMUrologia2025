import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CalculadorasPageRoutingModule } from './calculadoras-routing.module';

import { CalculadorasPage } from './calculadoras.page';
import { ComponentesModule } from 'src/app/componentes/componentes-module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CalculadorasPageRoutingModule,
    ComponentesModule
  ],
  declarations: [CalculadorasPage]
})
export class CalculadorasPageModule {}
