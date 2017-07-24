import {Component} from "@angular/core";
import {ContentContainer} from "./content.container";

@Component({
  selector: 'section',
  template: `    
    <div class="panel panel-info">
      <div class="panel-heading" *ngIf="context.label">
        <h2 class="panel-title">{{context.label}}</h2>
      </div>
      <div class="panel-body" *ngFor="let element of elements">
        <group [context]="element.context" [path]="element.path"></group>
      </div>
    </div>
`
})
export class SectionComponent extends ContentContainer {

  constructor() {
    super('groups');
  }
}
