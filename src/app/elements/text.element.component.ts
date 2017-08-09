
import {Component} from "@angular/core";
import {DynamicComponent} from "../dynamic.component";
import {ElementService} from "../element.service";
import {ModelService} from "../model/model.service";
import {RulesService} from "../rules/rules.service";

@Component({
  selector: 'text-element',
  template: `<div>Text Element: path={{path}} label={{context?.label}} value={{context?.editable.value}}</div>`
})
export class TextElementComponent extends DynamicComponent {
  constructor(modelService: ModelService, rulesService: RulesService) {
    super(modelService, rulesService);
  }
}
ElementService.addElement('text', TextElementComponent);
