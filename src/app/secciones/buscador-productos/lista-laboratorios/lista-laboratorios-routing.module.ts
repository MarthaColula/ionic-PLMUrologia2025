import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListaLaboratoriosPage } from './lista-laboratorios.page';

const routes: Routes = [
  {
    path: '',
    component: ListaLaboratoriosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListaLaboratoriosPageRoutingModule {}
