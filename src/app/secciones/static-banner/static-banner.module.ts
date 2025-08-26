import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StaticBannerPageRoutingModule } from './static-banner-routing.module';

import { StaticBannerPage } from './static-banner.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StaticBannerPageRoutingModule
  ],
  declarations: [StaticBannerPage]
})
export class StaticBannerPageModule {}
