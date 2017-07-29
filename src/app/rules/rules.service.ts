
import {Rule} from "./rule";
import {RuleSet} from "./rule-set";
import {RuleTypeEnum} from "./rule-type-enum";

export class RulesService {
  private static ruleSets: Array<RuleSet> = [];

  static createRuleSet(component: any): RuleSet {
    let rv = [];
    this.addRule(rv, RuleTypeEnum.setup, component);
    this.addRule(rv, RuleTypeEnum.calculate, component);
    this.addRule(rv, RuleTypeEnum.relevant, component);
    let ruleSet = new RuleSet(component, rv);
    if (rv.length > 0) {
      this.ruleSets.push(ruleSet);
      ruleSet.evaluateSetupRules();
      ruleSet.evaluateRelevantRules();
    }
    return ruleSet;
  }
  static evaluateUpdateRules() {
    console.log('evaluateUpdateRules (total ruleSets=' + RulesService.ruleSets.length + ')');
    for (let ruleSet of this.ruleSets) {
      ruleSet.evaluateRelevantRules();
      ruleSet.evaluateCalculateRules();
    }
  }

  private static addRule(rules: Array<Rule>, type: RuleTypeEnum, component: any) {
    let name = RuleTypeEnum[type];
    let ruleContext = component.context[name];
    if (ruleContext) {
      let rule = new Rule(type);
      for (let rd of ruleContext) {
        rule.addRuleDescption(rd);
      }
      rules.push(rule);
      console.log(component.path + ' Added rule ' + name + ' with length=' + rule.ruleDescriptions.length);
    }
  }
}
