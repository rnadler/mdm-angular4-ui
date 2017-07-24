
import {Component} from "@angular/core";
import {DynamicComponent} from "../dynamic.component";
import {ElementService} from "../element.service";

@Component({
  selector: 'default-element',
  template: `<div>Default Element: path={{path}} label={{context?.label}}</div>`
})
export class DefaultElementComponent extends DynamicComponent {}
ElementService.addDefaultElement(DefaultElementComponent);
