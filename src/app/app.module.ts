import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { DataService } from "./data.service"
import { ModelService } from "./model/model.service"
import { RulesService } from "./rules/rules.service"
import { MessagingService } from "./model/messaging.service"
import { ComponentService } from "./component.service";
import { UiStateService } from "./ui.state.service";
import { ActionManager } from "./action.manager";

import {DynamicContentComponent} from './dynamic.content.component';
import {XformsComponent} from "./xforms.component";
import {TextElementComponent} from "./elements/text.element.component";
import {DefaultElementComponent} from "./elements/default.element.component";
import {SelectElementComponent} from "./elements/select.element.component";
import {SwitchElementComponent} from "./elements/switch.element.component";
import {RangeElementComponent} from "./elements/range.element.component"
import {GroupElementComponent} from "./elements/group.element.component"
import {TableElementComponent} from "./elements/table.element.component"
import {OutputElementComponent} from "./elements/output.element.component"
import {RepeatElementComponent} from "./elements/repeat.element.component";
import {TriggerElementComponent} from "./elements/trigger.element.component"
import {LinkElementComponent} from "./elements/link.element.component"

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
    TableElementComponent,
    OutputElementComponent,
    RepeatElementComponent,
    TriggerElementComponent,
    LinkElementComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    DataService,
    ModelService,
    MessagingService,
    RulesService,
    ComponentService,
    UiStateService,
    ActionManager
  ],
  entryComponents: [
    XformsComponent,
    TextElementComponent,
    SelectElementComponent,
    SwitchElementComponent,
    RangeElementComponent,
    DefaultElementComponent,
    GroupElementComponent,
    TableElementComponent,
    OutputElementComponent,
    RepeatElementComponent,
    TriggerElementComponent,
    LinkElementComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
