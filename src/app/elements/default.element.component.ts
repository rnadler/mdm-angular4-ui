
import {Component} from "@angular/core";
import {DynamicComponent} from "../dynamic.component";
import {ElementService} from "../element.service";
import {RulesService} from "../rules/rules.service";
import {ModelService} from "../model/model.service";

@Component({
  selector: 'default-element',
  template: `<div>Default Element: path={{path}} label={{context?.label}}</div>`
})
export class DefaultElementComponent extends DynamicComponent {
  constructor(modelService: ModelService, rulesService: RulesService) {
    super(modelService, rulesService);
  }
}
ElementService.addDefaultElement(DefaultElementComponent);
