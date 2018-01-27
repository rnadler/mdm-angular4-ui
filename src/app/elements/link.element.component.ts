import {Component} from "@angular/core";
import {DynamicComponent} from "../dynamic.component";
import {ElementService} from "../element.service";
import {UiStateService} from "../ui.state.service";

@Component({
  selector: 'link-element',
  styles: [
    `a {
      background-color: transparent;
      vertical-align: bottom;
      display: table-cell;
      height: 42px;
      cursor: pointer;
    }`
  ],
  template: `<div [hidden]="hidden"><a [attr.id]="path" (click)="onChange('link clicked')">{{context?.label}}</a></div>`
})
export class LinkElementComponent extends DynamicComponent {

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
ElementService.addElement('link', LinkElementComponent);
