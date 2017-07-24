
import {Component} from "@angular/core";
import {DynamicComponent} from "../dynamic.component";
import {ElementService} from "../element.service";

@Component({
  selector: 'text-element',
  template: `<div>Text Element: path={{path}} label={{context?.label}} value={{context?.editable.value}}</div>`
})
export class TextElementComponent extends DynamicComponent {}
ElementService.addElement('text', TextElementComponent);
