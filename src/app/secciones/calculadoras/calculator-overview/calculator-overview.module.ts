import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CalculatorOverviewPageRoutingModule } from './calculator-overview-routing.module';

import { CalculatorOverviewPage } from './calculator-overview.page';
import { ComponentesModule } from 'src/app/componentes/componentes-module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CalculatorOverviewPageRoutingModule,
    ComponentesModule
  ],
  declarations: [CalculatorOverviewPage]
})
export class CalculatorOverviewPageModule {}
