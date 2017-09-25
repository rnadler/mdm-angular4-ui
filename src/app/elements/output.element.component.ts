
import {Component} from "@angular/core";
import {DynamicComponent} from "../dynamic.component";
import {ElementService} from "../element.service";
import {RulesService} from "../rules/rules.service";
import {ModelService} from "../model/model.service";
import {ComponentService} from "../component.service";

@Component({
  selector: 'output-element',
  template: `<div [hidden]="hidden">{{context?.label}}<br><strong>{{value}}</strong></div>`
})
export class OutputElementComponent extends DynamicComponent {
  value: string;

  constructor(modelService: ModelService, rulesService: RulesService, componentService: ComponentService) {
    super(modelService, rulesService, componentService);
  }
  ngOnInit(): void {
    this.update();
    super.ngOnInit();
  }
  update() {
    this.value = this.modelService.getValue(this.context.ref);
    this.updateRelevance(this.value !== undefined);
    console.log(this.path + ' output update: value=' + this.value);
    super.update();
  }
}
ElementService.addElement('output', OutputElementComponent);
