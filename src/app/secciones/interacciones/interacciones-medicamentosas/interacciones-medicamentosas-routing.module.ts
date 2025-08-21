import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InteraccionesMedicamentosasPage } from './interacciones-medicamentosas.page';

const routes: Routes = [
  {
    path: '',
    component: InteraccionesMedicamentosasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InteraccionesMedicamentosasPageRoutingModule {}
