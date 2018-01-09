
import {Rule} from "./rule";
import {RuleTypeEnum} from "./rule.type.enum";
import {DynamicComponent} from "../dynamic.component";

export class RuleSet {
  components: Array<DynamicComponent>;
  rules: Array<Rule>;
  name: string;

  constructor(rules: Array<Rule>, name: string) {
    this.rules = rules;
    this.name = name;
    this.components = [];
  }
  addComponent(component: DynamicComponent) {
    if (!component.path) {
      return;
    }
    let path = component.path;
    if (this.components.filter(c => c.path === path).length == 0) {
      this.components.push(component);
      console.debug('ruleSet addComponent ruleSet=' + this.name + ' component=' + path + ' components=' + this.components.length);
    }
  }
  removeComponent(component: DynamicComponent) {
    let startLength = this.components.length;
    this.components = this.components.filter(c => c.path !== component.path);
    if (startLength !== this.components.length) {
      console.debug('ruleSet removeComponent ruleSet=' + this.name + ' component=' + component.path +
        ' components=' + this.components.length);
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
    return RuleSet.getUnique(this.rules.map(r => r.getKeyPaths()).reduce((a, b) => a.concat(b)));
  }
  getValues() {
    return RuleSet.getUnique(this.rules.map(r => r.getValues()).reduce((a, b) => a.concat(b)));
  }
  getIds() {
    return RuleSet.getUnique(this.rules.map(r => r.getIds()).reduce((a, b) => a.concat(b)));
  }
  getTestVariables() {
    return RuleSet.getUnique(this.rules.map(r => r.getTestVariables()).reduce((a, b) => a.concat(b)));
  }
  getComponentRefs() {
    return this.components.map(c => c.context.ref);
  }
  getRulesOfType(type: RuleTypeEnum) {
    return this.rules.filter(r => type === null || r.type === type);
  }
  private evaluateRulesOfType(type: RuleTypeEnum) {
    for (let rule of this.getRulesOfType(type)) {
      rule.evaluateRules(this.components, this.name);
    }
  }
  static getUnique(values: Array<any>) {
    return values.filter((item, i, ar) => ar.indexOf(item) === i);
  }
}
