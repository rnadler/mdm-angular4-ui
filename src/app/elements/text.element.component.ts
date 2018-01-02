import {Component} from "@angular/core";
import {DynamicComponent} from "../dynamic.component";
import {ElementService} from "../element.service";
import {UiStateService} from "../ui.state.service";

@Component({
  selector: 'text-element',
  template: `<div>Text Element: path={{path}} label={{context?.label}} value={{context?.editable.value}}</div>`
})
export class TextElementComponent extends DynamicComponent {
  constructor(uiStateService: UiStateService) {
    super(uiStateService);
  }
}
ElementService.addElement('text', TextElementComponent);
