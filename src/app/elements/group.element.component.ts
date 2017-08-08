
import {Component} from "@angular/core";
import {DynamicComponent} from "../dynamic.component";
import {ElementService} from "../element.service";

@Component({
  selector: 'group-element',
  template: `
    <div class="panel panel-info" [hidden]="hidden">
      <div class="panel-heading" *ngIf="context.label">
        <h2 class="panel-title">{{context.label}}</h2>
      </div>
      <div class="panel-body" *ngFor="let element of elements">
        <dynamic-content [type]="element.type" [context]="element.context" [path]="element.path"></dynamic-content>
      </div>
    </div>
  `
})
export class GroupElementComponent extends DynamicComponent  {

  ngOnInit(): void {
    this.update();
    super.ngOnInit();
  }
}
ElementService.addElement('group', GroupElementComponent);
