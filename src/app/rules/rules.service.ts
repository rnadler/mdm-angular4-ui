import {Injectable} from "@angular/core";
import {Rule} from "./rule";
import {RuleSet} from "./rule-set";
import {RuleTypeEnum} from "./rule-type-enum";
import {ModelService} from "../model/model.service";
import {DynamicComponent} from "../dynamic.component";
import {ComponentService} from "../component.service";

@Injectable()
export class RulesService {
  private ruleSets: Array<RuleSet> = [];
  private globalRuleSets: Array<RuleSet> = [];

  constructor(private modelService: ModelService, private componentService: ComponentService){}

  createRuleSet(component: any): RuleSet {
    let rules = [];
    this.addRule(rules, RuleTypeEnum.setup, component);
    this.addRule(rules, RuleTypeEnum.calculate, component);
    this.addRule(rules, RuleTypeEnum.relevant, component);
    if (rules.length === 0) {
      return null;
    }
    let ruleSet = new RuleSet(rules);
    ruleSet.addComponent(component);
    this.ruleSets.push(ruleSet);
    ruleSet.evaluateSetupRules();
    return ruleSet;
  }
  evaluateUpdateRules(ref: string) {
    let ruleSets = this.ruleSets.filter(r => ref === undefined || r.getComponentRefs().filter(r2 => r2 == ref).length > 0);
    if (ruleSets.length === 0 /* && this.componentService.getComponentsByRef(ref).length === 0 */) {
      ruleSets = this.ruleSets;
    }
    console.log('evaluateUpdateRules ref=' + ref + ' ruleSets=' + ruleSets.length);
    for (let ruleSet of ruleSets) {
      ruleSet.evaluateUpdateRules();
    }
    this.componentService.updateDynamicComponents(ref);
    console.log('evaluateUpdateRules complete: ' + this.getAllocationString() + ' ref=' + ref);
  }

  private getAllocationString() {
    return 'rulesets=' + this.ruleSets.length + ' components=' + this.componentService.length();
  }
  addGlobalRuleSet(rules: any) {
    this.globalRuleSets.push(this.createRuleSet({context: rules}));
  }
  addComponentToRuleSet(ruleSet: RuleSet, component: DynamicComponent) {
    let shouldAdd: boolean = false;
    if (component.context.ruleId) {
      shouldAdd = true;
      this.addMatchingComponent('ruleId', ruleSet.getIds(), component.context.ruleId, ruleSet, component);
    }
    let ref = component.context.ref;
    if (!shouldAdd && ref) {
      shouldAdd = true;
      if (!this.addMatchingComponent('keyPath', ruleSet.getKeyPaths(), ref, ruleSet, component)) {
        if (!this.addMatchingComponent('value', ruleSet.getValues(), ref, ruleSet, component)) {
          // this.addMatchingComponent('test', ruleSet.getTestVariables(), ref, ruleSet, component);
        }
      }
    }
    return shouldAdd;
  }
  addMatchingComponent( type: string, values: Array<string>, key: string, ruleSet: RuleSet,component: DynamicComponent) {
    if (values.filter(value => value === key).length > 0) {
      console.log('addGlobalRules added ' + type + ' component=' + component.path);
      ruleSet.addComponent(component);
      component.addRuleSet(ruleSet);
      return true;
    }
    return false;
  }
  addDynamicComponent(component: DynamicComponent) {
    if (this.componentService.addDynamicComponent(component)) {
      this.ruleSets.filter(rs => rs != component.ruleSet).forEach(rs => this.addComponentToRuleSet(rs, component));
      //this.globalRuleSets.forEach(rs => this.addComponentToRuleSet(rs, component));
    }
  }
  removeRuleSet(ruleSet: RuleSet) {
    if (ruleSet === null) {
      return;
    }
    this.ruleSets = this.ruleSets.filter(rs => rs !== ruleSet);
  }
  private addRule(rules: Array<Rule>, type: RuleTypeEnum, component: any) {
    let name = RuleTypeEnum[type];
    let ruleContext = component.context[name];
    if (ruleContext) {
      let rule = new Rule(type, this.modelService);
      for (let rd of ruleContext) {
        rule.addRuleDescption(rd);
      }
      rules.push(rule);
      console.log(component.path + ' Added rule ' + name + ' with length=' + rule.ruleDescriptions.length);
    }
  }
}
