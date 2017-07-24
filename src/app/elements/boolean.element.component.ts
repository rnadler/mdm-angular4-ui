
import {Component, OnInit} from "@angular/core";
import {ElementService} from "../element.service";
import {DynamicComponent} from "../dynamic.component";

@Component({
  selector: 'boolean-element',
  template: `<div>Boolean Element: path={{path}} label={{context?.label}}
    <input type='checkbox' [checked]="checked"></div>`
})
export class BooleanElementComponent extends DynamicComponent implements OnInit {
  checked: boolean;

  ngOnInit(): void {
    let b  = this.context.editable.value.toUpperCase();
    this.checked = b === "TRUE" || b === "ON" || b === "";
}

}
ElementService.addElement('boolean', BooleanElementComponent);
