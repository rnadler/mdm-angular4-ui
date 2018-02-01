
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
import {IDynamicComponent} from "./model/dynamic.component.interface";
import {ActionManager} from "./action.manager";
import {RelevanceBuilder} from "./relevance.builder";

export abstract class DynamicComponent implements OnInit, OnDestroy, IDynamicComponent {
  @Input() context: any;
  @Input() path: string;
  type: string;
  hidden: boolean;
  elements: any;
  element: any;
  private _ruleSet: RuleSet;
  private _relevantRules: Array<Rule> = [];
  protected _alertMessage: IAlertMessage = <IAlertMessage>{};
  private parentRefPath: string;
  protected modelService: ModelService;
  private rulesService: RulesService;
  private actionManager: ActionManager;

  constructor(protected uiStateService: UiStateService) {
    if (!uiStateService) {
      return;
    }
    this.modelService = this.uiStateService.modelService;
    this.rulesService = this.uiStateService.rulesService;
    this.actionManager = this.uiStateService.actionManager;
  }

  ngOnInit(): void {
    this._alertMessage.path = this.path;
    this._ruleSet = this.rulesService.createRuleSet(this);
    this.parentRefPath = Utils.getParent(this.context.ref);
  }
  getUiStateService() {
    return this.uiStateService;
  }
  get relevantRules(): Array<Rule> { return this._relevantRules; }
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
  supportsButtonEvent() {
    return false;
  }
  public isSameParent(keyPath: string) {
    return this.parentRefPath === Utils.getParent(keyPath);
  }

  onChange(newValue: any) {
    console.log('onChange: ' + this.path + ' setting ref=' + this.context.ref + ' to newValue=' + newValue);
    this.uiStateService.setComponentAlertMessage(this);
    this.actionManager.runActions(this, newValue);
  }

  updateRelevance(testResult: boolean, fromUpdate: boolean = false) {
    new RelevanceBuilder(this)
      .withTestResult(testResult)
      .withFromUpdate(fromUpdate)
      .build();
  }
  isValid() {
    return true;
  }
  addRuleSet(ruleSet: RuleSet) {
    for (let rule of ruleSet.getRulesOfType(RuleTypeEnum.relevant)) {
     this._relevantRules.push(rule);
     //console.log(this.path + ' addRuleSet added relevant rule from ruleSet=' + ruleSet.name + ' relevantRules=' + this._relevantRules.length);
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
