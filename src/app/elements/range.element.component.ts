
import {Component, OnInit} from "@angular/core";
import {ElementService} from "../element.service";
import {ModelService} from "../model.service";
import {DynamicComponent} from "../dynamic.component";

@Component({
  selector: 'range-element',
  template: `<div>Range Element: path={{path}} label=<strong>{{context?.label}}</strong>
    <select>
      <option *ngFor="let value of values"
              [value]="value"
              [attr.selected]="value === defaultValue ? true : null">
        {{value}}
      </option>
    </select>
  </div>`
})
export class RangeElementComponent extends DynamicComponent implements OnInit {
  values: Array<number> = [];
  defaultValue: any;

  ngOnInit(): void {

    let start = Number(this.context.range.start);
    let end = Number(this.context.range.end);
    let step = Number(this.context.range.step);
    for (let v = start; v <= end; v += step) {
      this.values.push(v)
    }
    this.defaultValue = ModelService.getValue(this.context.ref);
  }

}
ElementService.addElement('range', RangeElementComponent);
