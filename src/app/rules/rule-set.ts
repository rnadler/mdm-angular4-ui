
import {Rule} from "./rule";
import {RuleTypeEnum} from "./rule-type-enum";

export class RuleSet {
  component: any;
  rules: Array<Rule>;

  constructor(component: any, rules: Array<Rule>) {
    this.component = component;
    this.rules = rules;
  }
  evaluateSetupRules() {
    this.evaluateRulesOfType(RuleTypeEnum.setup);
  }
  evaluateCalculateRules() {
    this.evaluateRulesOfType(RuleTypeEnum.calculate);
  }
  evaluateRelevantRules() {
    this.evaluateRulesOfType(RuleTypeEnum.relevant);
  }

  private evaluateRulesOfType(type: RuleTypeEnum) {
    for (let rule of this.getRulesOfType(type)) {
      rule.evaluateRules(this.component);
    }
  }
  private getRulesOfType(type: RuleTypeEnum) {
    let rv = [];
    for (let rule of this.rules) {
      if (type == null || rule.type === type) {
        rv.push(rule)
      }
    }
    return rv;
  }
}
