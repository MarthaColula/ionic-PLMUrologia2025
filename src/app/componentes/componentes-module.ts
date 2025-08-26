import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { NavigationHeaderComponent } from './navigation-header/navigation-header.component';
import { PopmenuComponent } from './popmenu/popmenu.component';
import { InteractionFooterComponent } from './interaction-footer/interaction-footer.component';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { FooterComponent } from './footer/footer.component';

import { PopoverComponent } from './popover/popover.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SpinnerComponent } from './spinner/spinner.component';
import { ReagentContentComponent } from './dynamic-calculator/reagent-content/reagent-content.component';
import { PopElementDateComponent } from './dynamic-calculator/pop-element-date/pop-element-date.component';
import { PopNoteComponent } from './dynamic-calculator/pop-note/pop-note.component';
import { AboutDataAccordionComponent } from './about-data-accordion/about-data-accordion.component';
import { AutocompleteComponent } from './autocomplete/autocomplete.component';
import { EasyAccordionComponent } from './easy-accordion/easy-accordion.component';
import { ActiveSubstancesComponent } from './active-substances/active-substances.component';
import { ModalInfoComponent } from './modal-info/modal-info.component';
import { BannerComponent } from './banner/banner.component';
import { CollapseElementListComponent } from './collapse-element-list/collapse-element-list.component';




@NgModule({
  declarations: [
    HeaderComponent,
    NavigationHeaderComponent,
    PopmenuComponent,
    InteractionFooterComponent,
    FooterComponent,
    SpinnerComponent,
    PopoverComponent,
    ReagentContentComponent,
    PopElementDateComponent,
    PopNoteComponent,
    AboutDataAccordionComponent,
    AutocompleteComponent,
    EasyAccordionComponent,
    ActiveSubstancesComponent,
    ModalInfoComponent,
    BannerComponent,
    CollapseElementListComponent,
  ],
  exports: [
    HeaderComponent,
    NavigationHeaderComponent,
    PopmenuComponent,
    InteractionFooterComponent,
    FooterComponent,
    SpinnerComponent,
    PopoverComponent,
    ReagentContentComponent,
    PopElementDateComponent,
    PopNoteComponent,
    AboutDataAccordionComponent,
    AutocompleteComponent,
    EasyAccordionComponent,
    ActiveSubstancesComponent,
    ModalInfoComponent,
    BannerComponent,
    CollapseElementListComponent,
  ],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ]
})
export class ComponentesModule { }
