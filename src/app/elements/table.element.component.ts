import {Component} from "@angular/core";
import {DynamicComponent} from "../dynamic.component";
import {ElementService} from "../element.service";
import {UiStateService} from "../ui.state.service";

@Component({
  selector: 'table-element',
  template: `
    <div [attr.id]="path" *ngFor="let element of elements" [hidden]="hidden">
      <dynamic-content [type]="element.type" [context]="element.context" [path]="element.path"></dynamic-content>
    </div>
  `
})
export class TableElementComponent extends DynamicComponent  {

  constructor(uiStateService: UiStateService) {
    super(uiStateService);
  }
  ngOnInit(): void {
    this.update();
    super.ngOnInit();
  }
}
ElementService.addElement('table', TableElementComponent);
