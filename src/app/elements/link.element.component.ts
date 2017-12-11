
import {Component} from "@angular/core";
import {DynamicComponent} from "../dynamic.component";
import {RulesService} from "../rules/rules.service";
import {ModelService} from "../model/model.service";
import {ElementService} from "../element.service";

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
  template: `<div [hidden]="hidden"><a (click)="onChange('link clicked')">{{context?.label}}</a></div>`
})
export class LinkElementComponent extends DynamicComponent {

  constructor(modelService: ModelService, rulesService: RulesService) {
    super(modelService, rulesService);
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
