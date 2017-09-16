
import {Rule} from "./rule";
import {RuleTypeEnum} from "./rule-type-enum";
import {DynamicComponent} from "../dynamic.component";

export class RuleSet {
  components: Array<DynamicComponent>;
  rules: Array<Rule>;

  constructor(rules: Array<Rule>) {
    this.rules = rules;
    this.components = [];
  }
  addComponent(component: DynamicComponent) {
    let path = component.path;
    if (this.components.filter(c => c.path === path).length == 0) {
      this.components.push(component);
    }
  }
  evaluateUpdateRules() {
    this.evaluateCalculateRules();
    this.evaluateRelevantRules();
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
    return this.rules.map(r => r.getKeyPaths()).reduce((a, b) => a.concat(b));
  }
  getIds() {
    return this.rules.map(r => r.getIds()).reduce((a, b) => a.concat(b));
  }
  private evaluateRulesOfType(type: RuleTypeEnum) {
    let rules = this.rules.filter(r => type === null || r.type === type);
    for (let rule of rules) {
      rule.evaluateRules(this.components);
    }
  }
}
