import {Component} from "@angular/core";
import {ContentContainer} from "./content.container";

@Component({
  selector: 'table',
  template: `    
    <div class="panel panel-info">
      <div class="panel-heading" *ngIf="context.label">
        <h2 class="panel-title">{{context.label}}</h2>
      </div>
      <div class="panel-body" *ngFor="let element of elements">
        <element [context]="element.context" [path]="element.path"></element>
      </div>
    </div>
`
})
export class TableComponent extends ContentContainer {
}
