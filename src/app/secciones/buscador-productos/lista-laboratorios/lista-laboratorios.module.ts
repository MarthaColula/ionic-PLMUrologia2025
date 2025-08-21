import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListaLaboratoriosPageRoutingModule } from './lista-laboratorios-routing.module';

import { ListaLaboratoriosPage } from './lista-laboratorios.page';
import { ComponentesModule } from 'src/app/componentes/componentes-module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListaLaboratoriosPageRoutingModule,
    ComponentesModule
  ],
  declarations: [ListaLaboratoriosPage]
})
export class ListaLaboratoriosPageModule {}
