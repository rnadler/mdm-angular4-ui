import {RulesService} from "./rules/rules.service";
import {Input, OnDestroy, OnInit} from "@angular/core";
import {RuleSet} from "./rules/rule-set";
import {ModelService} from "./model/model.service";
import jp from "jsonpath";
import {ElementService} from "./element.service";
import {Rule} from "./rules/rule";
import {RuleTypeEnum} from "./rules/rule-type-enum";

type AlertCallback = (state: boolean) => any;

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
  parentRefPath: string;

  constructor(protected modelService: ModelService, private rulesService: RulesService) {}

  ngOnInit(): void {
    this.ruleSet = this.rulesService.createRuleSet(this);
    this.parentRefPath = this.getParent(this.context.ref);
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
  setAlertMessage(message: string, keyPath: string, valuePath: string, alertCallback: AlertCallback) {
      if (!this.supportsAlertMessage()) {
        return;
      }
      this.updateAlertMessage(message, keyPath, valuePath, alertCallback);
  }
  private updateAlertMessage(message: string = null, keyPath: string = null, valuePath: string = null, alertCallback: AlertCallback = null) {
    let isSameParent = this.isSameParent(keyPath);
    let isSameRef = this.context.ref === keyPath;
    if (isSameParent) {
      console.log('updateAlertMessage: ' + this.path + ' sameRef=' + isSameRef + ' sameParent=' + isSameParent + ' valuePath=' + this.stripPath(valuePath) + ' msg=' + message);
    }
    if (isSameRef) {
      if (message) {
        if (this.alertMessage) {
          return;
        }
        this.alertValuePath = valuePath;
      } else if (!this.okToClearAlertMessage(valuePath)) {
        return;
      }
    } else {
      if (isSameParent || !this.okToClearAlertMessage(valuePath)) {
        return;
      }
      message = null;
    }
    if (alertCallback && this.alertMessage !== message) {
      alertCallback(message !== null);
    }
    this.alertMessage = message;
  }
  private okToClearAlertMessage(valuePath: string): boolean {
    return this.alertMessage && this.alertValuePath === valuePath;
  }
  onAlertChange(state: boolean) {
    this.hidden = state;
    console.log('onAlertChange: ' + this.path + ' state=' + state);
  }
  supportsAlertMessage() {
    return false;
  }
  private isSameParent(keyPath: string) {
    return this.parentRefPath === this.getParent(keyPath);
  }
  private getParent(path: string) {
    if (!path) {
      return null;
    }
    let rv = path.split('.');
    rv.pop();
    return rv.join('.');
  }
  private stripPath(path: string) {
    if (!path) {
      return null;
    }
    return path.split('.').pop();
  }

  onChange(newValue: any) {
    console.log('onChange: ' + this.path + ' setting ref=' + this.context.ref + ' to newValue=' + newValue);
    this.updateAlertMessage();
    if (this.context.ref) {
      this.modelService.setValue(this.context.ref, newValue);
    } else {
      this.runActions();
    }
  }
  private runActions() {
    if (!this.context.actions) {
      return;
    }
    for (let action of this.context.actions) {
      if (action.action === 'set') {
        this.modelService.setValue(action.ref, action.value);
      } else if (action.action === 'revertFgData') {
        this.modelService.revertFgData();
      }
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
    // console.log(this.path + ' updateRelevance testResult/valid/relevant=' + testResult + '/' + this.isValid() + '/' + localRelevant + ' relevant=' + relevant +
    //     ' callUpdate=' + callUpdate + ' fromUpdate=' + fromUpdate);
    if (callUpdate) {
      this.update(false);
    }
  }
  isRelevant() {
    if (this.ruleSet) {
      if (!this.ruleSet.getRulesOfType(RuleTypeEnum.relevant)
          .map(r => r.getRelevantTestResult())
          .reduce((a, b) => a && b)) {
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
