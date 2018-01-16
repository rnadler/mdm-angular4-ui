
import {Injectable} from "@angular/core";
import {ModelService} from "./model/model.service";
import {RulesService} from "./rules/rules.service";
import {MessagingService} from "./model/messaging.service";
import {ComponentService} from "./component.service";
import {DynamicComponent} from "./dynamic.component";
import {IAlertMessage} from "./model/alert.message";
import {Utils} from "./utils";
import {RuleEvaluationStateEnum} from "./rules/rule.evaluation.state.enum";

interface IComponentHidden {
  hidden: boolean
}

@Injectable()
export class UiStateService {
  private alertMessageCache = {};
  private hiddenCache = {};

  constructor(public modelService: ModelService, public rulesService: RulesService,
              private messagingService: MessagingService, private componentService: ComponentService) {
  }

  public ruleEvaluationChange(state: RuleEvaluationStateEnum) {
    console.debug('onRuleEvaluationChange: ' + RuleEvaluationStateEnum[state]);
    if (state === RuleEvaluationStateEnum.start) {
      this.alertMessageCache = {};
      this.hiddenCache = {}
    } else if (state === RuleEvaluationStateEnum.end) {
      let keys = Object.keys(this.alertMessageCache);
      console.debug('onRuleEvaluationChange: cached message keys = ' + keys.length);
      keys.forEach((key) => {
        let component = this.componentService.getDynamicComponent(key);
        if (component) {
          component.alertMessage = this.alertMessageCache[key];
        }
      });
      keys = Object.keys(this.hiddenCache);
      console.debug('onRuleEvaluationChange: cached alert keys = ' + keys.length);
      keys.forEach((key) => {
        let alertComponent = this.componentService.getDynamicComponent(key);
        if (alertComponent) {
          alertComponent.onAlertChange(this.hiddenCache[key].hidden);
        }
      });
    }
  }

  private updateAlertComponent(component: DynamicComponent, message: string) {
    if (component.context.alert) {
      let alertComponent = this.componentService.getDynamicComponent(component.context.alert);
      if (alertComponent) {
        let componentHidden = this.getCachedHidden(alertComponent);
        componentHidden.hidden =  (message !== null) || componentHidden.hidden;
      }
    }
  }
  public updateAlertMessage(components: Array<DynamicComponent>, alertMessage: IAlertMessage) {
    let self = this;
    components.forEach(c => {
      let alert = Utils.cloneObject(alertMessage);
      alert.path = c.path;
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
    console.debug('setComponentAlertMessage: ' + component.path + ' sameRef=' + isSameRef + ' sameParent=' + isSameParent +
      ' dontClearMessage=' + dontClearMessage +
      ' valuePath=' + Utils.stripPath(valuePath) + ' msg=' + message);
    alertMessage.message = message;
    this.updateAlertComponent(component, message);
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
  private getCachedHidden(component: DynamicComponent): IComponentHidden {
    let path = component.path;
    if (!(path in this.hiddenCache)) {
      this.hiddenCache[path] = Utils.cloneObject(<IComponentHidden>{hidden: false});
    }
    return this.hiddenCache[path];
  }
}


