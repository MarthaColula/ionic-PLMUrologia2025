import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListaSustanciasPage } from './lista-sustancias.page';

const routes: Routes = [
  {
    path: '',
    component: ListaSustanciasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListaSustanciasPageRoutingModule {}
