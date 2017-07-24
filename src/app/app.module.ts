import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { DataService} from "./data.service"

import {
  DynamicContentComponent,
} from './dynamic-content.component';
import {SectionsComponent} from "./sections.component";
import {SectionComponent} from "./section.component";
import {GroupComponent} from "./group.component";
import {ElementComponent} from "./element.component";
import {ElementService} from "./element.service";
import {TextElementComponent} from "./elements/text.element.component";
import {DefaultElementComponent} from "./elements/default.element.component";
import {SelectElementComponent} from "./elements/select.element.component";
import {BooleanElementComponent} from "./elements/boolean.element.component";

@NgModule({
  declarations: [
    AppComponent,
    DynamicContentComponent,
    SectionsComponent,
    SectionComponent,
    GroupComponent,
    ElementComponent,
    TextElementComponent,
    SelectElementComponent,
    BooleanElementComponent,
    DefaultElementComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [
    DataService,
    ElementService
  ],
  entryComponents: [
    SectionsComponent,
    SectionComponent,
    GroupComponent,
    ElementComponent,
    TextElementComponent,
    SelectElementComponent,
    BooleanElementComponent,
    DefaultElementComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
