import {Component} from "@angular/core";
import {DynamicComponent} from "../dynamic.component";
import {ElementService} from "../element.service";
import {RulesService} from "../rules/rules.service";
import {ModelService} from "../model/model.service";

@Component({
  selector: 'repeat-element',
  styles: [
    `table {
      border-collapse: separate;
      border-spacing: 15px;
    }
    td {
     text-align: center;
    }`
  ],
  template: `
    <div class="panel panel-info" [hidden]="hidden">
      <div class="panel-heading" *ngIf="context.label">
        <h2 class="panel-title">{{context.label}}</h2>
      </div>
      <div class="container">
        <div class="row">
              <dynamic-content class="column" *ngFor="let element of elements"
                               [type]="element.type" [context]="element.context"
                               [path]="element.path"></dynamic-content>
        </div>
      </div>
    </div>
  `
})
export class RepeatElementComponent extends DynamicComponent  {

  constructor(modelService: ModelService, rulesService: RulesService) {
    super(modelService, rulesService);
  }
  ngOnInit(): void {
    this.update();
    super.ngOnInit();
  }
}
ElementService.addElement('repeat', RepeatElementComponent);
