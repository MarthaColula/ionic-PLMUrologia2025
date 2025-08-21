import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IppaPage } from './ippa.page';

const routes: Routes = [
  {
    path: '',
    component: IppaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IppaPageRoutingModule {}
