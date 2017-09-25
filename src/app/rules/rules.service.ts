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
  private evaluating: boolean = false;

  constructor(private modelService: ModelService, private componentService: ComponentService){}

  createRuleSet(component: any): RuleSet {
    let rv = [];
    this.addRule(rv, RuleTypeEnum.setup, component);
    this.addRule(rv, RuleTypeEnum.calculate, component);
    this.addRule(rv, RuleTypeEnum.relevant, component);
    if (rv.length === 0) {
      return null;
    }
    let ruleSet = new RuleSet(rv);
    ruleSet.addComponent(component);
    this.ruleSets.push(ruleSet);
    ruleSet.evaluateSetupRules();
    // ToDo: Figure out why running ths relevant rules here causes this runtime error:
    // ERROR: ExpressionChangedAfterItHasBeenCheckedError: Expression has changed after it was checked. Previous value: 'true'. Current value: 'false'.
    //ruleSet.evaluateRelevantRules();
    return ruleSet;
  }
  evaluateUpdateRules(ref: string) {
    if (!this.evaluating) {
      this.evaluating = true;
      console.log('evaluateUpdateRules (total ruleSets=' + this.ruleSets.length + ')');
      for (let ruleSet of this.ruleSets) {
        ruleSet.evaluateUpdateRules();
      }
      this.componentService.updateDynamicComponents(ref);
      this.evaluating = false;
      console.log('evaluateUpdateRules complete: ' + this.getAllocationString());
    }
  }

  private getAllocationString() {
    return 'rulesets=' + this.ruleSets.length + ' components=' + this.componentService.length();
  }
  addGlobalRuleSet(rules: any) {
    let ruleSet = this.createRuleSet({context: rules});
    this.globalRuleSets.push(ruleSet);
  }
  addComponentToRuleSet(ruleSet: RuleSet, component: DynamicComponent) {
    let shouldAdd: boolean = false;
    if (component.context.ruleId) {
      shouldAdd = true;
      let ids = ruleSet.getIds();
      if (ids.filter(id => id === component.context.ruleId).length > 0) {
        console.log('addGlobalRules added ruleId component=' + component.path);
        ruleSet.addComponent(component);
      }
    }
    if (!shouldAdd && component.context.ref) {
      shouldAdd = true;
      let keyPaths = ruleSet.getKeyPaths();
      if (keyPaths.filter(kpath => kpath === component.context.ref).length > 0) {
        console.log('addGlobalRules added keyPath component=' + component.path);
        ruleSet.addComponent(component);
      }
    }
    return shouldAdd;
  }
  addDynamicComponent(component: DynamicComponent) {
    if (this.componentService.addDynamicComponent(component)) {
      this.globalRuleSets.forEach(rs => this.addComponentToRuleSet(rs, component));
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
