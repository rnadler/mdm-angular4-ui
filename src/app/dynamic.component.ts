
import {Input, OnDestroy, OnInit} from "@angular/core";
import {RulesService} from "./rules/rules.service";
import {RuleSet} from "./rules/rule.set";
import {ModelService} from "./model/model.service";
import {ElementService} from "./element.service";
import {Rule} from "./rules/rule";
import {RuleTypeEnum} from "./rules/rule.type.enum";
import {UiStateService} from "./ui.state.service";
import {IAlertMessage} from "./model/alert.message";
import {Utils} from "./utils";

export abstract class DynamicComponent implements OnInit, OnDestroy {
  @Input() context: any;
  @Input() path: string;
  type: string;
  hidden: boolean;
  elements: any;
  element: any;
  private _ruleSet: RuleSet;
  private relevantRules: Array<Rule> = [];
  protected _alertMessage: IAlertMessage = <IAlertMessage>{};
  private parentRefPath: string;
  protected modelService: ModelService;
  private rulesService: RulesService;

  constructor(protected uiStateService: UiStateService) {
    this.modelService = this.uiStateService.modelService;
    this.rulesService = this.uiStateService.rulesService;
  }

  ngOnInit(): void {
    this._alertMessage.path = this.path;
    this._ruleSet = this.rulesService.createRuleSet(this);
    this.parentRefPath = Utils.getParent(this.context.ref);
  }
  getUiStateService() {
    return this.uiStateService;
  }
  get ruleSet(): RuleSet { return this._ruleSet; }
  get alertMessage(): IAlertMessage { return this._alertMessage; }
  set alertMessage(alertMessage: IAlertMessage) {
    this._alertMessage = alertMessage;
  }

  update(doUpdateRelevance: boolean = true) {
    this.elements = [];
    let elements = ModelService.getContextQuery(this.context, '$..controls');
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
  onAlertChange(state: boolean) {
    this.hidden = state;
    console.log('onAlertChange: ' + this.path + ' state=' + state);
  }
  supportsAlertMessage() {
    return false;
  }
  public isSameParent(keyPath: string) {
    return this.parentRefPath === Utils.getParent(keyPath);
  }

  onChange(newValue: any) {
    console.log('onChange: ' + this.path + ' setting ref=' + this.context.ref + ' to newValue=' + newValue);
    this.uiStateService.setComponentAlertMessage(this);
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
        this.modelService.setValue(action.keyPath, action.value);
      } else if (action.action === 'revertFgData') {
        this.modelService.revertFgData();
      } else if (action.action === 'sendFgData') {
        this.modelService.sendFgData();
      } else {
        console.warn('Unknown action! ' + action.action);
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
