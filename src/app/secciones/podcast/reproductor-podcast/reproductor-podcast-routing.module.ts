import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReproductorPodcastPage } from './reproductor-podcast.page';

const routes: Routes = [
  {
    path: '',
    component: ReproductorPodcastPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReproductorPodcastPageRoutingModule {}
