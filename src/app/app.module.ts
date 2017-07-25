import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { DataService} from "./data.service"
import { ModelService} from "./model.service"

import {
  DynamicContentComponent,
} from './dynamic-content.component';
import {XformsComponent} from "./xforms.component";
import {TableComponent} from "./table.component";
import {ElementComponent} from "./element.component";
import {ElementService} from "./element.service";
import {TextElementComponent} from "./elements/text.element.component";
import {DefaultElementComponent} from "./elements/default.element.component";
import {SelectElementComponent} from "./elements/select.element.component";
import {SwitchElementComponent} from "./elements/switch.element.component";
import { RangeElementComponent} from "./elements/range.element.component"

@NgModule({
  declarations: [
    AppComponent,
    DynamicContentComponent,
    XformsComponent,
    TableComponent,
    ElementComponent,
    TextElementComponent,
    SelectElementComponent,
    SwitchElementComponent,
    RangeElementComponent,
    DefaultElementComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [
    DataService,
    ElementService,
    ModelService
  ],
  entryComponents: [
    XformsComponent,
    TableComponent,
    ElementComponent,
    TextElementComponent,
    SelectElementComponent,
    SwitchElementComponent,
    RangeElementComponent,
    DefaultElementComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
