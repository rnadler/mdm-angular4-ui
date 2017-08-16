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
  template: `<table-element *ngIf="context" [context]="context" [path]="path"></table-element>`
})
export class XformsComponent implements OnDestroy {
  @Input() fgData: any;
  context: any;
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  readonly MODEL_JSON_FILE: string = 'mini_model_ui_example.json';

  constructor(private dataService: DataService,
              private messagingService: MessagingService, private modelService: ModelService,
              private rulesService: RulesService) {
    this.dataService.getJSON(this.MODEL_JSON_FILE)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(data => {
        this.rulesService.addGlobalRules(data.Rules);
        this.modelService.setModel(data.Model);
        this.modelService.setFgData(this.fgData);
        this.context = data.Controls;
    });
    this.messagingService.of(ModelUpdatedMessage)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(message => this.onModelUpdated(message));
  }
  private onModelUpdated(message: ModelUpdatedMessage) {
    console.log('onModelUpdated: ref=' + message.ref + ' value=' + message.value);
    this.rulesService.evaluateUpdateRules();
  }
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
