import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ResumenAbstractPage } from './resumen-abstract.page';

const routes: Routes = [
  {
    path: '',
    component: ResumenAbstractPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResumenAbstractPageRoutingModule {}
