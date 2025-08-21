import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AtlasPageRoutingModule } from './atlas-routing.module';

import { AtlasPage } from './atlas.page';
import { ComponentesModule } from 'src/app/componentes/componentes-module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AtlasPageRoutingModule,
    ComponentesModule
  ],
  declarations: [AtlasPage]
})
export class AtlasPageModule {}
