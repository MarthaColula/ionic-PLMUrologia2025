import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PubmedPageRoutingModule } from './pubmed-routing.module';

import { PubmedPage } from './pubmed.page';
import { ComponentesModule } from 'src/app/componentes/componentes-module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PubmedPageRoutingModule,
    ComponentesModule
  ],
  declarations: [PubmedPage]
})
export class PubmedPageModule {}
