
import {Component} from "@angular/core";
import {ElementService} from "../element.service";
import {DynamicComponent} from "../dynamic.component";
import {ModelService} from "../model/model.service";
import {RulesService} from "../rules/rules.service";

@Component({
  selector: 'range-element',
  template: `<div>Range Element: path={{path}} label=<strong>{{context?.label}}</strong>
    <select (change)="onChange($event.target.value)" [(ngModel)]="defaultValue">
      <option *ngFor="let value of values"
              [value]="value"
              [selected]="value == defaultValue">
        {{value}}
      </option>
    </select>
  </div>`
})
export class RangeElementComponent extends DynamicComponent {
  values: Array<number>;
  defaultValue: number;

  constructor(modelService: ModelService, rulesService: RulesService) {
    super(modelService, rulesService);
  }

  ngOnInit(): void {
    this.update();
    super.ngOnInit();
  }
  update() {
    let start = Number(this.context.range.start);
    let end = Number(this.context.range.end);
    let step = Number(this.context.range.step);
    this.defaultValue = Number(this.modelService.getValue(this.context.ref));
    this.values = [];
    for (let v = start; v <= end; v += step) {
      this.values.push(v)
    }
    console.log(this.path + ' range update: start=' + start + ' end=' + end + ' defVal=' + this.defaultValue);
    super.update();
  }
}
ElementService.addElement('range', RangeElementComponent);
