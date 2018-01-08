
import {RuleDescription} from "./rule-description";
import {TestEvaluator} from "./test-evaluator";
import {RuleTypeEnum} from "./rule-type-enum";
import {ModelService} from "../model/model.service";
import {DynamicComponent} from "../dynamic.component";
import {MessagingService} from "../model/messaging-service";
import {AlertUpdatedMessage} from "../model/alert-updated-message";
import {IAlertMessage} from "../model/alert.message";

export class Rule {
  type: RuleTypeEnum;
  ruleDescriptions: Array<RuleDescription>;
  private modelService: ModelService;
  private messagingService: MessagingService;

  constructor(type: RuleTypeEnum, modelService: ModelService, messagingService: MessagingService) {
    this.type = type;
    this.ruleDescriptions = [];
    this.modelService = modelService;
    this.messagingService = messagingService;
  }
  addRuleDescption(ruleDesc: any) {
    this.ruleDescriptions.push(ruleDesc);
  }
  getKeyPaths() {
    return this.ruleDescriptions.filter(rd => rd.keyPath !== undefined).map(rd => rd.keyPath);
  }
  getValues() {
    return this.ruleDescriptions.filter(rd => rd.value !== undefined).map(rd => rd.value);
  }
  getIds() {
    return this.ruleDescriptions.filter(rd => rd.id !== undefined).map(rd => rd.id);
  }
  getTestVariables() {
    return this.ruleDescriptions.map(rd => new TestEvaluator(rd.test).getVariables()).reduce((a, b) => a.concat(b));
  }
  getRelevantTestResult() {
    if (this.type !== RuleTypeEnum.relevant) {
      return false;
    }
    for (let ruleDescription of this.ruleDescriptions) {
      let test = ruleDescription.test;
      let testResult = new TestEvaluator(test, this.modelService).evaluate();
      //console.log('getRelevantTestResult testText=' + test + ' testResult=' + testResult);
      if (!testResult) {
        return false;
      }
    }
    return true;
  }
  evaluateRules(components: Array<DynamicComponent>, ruleSetName: string) {
    if (components.length === 0) {
      return;
    }
    for (let rd in this.ruleDescriptions) {
      let ruleDescription = this.ruleDescriptions[rd];
      let test = ruleDescription.test;
      let label = ruleSetName + ':' + RuleTypeEnum[this.type] + '[' + rd + '] ';
      let testResult = new TestEvaluator(test, this.modelService).evaluate();
      //console.log('test ' + label + 'testText=' + test + ' testResult=' + testResult);
      if (this.type === RuleTypeEnum.relevant) {
        this.updateComonentsRelevance(components, testResult);
        return;
      }
      let message = ruleDescription.message;
      let valuePath = ruleDescription.value;
      let keyPath = ruleDescription.keyPath;
      let alertMessage = <IAlertMessage>{message: message, keyPath: keyPath, valuePath: valuePath};
      if (testResult) {
        if (message) {
          this.updateAlertMessage(components, alertMessage);
        } else if (valuePath) {
          let value = this.modelService.getValue(valuePath);
          this.setComponentsValue(components, keyPath, value);
          console.log('evaluate ' + label + 'set keyPath=' + keyPath + ' to value=' + value);
          this.updateComonents(components);
        }
      } else if (message) {
        alertMessage.message = null; // clear message when !testResult
        this.updateAlertMessage(components, alertMessage);
      }
    }
  }
  private updateAlertMessage(components: Array<DynamicComponent>, alertMessage: IAlertMessage) {
    let self = this;
    components.forEach(c => {
      c.setAlertMessage(alertMessage, (state) =>
        self.messagingService.publish(new AlertUpdatedMessage(state, c.path)))
    });
  }
  private updateComonents(components: Array<DynamicComponent>) {
    components.forEach(c => c.update());
  }
  private updateComonentsRelevance(components: Array<DynamicComponent>, testResult) {
    components.filter(c => typeof c.updateRelevance === 'function')
      .forEach(c => c.updateRelevance(testResult));
  }
  private setComponentsValue(components: Array<DynamicComponent>, keyPath, value) {
    if (this.modelService.setValue(keyPath, value) === null) {
      components.forEach(c => this.modelService.setContextValue(c.context, keyPath, value));
    }
  }
}
