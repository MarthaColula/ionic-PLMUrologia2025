import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VerCciPageRoutingModule } from './ver-cci-routing.module';

import { VerCciPage } from './ver-cci.page';
import { ComponentesModule } from 'src/app/componentes/componentes-module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VerCciPageRoutingModule,
    ComponentesModule
  ],
  declarations: [VerCciPage]
})
export class VerCciPageModule {}
