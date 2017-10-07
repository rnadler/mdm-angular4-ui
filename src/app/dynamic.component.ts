import {RulesService} from "./rules/rules.service";
import {Input, OnDestroy, OnInit} from "@angular/core";
import {RuleSet} from "./rules/rule-set";
import {ModelService} from "./model/model.service";
import jp from "jsonpath";
import {ElementService} from "./element.service";
import {ComponentService} from "./component.service";
import {Rule} from "./rules/rule";
import {RuleTypeEnum} from "./rules/rule-type-enum";

export abstract class DynamicComponent implements OnInit, OnDestroy {
  @Input() context: any;
  @Input() path: string;
  type: string;
  hidden: boolean;
  elements: any;
  element: any;
  ruleSet: RuleSet;
  relevantRules: Array<Rule> = [];

  constructor(protected modelService: ModelService, private rulesService: RulesService,
              private componentService: ComponentService) {}

  ngOnInit(): void {
    this.ruleSet = this.rulesService.createRuleSet(this);
  }
  update() {
    this.elements = [];
    let elements = jp.query(this.context, '$..controls')[0];
    for (let el in elements) {
      let context = elements[el];
      let type = context.ui != null ? context.ui : ElementService.DEFAULT;
      this.elements.push({context: context, path: this.getPath(el), type: type, hidden: false});
    }
    this.updateRelevance(!this.hidden);
  }

  onChange(newValue: any) {
    console.log('onChange: ' + this.path + ' setting ref=' + this.context.ref + ' to newValue=' + newValue);
    this.modelService.setValue(this.context.ref, newValue);
  }
  updateRelevance(testResult: boolean) {
    let localRelevant = this.isRelevant();
    let relevant = testResult && this.isValid() && localRelevant;
    this.hidden = !relevant;
    if (this.element) {
      this.element.hidden = this.hidden;
    }
    console.log(this.path + ' updateRelevance testResult/valid/relevant=' + testResult + '/' + this.isValid() + '/' + localRelevant + ' relevant=' + relevant );
  }
  isRelevant() {
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
    }
  }
  private getPath(name: string) {
    if (this.path === undefined) {
      return name;
    }
    return this.path + '.' + name;
  }
  ngOnDestroy() {
    this.rulesService.removeRuleSet(this.ruleSet);
    this.componentService.removeDynamicComponent(this);
  }
}
