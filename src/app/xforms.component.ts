import {Component, OnDestroy} from "@angular/core";
import {DataService} from "./data.service";
import {ContentContainer} from "./content.container";
import {Subject} from "rxjs/Subject";
import 'rxjs/add/operator/takeUntil';
import {RulesService} from "./rules/rules.service";
import {ModelService} from "./model/model.service";
import {MessagingService} from "./model/messaging-service";
import {ModelUpdatedMessage} from "./model/model-updated-message";

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
export class XformsComponent extends ContentContainer implements OnDestroy {
  title: string;
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private dataService: DataService) {
    super();
    this.dataService.getJSON('xforms-example.json')
      .takeUntil(this.ngUnsubscribe)
      .subscribe(data => {
        this.title = this.context;
        ModelService.setModel(data.Model);
        this.setContext(data.Controls);
    });
    MessagingService.of(ModelUpdatedMessage)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(message => this.onModelUpdated(message));
  }
  private onModelUpdated(message: ModelUpdatedMessage) {
    console.log('onModelUpdated: ref=' + message.ref + ' value=' + message.value);
    RulesService.evaluateUpdateRules();
  }
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
