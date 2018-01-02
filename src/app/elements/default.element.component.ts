import {Component} from "@angular/core";
import {DynamicComponent} from "../dynamic.component";
import {ElementService} from "../element.service";
import {UiStateService} from "../ui.state.service";

@Component({
  selector: 'default-element',
  template: `<div>Default Element: path={{path}} label={{context?.label}}</div>`
})
export class DefaultElementComponent extends DynamicComponent {
  constructor(uiStateService: UiStateService) {
    super(uiStateService);
  }
}
ElementService.addDefaultElement(DefaultElementComponent);
