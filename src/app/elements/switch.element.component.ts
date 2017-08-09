
import {Component} from "@angular/core";
import {ElementService} from "../element.service";
import {DynamicComponent} from "../dynamic.component";
import {ModelService} from "../model/model.service";
import {RulesService} from "../rules/rules.service";

@Component({
  selector: 'switch-element',
  template: `<div>Switch Element: path={{path}} label=<strong>{{context?.label}}</strong>
    <input type='checkbox' [checked]="checked" (change)="onChange($event.target.checked)"></div>`
})
export class SwitchElementComponent extends DynamicComponent {
  checked: boolean;

  constructor(modelService: ModelService, rulesService: RulesService) {
    super(modelService, rulesService);
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
