
import {Injectable} from "@angular/core";
import {ModelService} from "./model/model.service";
import {RulesService} from "./rules/rules.service";
import {MessagingService} from "./model/messaging.service";
import {AlertUpdatedMessage} from "./model/alert.updated.message";
import {ComponentService} from "./component.service";
import {DynamicComponent} from "./dynamic.component";
import {IAlertMessage} from "./model/alert.message";

export type AlertCallback = (state: boolean) => void;

@Injectable()
export class UiStateService {

  constructor(public modelService: ModelService, public rulesService: RulesService,
              private messagingService: MessagingService, private componentService: ComponentService) {
    messagingService.of(AlertUpdatedMessage).subscribe(message => this.onAlertChange(message));
  }

  private onAlertChange(message: AlertUpdatedMessage) {
    let component = this.componentService.getDynamicComponent(message.path);
    if (component && component.context.alert) {
      let alertComponent = this.componentService.getDynamicComponent(component.context.alert);
      if (alertComponent) {
        alertComponent.onAlertChange(message.state);
      }
    }
  }

  public updateAlertMessage(components: Array<DynamicComponent>, alertMessage: IAlertMessage) {
    let self = this;
    components.forEach(c => {
      let alert = ModelService.cloneObject(alertMessage);
      alert.path = c.path;
      alert.alertCallback = (state) => self.messagingService.publish(new AlertUpdatedMessage(state, c.path));
      c.setAlertMessage(alert);
    });
  }
}


