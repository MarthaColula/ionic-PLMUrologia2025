import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IppaPageRoutingModule } from './ippa-routing.module';

import { IppaPage } from './ippa.page';
import { ComponentesModule } from 'src/app/componentes/componentes-module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IppaPageRoutingModule,
    ComponentesModule
  ],
  declarations: [IppaPage]
})
export class IppaPageModule {}
