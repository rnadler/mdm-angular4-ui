import {RulesService} from "./rules/rules.service";
import {Input, OnDestroy, OnInit} from "@angular/core";
import {RuleSet} from "./rules/rule-set";
import {ModelService} from "./model/model.service";
import jp from "jsonpath";
import {ElementService} from "./element.service";
import {Rule} from "./rules/rule";
import {RuleTypeEnum} from "./rules/rule-type-enum";
import {AlertUpdatedMessage} from "./model/alert-updated-message";

export abstract class DynamicComponent implements OnInit, OnDestroy {
  @Input() context: any;
  @Input() path: string;
  type: string;
  hidden: boolean;
  elements: any;
  element: any;
  ruleSet: RuleSet;
  relevantRules: Array<Rule> = [];
  alertMessage: string;
  alertValuePath: string;

  constructor(protected modelService: ModelService, private rulesService: RulesService) {}

  ngOnInit(): void {
    this.ruleSet = this.rulesService.createRuleSet(this);
  }
  update(doUpdateRelevance: boolean = true) {
    this.elements = [];
    let elements = jp.query(this.context, '$..controls')[0];
    for (let el in elements) {
      let context = elements[el];
      let type = context.ui != null ? context.ui : ElementService.DEFAULT;
      this.elements.push({context: context, path: this.getPath(el), type: type, hidden: false});
    }
    if (doUpdateRelevance) {
      setTimeout(() => {
        this.updateRelevance(!this.hidden, true);
      });
    }
  }
  setAlertMessage(message: string, keyPath: string, valuePath: string) {
    if (this.context.ref === keyPath) {
      this.updateAlertMessage(message, valuePath);
    } else {
      this.clearAlertMessage(valuePath);
    }
  }
  private updateAlertMessage(message: string, valuePath: string) {
    if (message) {
      this.alertValuePath = valuePath;
    }
    if (!message && !this.okToClearAlertMessage(valuePath)) {
      return;
    }
    if (this.alertMessage !== message) {
      this.modelService.getMessagingService().publish(new AlertUpdatedMessage(message !== null));
    }
    this.alertMessage = message;
  }
  private clearAlertMessage(valuePath: string = null) {
    if (!this.okToClearAlertMessage(valuePath)) {
      return;
    }
    if (this.alertMessage) {
      this.modelService.getMessagingService().publish(new AlertUpdatedMessage(false));
    }
    this.alertMessage = null;
  }
  private okToClearAlertMessage(valuePath: string): boolean {
    return this.alertMessage && this.alertValuePath === valuePath;
  }

  onChange(newValue: any) {
    console.log('onChange: ' + this.path + ' setting ref=' + this.context.ref + ' to newValue=' + newValue);
    this.clearAlertMessage();
    if (this.context.ref) {
      this.modelService.setValue(this.context.ref, newValue);
    }
  }
  updateRelevance(testResult: boolean, fromUpdate: boolean = false) {
    let previousRelevant = !this.hidden;
    let localRelevant = this.isRelevant();
    let relevant = testResult && this.isValid() && localRelevant;
    this.hidden = !relevant;
    if (this.element) {
      this.element.hidden = this.hidden;
    }
    let callUpdate = !fromUpdate && relevant && !previousRelevant;
    console.log(this.path + ' updateRelevance testResult/valid/relevant=' + testResult + '/' + this.isValid() + '/' + localRelevant + ' relevant=' + relevant +
        ' callUpdate=' + callUpdate + ' fromUpdate=' + fromUpdate);
    if (callUpdate) {
      this.update(false);
    }
  }
  isRelevant() {
    if (this.ruleSet) {
      if (!this.ruleSet.getRulesOfType(RuleTypeEnum.relevant).map(r => r.getRelevantTestResult()).reduce((a, b) => a && b)) {
        return false;
      }
    }
    for (let rule of this.relevantRules) {
      if (!rule.getRelevantTestResult()) {
        return false;
      }
    }
    return true;
  }
  isValid() {
    return true;
  }
  addRuleSet(ruleSet: RuleSet) {
    for (let rule of ruleSet.getRulesOfType(RuleTypeEnum.relevant)) {
     this.relevantRules.push(rule);
     //console.log(this.path + ' addRuleSet added relevant rule from ruleSet=' + ruleSet.name + ' relevantRules=' + this.relevantRules.length);
    }
  }
  private getPath(name: string) {
    if (this.path === undefined) {
      return name;
    }
    return this.path + '.' + name;
  }
  ngOnDestroy() {
    this.rulesService.removeDynamicComponent(this);
  }
}
