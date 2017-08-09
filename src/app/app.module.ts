import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { DataService } from "./data.service"
import { ModelService } from "./model/model.service"
import { RulesService } from "./rules/rules.service"
import { MessagingService } from "./model/messaging-service"

import {
  DynamicContentComponent,
} from './dynamic-content.component';
import {XformsComponent} from "./xforms.component";
import {TextElementComponent} from "./elements/text.element.component";
import {DefaultElementComponent} from "./elements/default.element.component";
import {SelectElementComponent} from "./elements/select.element.component";
import {SwitchElementComponent} from "./elements/switch.element.component";
import {RangeElementComponent} from "./elements/range.element.component"
import {GroupElementComponent} from "./elements/group.element.component"
import {TableElementComponent} from "./elements/table.element.component"

@NgModule({
  declarations: [
    AppComponent,
    DynamicContentComponent,
    XformsComponent,
    TextElementComponent,
    SelectElementComponent,
    SwitchElementComponent,
    RangeElementComponent,
    DefaultElementComponent,
    GroupElementComponent,
    TableElementComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [
    DataService,
    ModelService,
    MessagingService,
    RulesService
  ],
  entryComponents: [
    XformsComponent,
    TextElementComponent,
    SelectElementComponent,
    SwitchElementComponent,
    RangeElementComponent,
    DefaultElementComponent,
    GroupElementComponent,
    TableElementComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
