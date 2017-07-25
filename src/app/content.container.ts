import {Input, OnInit} from "@angular/core";
import jp from "jsonpath";

export class ContentContainer implements OnInit {
  elements: any;
  @Input() context: any;
  @Input() path: string;

  ngOnInit(): void {
    if (typeof this.context === 'string' || this.context instanceof String) {
      return;
    }
    this.elements = [];
    let elements = jp.query(this.context, '$..controls')[0];
    for (let el in elements) {
      this.elements.push({context: elements[el], path: this.getPath(el)});
    }
  }
  setContext(data: any) {
    this.context = data;
    this.ngOnInit();
  }
  private getPath(name: string) {
    if (this.path === undefined) {
      return name;
    }
    return this.path + '.' + name;
  }
}
