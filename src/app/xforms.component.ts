import {Component} from "@angular/core";
import {DataService} from "./data.service";
import {ContentContainer} from "./content.container";
import {ModelService} from "./model.service";

@Component({
  selector: 'xforms',
  template: `
  <div class="center">
    <h1>{{title}}</h1>
  </div>
  <div *ngFor="let element of elements">
    <table [context]="element.context" [path]="element.path"></table>
  </div>
`
})
export class XformsComponent extends ContentContainer {
  title: string;

  constructor(private dataService: DataService) {
    super();
    this.dataService.getJSON('xforms-example.json').subscribe(data => {
      this.title = this.context;
      ModelService.setModel(data.Model);
      this.setContext(data.Controls);
    });
  }
}
