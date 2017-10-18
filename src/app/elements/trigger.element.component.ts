
import {Component} from "@angular/core";
import {DynamicComponent} from "../dynamic.component";
import {RulesService} from "../rules/rules.service";
import {ModelService} from "../model/model.service";
import {ElementService} from "../element.service";
import {AlertUpdatedMessage} from "../model/alert-updated-message";
import {Subject} from "rxjs/Subject";

@Component({
  selector: 'trigger-element',
  template: `<div><br><button (click)="onChange('button clicked')" [disabled]="hidden">{{context?.label}}</button></div>`
})
export class TriggerElementComponent extends DynamicComponent {
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(modelService: ModelService, rulesService: RulesService) {
    super(modelService, rulesService);
  }
  ngOnInit(): void {
    this.update();
    super.ngOnInit();
    this.modelService.getMessagingService().of(AlertUpdatedMessage)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(message => this.onAlertChange(message));
  }
  onAlertChange(message: AlertUpdatedMessage) {
    this.hidden = message.set;
  }
  onChange(value: any) {
    super.onChange(value);
  }
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    super.ngOnDestroy();
  }
}
ElementService.addElement('trigger', TriggerElementComponent);
