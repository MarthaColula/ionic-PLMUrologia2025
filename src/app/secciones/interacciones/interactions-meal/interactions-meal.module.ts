import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InteractionsMealPageRoutingModule } from './interactions-meal-routing.module';

import { InteractionsMealPage } from './interactions-meal.page';
import { ComponentesModule } from 'src/app/componentes/componentes-module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InteractionsMealPageRoutingModule,
    ComponentesModule
  ],
  declarations: [InteractionsMealPage]
})
export class InteractionsMealPageModule {}
