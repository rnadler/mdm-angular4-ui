import {Component} from "@angular/core";
import {DynamicComponent} from "../dynamic.component";
import {ElementService} from "../element.service";
import {UiStateService} from "../ui.state.service";

@Component({
  selector: 'trigger-element',
  template: `<button [attr.id]="path" class="column" (click)="onChange('button clicked')" [disabled]="hidden">{{context?.label}}</button>`
})
export class TriggerElementComponent extends DynamicComponent {

  constructor(uiStateService: UiStateService) {
    super(uiStateService);
  }
  ngOnInit(): void {
    this.update();
    super.ngOnInit();
  }
  onChange(value: any) {
    super.onChange(value);
  }
}
ElementService.addElement('trigger', TriggerElementComponent);
