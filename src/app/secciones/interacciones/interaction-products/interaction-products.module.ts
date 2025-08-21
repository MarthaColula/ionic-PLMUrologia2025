import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InteractionProductsPageRoutingModule } from './interaction-products-routing.module';

import { InteractionProductsPage } from './interaction-products.page';
import { ComponentesModule } from 'src/app/componentes/componentes-module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InteractionProductsPageRoutingModule,
    ComponentesModule
  ],
  declarations: [InteractionProductsPage]
})
export class InteractionProductsPageModule {}
