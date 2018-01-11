
import {Injectable} from "@angular/core";
import {ModelService} from "./model/model.service";
import {RulesService} from "./rules/rules.service";
import {MessagingService} from "./model/messaging.service";
import {AlertUpdatedMessage} from "./model/alert.updated.message";
import {ComponentService} from "./component.service";
import {DynamicComponent} from "./dynamic.component";
import {IAlertMessage} from "./model/alert.message";
import {Utils} from "./utils";
import {RuleEvaluationStateEnum} from "./rules/rule.evaluation.state.enum";

export type AlertCallback = (state: boolean) => void;

@Injectable()
export class UiStateService {
  private alertMessageCache = {};

  constructor(public modelService: ModelService, public rulesService: RulesService,
              private messagingService: MessagingService, private componentService: ComponentService) {
    messagingService.of(AlertUpdatedMessage).subscribe(message => this.onAlertChange(message));
  }

  public ruleEvaluationChange(state: RuleEvaluationStateEnum) {
    console.debug('onRuleEvaluationChange: ' + RuleEvaluationStateEnum[state]);
    if (state === RuleEvaluationStateEnum.start) {
      this.alertMessageCache = {};
    } else if (state === RuleEvaluationStateEnum.end) {
      let keys = Object.keys(this.alertMessageCache);
      console.debug('onRuleEvaluationChange: cached keys = ' + keys.length);
      keys.forEach((m) => {
        let component = this.componentService.getDynamicComponent(m);
        if (component) {
          let cachedAlertMessage = this.alertMessageCache[m];
          if (component.alertMessage.message !== cachedAlertMessage.message) {
            console.log('onRuleEvaluationChange: updated alert message for: ' + m);
            component.alertMessage = cachedAlertMessage;
          }
        }
      });
    }
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
    if (!component.supportsAlertMessage()) {
      return;
    }
    let alertMessage = this.getCachedAlertMessage(component.alertMessage);
    let valuePath = newMessage.valuePath;
    let keyPath = newMessage.keyPath;
    let message = newMessage.message;
    let isSameParent = component.isSameParent(keyPath);
    let isSameRef = component.context.ref === keyPath;
    let dontClearMessage = !this.okToClearAlertMessage(alertMessage, valuePath);
    if (isSameRef) {
      if (message) {
        alertMessage.valuePath = valuePath;
      } else if (dontClearMessage) {
        return;
      }
    } else {
      if (isSameParent || dontClearMessage) {
        return;
      }
      message = null;
    }
    if (newMessage.alertCallback && alertMessage.message !== message) {
      newMessage.alertCallback(message !== null);
    }
    console.debug('setComponentAlertMessage: ' + component.path + ' sameRef=' + isSameRef + ' sameParent=' + isSameParent +
      ' dontClearMessage=' + dontClearMessage +
      ' valuePath=' + Utils.stripPath(valuePath) + ' msg=' + message);
    alertMessage.message = message;
  }
  private okToClearAlertMessage(alertMessage: IAlertMessage, valuePath: string): boolean {
    return alertMessage.message && alertMessage.valuePath === valuePath;
  }
  private getCachedAlertMessage(alertMessage: IAlertMessage): IAlertMessage {
    let path = alertMessage.path;
    if (!(path in this.alertMessageCache)) {
      this.alertMessageCache[path] = Utils.cloneObject(alertMessage);
    }
    return this.alertMessageCache[path];
  }

}


