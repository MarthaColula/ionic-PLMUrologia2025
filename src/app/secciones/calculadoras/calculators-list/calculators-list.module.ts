import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CalculatorsListPageRoutingModule } from './calculators-list-routing.module';

import { CalculatorsListPage } from './calculators-list.page';
import { ComponentesModule } from 'src/app/componentes/componentes-module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CalculatorsListPageRoutingModule,
    ComponentesModule
  ],
  declarations: [CalculatorsListPage]
})
export class CalculatorsListPageModule {}
