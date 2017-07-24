import {Component } from "@angular/core";
import {ContentContainer} from "./content.container";

@Component({
  selector: 'group',
  template: `
    <div class="panel panel-default">
      <div class="panel-heading" *ngIf="context.label">
        <h3 class="panel-title">{{context.label}}</h3>
      </div>
    <div class="indent" *ngFor="let element of elements">
      <element [context]="element.context" [path]="element.path"></element>
    </div>
    </div>
 `
})
export class GroupComponent extends ContentContainer {

  constructor() {
    super('elements');
  }
}
