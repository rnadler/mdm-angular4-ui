
import {Component} from "@angular/core";
import {DynamicComponent} from "../dynamic.component";
import {ElementService} from "../element.service";
import {RulesService} from "../rules/rules.service";
import {ModelService} from "../model/model.service";
import {ComponentService} from "../component.service";

@Component({
  selector: 'default-element',
  template: `<div>Default Element: path={{path}} label={{context?.label}}</div>`
})
export class DefaultElementComponent extends DynamicComponent {
  constructor(modelService: ModelService, rulesService: RulesService, componentService: ComponentService) {
    super(modelService, rulesService, componentService);
  }
}
ElementService.addDefaultElement(DefaultElementComponent);
