import {Component} from "@angular/core";
import {DynamicComponent} from "../dynamic.component";
import {ElementService} from "../element.service";
import {UiStateService} from "../ui.state.service";

@Component({
  selector: 'select-element',
  template: `<div *ngIf="defaultItem" [hidden]="hidden">{{context?.label}}<br>
    <select (change)="onChange($event.target.value)" [(ngModel)]="defaultItem">
      <option *ngFor="let item of items"
        [value]="item"
        [selected]="item == defaultItem ? true : null">
      {{item}}
      </option>
    </select>
  </div>`
})
export class SelectElementComponent extends DynamicComponent {
  items: any;
  defaultItem: any;
  constructor(uiStateService: UiStateService) {
    super(uiStateService);
  }

  ngOnInit(): void {
    this.update();
    super.ngOnInit();
  }
  update() {
    this.items = [];
    for (let op of this.modelService.getValue(this.context.bind)) {
      this.items.push(op);
    }
    this.defaultItem = this.modelService.getValue(this.context.ref);
  }
}
ElementService.addElement('select', SelectElementComponent);
