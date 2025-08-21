import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListaCiePage } from './lista-cie.page';

const routes: Routes = [
  {
    path: '',
    component: ListaCiePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListaCiePageRoutingModule {}
