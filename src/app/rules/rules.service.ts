import {Injectable} from "@angular/core";
import {Rule} from "./rule";
import {RuleSet} from "./rule-set";
import {RuleTypeEnum} from "./rule-type-enum";
import {ModelService} from "../model/model.service";
import {DynamicComponent} from "../dynamic.component";

@Injectable()
export class RulesService {
  private ruleSets: Array<RuleSet> = [];
  private globalRuleSet: RuleSet;
  // TODO: This shouldn't be here. Need a DynamicComponentService.
  private dynamicComponents: Array<DynamicComponent> = [];
  private evaluating: boolean = false;

  constructor(private modelService: ModelService){}

  createRuleSet(component: any): RuleSet {
    let rv = [];
    this.addRule(rv, RuleTypeEnum.setup, component);
    this.addRule(rv, RuleTypeEnum.calculate, component);
    this.addRule(rv, RuleTypeEnum.relevant, component);
    let ruleSet = new RuleSet(rv);
    ruleSet.addComponent(component);
    if (rv.length > 0) {
      this.ruleSets.push(ruleSet);
      ruleSet.evaluateSetupRules();
      ruleSet.evaluateRelevantRules();
    }
    return ruleSet;
  }
  evaluateUpdateRules(ref: string) {
    if (!this.evaluating) {
      this.evaluating = true;
      console.log('evaluateUpdateRules (total ruleSets=' + this.ruleSets.length + ')');
      for (let ruleSet of this.ruleSets) {
        ruleSet.evaluateRelevantRules();
        ruleSet.evaluateCalculateRules();
      }
      this.evaluating = false;
    }
    this.updateDynamicComponents(ref);
  }
  updateDynamicComponents(ref: string = undefined) {
    let components = this.dynamicComponents.filter(c => ref === undefined || c.context.ref === ref);
    for (let component of components) {
      component.update();
    }
  }
  addGlobalRules(rules: any) {
    let fakeComponent = {context: rules, path: 'global'};
    this.globalRuleSet = this.createRuleSet(fakeComponent);
    this.globalRuleSet.components = [];
  }
  addDynamicComponent(component: DynamicComponent) {
    let shouldAdd: boolean = false;
    if (component.context.ruleId) {
      shouldAdd = true;
      let ids = this.globalRuleSet.getIds()[0];
      if (ids.filter(id => id === component.context.ruleId).length > 0) {
        console.log('addGlobalRules added ruleId component=' + component.path);
        this.globalRuleSet.addComponent(component);
      }
    }
    if (!shouldAdd && component.context.ref) {
      shouldAdd = true;
      let keyPaths = this.globalRuleSet.getKeyPaths()[0];
      if (keyPaths.filter(kpath => kpath === component.context.ref).length > 0) {
        console.log('addGlobalRules added keyPath component=' + component.path);
        this.globalRuleSet.addComponent(component);
      }
    }

    if (shouldAdd) {
      this.dynamicComponents.push(component);
    }
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
