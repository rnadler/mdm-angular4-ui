
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
    if (!component.path) {
      return;
    }
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
  getValues() {
    return this.rules.map(r => r.getValues()).reduce((a, b) => a.concat(b));
  }
  getIds() {
    return this.rules.map(r => r.getIds()).reduce((a, b) => a.concat(b));
  }
  getComponentRefs() {
    return this.components.map(c => c.context.ref);
  }
  getRulesOfType(type: RuleTypeEnum) {
    return this.rules.filter(r => type === null || r.type === type);
  }
  private evaluateRulesOfType(type: RuleTypeEnum) {
    for (let rule of this.getRulesOfType(type)) {
      rule.evaluateRules(this.components);
    }
  }
}
