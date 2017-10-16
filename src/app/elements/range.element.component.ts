
import {Component} from "@angular/core";
import {ElementService} from "../element.service";
import {DynamicComponent} from "../dynamic.component";
import {ModelService} from "../model/model.service";
import {RulesService} from "../rules/rules.service";

@Component({
  selector: 'range-element',
  template: `<div *ngIf="defaultValue" [hidden]="hidden">{{context?.label}}<br>
    <select (change)="onChange($event.target.value)" [(ngModel)]="defaultValue">
      <option *ngFor="let value of values"
              [value]="value"
              [selected]="value == defaultValue">
        {{value}}
      </option>
    </select>
    <span *ngIf="alertMessage" class="error">{{alertMessage}}</span>
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
  isValid() {
    return this.defaultValue !== undefined;
  }
  update() {
    let contextRange = this.modelService.getValue(this.context.bind);
    let start = Number(contextRange.min);
    let end = Number(contextRange.max);
    let step = Number(contextRange.step);
    this.defaultValue = Number(this.modelService.getValue(this.context.ref));
    this.values = [];
    for (let v = start; v <= end; v += step) {
      this.values.push(v)
    }
    //console.log(this.path + ' range update: min=' + start + ' max=' + end + ' defVal=' + this.defaultValue);
    super.update();
  }
}
ElementService.addElement('range', RangeElementComponent);
