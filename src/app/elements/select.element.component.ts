import {Component, OnInit} from "@angular/core";
import {DynamicComponent} from "../dynamic.component";
import {ElementService} from "../element.service";

@Component({
  selector: 'select-element',
  template: `<div>Select Element: path={{path}} label={{context?.label}} 
    <select [attr.reloadOnChange]="context.editable.constraints?.reloadOnChange">
      <option *ngFor="let option of options"
        [value]="option.op"
        [attr.selected]="option.value === context.editable.value ? true : null">
      {{option.value}}
      </option>
    </select>
  </div>`
})
export class SelectElementComponent extends DynamicComponent implements OnInit {
  options: any;

  ngOnInit(): void {
    this.options = [];
    for (let op in this.context.editable.options) {
      this.options.push({ op: op, value: this.context.editable.options[op]});
    }
  }
}
ElementService.addElement('select', SelectElementComponent);
