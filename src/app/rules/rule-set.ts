
import {Rule} from "./rule";
import {RuleTypeEnum} from "./rule-type-enum";

export class RuleSet {
  components: Array<any>;
  rules: Array<Rule>;

  constructor(rules: Array<Rule>) {
    this.rules = rules;
    this.components = [];
  }
  addComponent(component: any) {
    let path = component.context.path;
    if (this.components.filter(c => c.context.path === path).length == 0) {
      this.components.push(component);
    }
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

  getKeyPaths() {
    return this.rules.map(r => r.getKeyPaths());
  }
  private evaluateRulesOfType(type: RuleTypeEnum) {
    for (let rule of this.getRulesOfType(type)) {
      rule.evaluateRules(this.components);
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
