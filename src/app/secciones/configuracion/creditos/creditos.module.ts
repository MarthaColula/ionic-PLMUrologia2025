import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreditosPageRoutingModule } from './creditos-routing.module';

import { CreditosPage } from './creditos.page';
import { ComponentesModule } from 'src/app/componentes/componentes-module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreditosPageRoutingModule,
    ComponentesModule
  ],
  declarations: [CreditosPage]
})
export class CreditosPageModule {}
