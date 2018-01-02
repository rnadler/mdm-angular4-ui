import {Component} from "@angular/core";
import {ElementService} from "../element.service";
import {DynamicComponent} from "../dynamic.component";
import {UiStateService} from "../ui.state.service";

@Component({
  selector: 'switch-element',
  template: `<div><input type='checkbox' [checked]="checked" (change)="onChange($event.target.checked)">
    <strong>{{context?.label}}</strong></div>`
})
export class SwitchElementComponent extends DynamicComponent {
  checked: boolean;

  constructor(uiStateService: UiStateService) {
    super(uiStateService);
  }
  ngOnInit(): void {
    this.update();
    super.ngOnInit();
  }
  update() {
    this.checked = this.modelService.getValue(this.context.ref);
    console.log(this.path + ' switch update: checked=' + this.checked);
    super.update();
  }
}
ElementService.addElement('switch', SwitchElementComponent);
