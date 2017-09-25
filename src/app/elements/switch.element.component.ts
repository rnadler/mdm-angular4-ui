
import {Component} from "@angular/core";
import {ElementService} from "../element.service";
import {DynamicComponent} from "../dynamic.component";
import {ModelService} from "../model/model.service";
import {RulesService} from "../rules/rules.service";
import {ComponentService} from "../component.service";

@Component({
  selector: 'switch-element',
  template: `<div><input type='checkbox' [checked]="checked" (change)="onChange($event.target.checked)">
    <strong>{{context?.label}}</strong></div>`
})
export class SwitchElementComponent extends DynamicComponent {
  checked: boolean;

  constructor(modelService: ModelService, rulesService: RulesService, componentService: ComponentService) {
    super(modelService, rulesService, componentService);
  }
  ngOnInit(): void {
    this.update();
    super.ngOnInit();
  }
  update() {
    this.checked = this.modelService.getValue(this.context.ref);
    console.log(this.path + ' switch update: checked=' + this.checked);
    super.update();
  }
}
ElementService.addElement('switch', SwitchElementComponent);
