import {Component} from "@angular/core";
import {DynamicComponent} from "../dynamic.component";
import {ElementService} from "../element.service";
import {RulesService} from "../rules/rules.service";
import {ModelService} from "../model/model.service";

@Component({
  selector: 'select-element',
  template: `<div *ngIf="defaultItem"><strong>{{context?.label}}</strong><br>
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
  constructor(modelService: ModelService, rulesService: RulesService) {
    super(modelService, rulesService);
  }

  ngOnInit(): void {
    this.update();
    super.ngOnInit();
  }
  update() {
    this.items = [];
    let contextItems = this.modelService.getValue(this.context.itemsRef);
    if (!contextItems) {
      contextItems = this.context.items;
    }
    for (let op of contextItems) {
      this.items.push(op);
    }
    this.defaultItem = this.modelService.getValue(this.context.ref);
  }
}
ElementService.addElement('select', SelectElementComponent);
