
import {Component, Input, OnInit} from "@angular/core";
import {ElementService} from "./element.service";

@Component({
  selector: 'element',
  template: `
    <dynamic-content [type]="type" [context]="context" [path]="path"></dynamic-content>
 `
})
export class ElementComponent implements OnInit {

  @Input() context: any;
  @Input() path: string;
  type: string;

  ngOnInit(): void {
    this.type =  this.context.editable != null ? this.context.editable.format : ElementService.DEFAULT;
  }
}
