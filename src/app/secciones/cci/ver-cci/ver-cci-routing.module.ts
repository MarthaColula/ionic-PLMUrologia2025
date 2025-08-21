import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VerCciPage } from './ver-cci.page';

const routes: Routes = [
  {
    path: '',
    component: VerCciPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VerCciPageRoutingModule {}
