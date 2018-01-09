
import {Injectable} from "@angular/core";
import {ModelService} from "./model/model.service";
import {RulesService} from "./rules/rules.service";
import {MessagingService} from "./model/messaging.service";
import {AlertUpdatedMessage} from "./model/alert.updated.message";
import {ComponentService} from "./component.service";
import {DynamicComponent} from "./dynamic.component";
import {IAlertMessage} from "./model/alert.message";
import {Utils} from "./utils";

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
      let alert = Utils.cloneObject(alertMessage);
      alert.path = c.path;
      alert.alertCallback = (state) => self.messagingService.publish(new AlertUpdatedMessage(state, c.path));
      this.setComponentAlertMessage(c, alert);
    });
  }

  public setComponentAlertMessage(component: DynamicComponent, newMessage: IAlertMessage = <IAlertMessage>{}) {
    let alertMessage = component.alertMessage;
    let valuePath = newMessage.valuePath;
    let keyPath = newMessage.keyPath;
    let message = newMessage.message;
    let isSameParent = component.isSameParent(keyPath);
    let isSameRef = component.context.ref === keyPath;
    if (isSameParent) {
      console.debug('updateAlertMessage: ' + component.path + ' sameRef=' + isSameRef + ' sameParent=' + isSameParent +
        ' valuePath=' + Utils.stripPath(valuePath) + ' msg=' + message);
    }
    if (isSameRef) {
      if (message) {
        if (alertMessage.message) {
          return;
        }
        alertMessage.valuePath = valuePath;
      } else if (!this.okToClearAlertMessage(alertMessage, valuePath)) {
        return;
      }
    } else {
      if (isSameParent || !this.okToClearAlertMessage(alertMessage, valuePath)) {
        return;
      }
      message = null;
    }
    if (newMessage.alertCallback && alertMessage.message !== message) {
      newMessage.alertCallback(message !== null);
    }
    alertMessage.message = message;
  }
  private okToClearAlertMessage(alertMessage: IAlertMessage, valuePath: string): boolean {
    return alertMessage.message && alertMessage.valuePath === valuePath;
  }
}


