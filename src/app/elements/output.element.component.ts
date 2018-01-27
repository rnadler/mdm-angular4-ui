import {Component} from "@angular/core";
import {DynamicComponent} from "../dynamic.component";
import {ElementService} from "../element.service";
import {UiStateService} from "../ui.state.service";

@Component({
  selector: 'output-element',
  template: `<div [attr.id]="path" [hidden]="hidden">{{context?.label}}<br><strong>{{value}}</strong></div>`
})
export class OutputElementComponent extends DynamicComponent {
  value: string;

  constructor(uiStateService: UiStateService) {
    super(uiStateService);
  }
  ngOnInit(): void {
    this.update();
    super.ngOnInit();
  }
  isValid() {
    return this.value !== undefined;
  }
  update() {
    this.value = this.modelService.getValue(this.context.ref);
    super.update();
  }
}
ElementService.addElement('output', OutputElementComponent);
