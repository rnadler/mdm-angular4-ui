import {Component, Input, OnDestroy} from "@angular/core";
import {DataService} from "./data.service";
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
    <table-element *ngIf="context" [context]="context" [path]="path"></table-element>
  `
})
export class XformsComponent implements OnDestroy {
  @Input() title: string;
  context: any;
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private dataService: DataService) {
    this.dataService.getJSON('xforms-example.json')
      .takeUntil(this.ngUnsubscribe)
      .subscribe(data => {
        ModelService.setModel(data.Model);
        this.context = data.Controls;
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
