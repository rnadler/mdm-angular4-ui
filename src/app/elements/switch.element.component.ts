
import {Component, OnInit} from "@angular/core";
import {ElementService} from "../element.service";
import {DynamicComponent} from "../dynamic.component";
import {ModelService} from "../model.service";

@Component({
  selector: 'boolean-element',
  template: `<div>Switch Element: path={{path}} label=<strong>{{context?.label}}</strong>
    <input type='checkbox' [checked]="checked"></div>`
})
export class SwitchElementComponent extends DynamicComponent implements OnInit {
  checked: boolean;

  ngOnInit(): void {
    this.checked = ModelService.getValue(this.context.ref);
}

}
ElementService.addElement('switch', SwitchElementComponent);
