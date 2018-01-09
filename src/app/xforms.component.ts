import {Component, Input, OnDestroy} from "@angular/core";
import {DataService} from "./data.service";
import {Subject} from "rxjs/Subject";
import 'rxjs/add/operator/takeUntil';
import {RulesService} from "./rules/rules.service";
import {ModelService} from "./model/model.service";
import {MessagingService} from "./model/messaging.service";
import {ModelUpdatedMessage} from "./model/model.updated.message";
import {ComponentService} from "./component.service";

@Component({
  selector: 'xforms',
  template: `<table-element *ngIf="context" [context]="context" [path]="path"></table-element>`
})
export class XformsComponent implements OnDestroy {
  @Input() fgData: any;
  context: any;
  path: string;
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  readonly MODEL_JSON_FILE: string = 'mini_model_ui_example.json';

  constructor(private dataService: DataService,
              private messagingService: MessagingService, private modelService: ModelService,
              private rulesService: RulesService, private componentService: ComponentService) {
    this.dataService.getJSON(this.MODEL_JSON_FILE)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(data => {
        this.modelService.setModel(data.Model);
        this.modelService.setFgData(this.fgData);
        this.rulesService.addGlobalRuleSet(data.Rules);
        this.rulesService.addGlobalRuleSet(data.CategoryRules);
        this.context = data.Controls;
    });
    this.messagingService.of(ModelUpdatedMessage)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(message => this.onModelUpdated(message));
  }
  private onModelUpdated(message: ModelUpdatedMessage) {
    if (!message.ref) { // Bulk change: update all components
      this.componentService.updateDynamicComponents();
    } else {
      console.log('onModelUpdated: ref=' + message.ref + ' value=' + message.value);
      this.rulesService.evaluateUpdateRules(message.ref);
    }
  }
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
