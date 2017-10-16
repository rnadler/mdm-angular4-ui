
import {Component} from "@angular/core";
import {DynamicComponent} from "../dynamic.component";
import {RulesService} from "../rules/rules.service";
import {ModelService} from "../model/model.service";
import {ElementService} from "../element.service";

@Component({
  selector: 'trigger-element',
  template: `<div><br><button (click)="onChange('button clicked')" [disabled]="hidden">{{context?.label}}</button></div>`
})
export class TriggerElementComponent extends DynamicComponent {

  constructor(modelService: ModelService, rulesService: RulesService) {
    super(modelService, rulesService);
  }
  ngOnInit(): void {
    this.update();
    super.ngOnInit();
  }
  onChange(value: any) {
    this.hidden = !this.hidden;  // TODO: For display debug only. Will be removed.
    super.onChange(value);
  }
}
ElementService.addElement('trigger', TriggerElementComponent);
