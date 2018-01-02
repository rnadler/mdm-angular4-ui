import {Injectable} from "@angular/core";
import {Rule} from "./rule";
import {RuleSet} from "./rule-set";
import {RuleTypeEnum} from "./rule-type-enum";
import {ModelService} from "../model/model.service";
import {DynamicComponent} from "../dynamic.component";
import {ComponentService} from "../component.service";
import {MessagingService} from "../model/messaging-service";
import {AlertUpdatedMessage} from "../model/alert-updated-message";

@Injectable()
export class RulesService {
  private ruleSets: Array<RuleSet> = [];

  constructor(private modelService: ModelService, private componentService: ComponentService,
              private messagingService: MessagingService){
    messagingService.of(AlertUpdatedMessage).subscribe(message => this.onAlertChange(message));
  }

  createRuleSet(component: any): RuleSet {
    let rules = [];
    this.addRule(rules, RuleTypeEnum.setup, component);
    this.addRule(rules, RuleTypeEnum.calculate, component);
    this.addRule(rules, RuleTypeEnum.relevant, component);
    if (rules.length === 0) {
      return null;
    }
    let ruleSet = new RuleSet(rules, component.context.label);
    ruleSet.addComponent(component);
    this.ruleSets.push(ruleSet);
    ruleSet.evaluateSetupRules();
    return ruleSet;
  }
  evaluateUpdateRules(ref: string) {
    let ruleSets = this.ruleSets.filter(r => ref === undefined || r.getComponentRefs().filter(r2 => r2 == ref).length > 0);
    console.log('evaluateUpdateRules ref=' + ref + ' ruleSets=' + ruleSets.length);
    for (let ruleSet of ruleSets) {
      ruleSet.evaluateUpdateRules();
    }
    this.componentService.updateDynamicComponents(ref);
    this.ruleSets.forEach(rs => rs.evaluateRelevantRules());
    console.log('evaluateUpdateRules complete: ' + this.getAllocationString() + ' ref=' + ref);
  }

  private getAllocationString() {
    return 'rulesets=' + this.ruleSets.length + ' components=' + this.componentService.length();
  }
  addGlobalRuleSet(rules: any) {
    this.createRuleSet({context: rules});
  }
  addComponentToRuleSet(ruleSet: RuleSet, component: DynamicComponent) {
    let added: boolean = false;
    let ruleId = component.context.ruleId;
    if (ruleId) {
      added = this.addMatchingComponent('ruleId', ruleSet.getIds(), ruleId, ruleSet, component);
    }
    let ref = component.context.ref;
    if (!added && ref) {
      if (!this.addMatchingComponent('keyPath', ruleSet.getKeyPaths(), ref, ruleSet, component)) {
        this.addMatchingComponent('value', ruleSet.getValues(), ref, ruleSet, component);
      }
    }
  }
  addMatchingComponent( type: string, values: Array<string>, key: string, ruleSet: RuleSet,component: DynamicComponent) {
    if (values.filter(value => value === key).length > 0) {
      console.debug('addGlobalRules added ' + type + ' ruleSet=' + ruleSet.name + ' component=' + component.path);
      ruleSet.addComponent(component);
      component.addRuleSet(ruleSet);
      return true;
    }
    return false;
  }
  addDynamicComponent(component: DynamicComponent) {
    if (this.componentService.addDynamicComponent(component)) {
      this.ruleSets.filter(rs => rs != component.ruleSet).forEach(rs => this.addComponentToRuleSet(rs, component));
    }
  }
  removeDynamicComponent(component: DynamicComponent) {
    this.componentService.removeDynamicComponent(component);
    if (component.ruleSet !== null) {
      this.ruleSets = this.ruleSets.filter(rs => rs !== component.ruleSet);
    }
    this.ruleSets.forEach(rs => rs.removeComponent(component));
    console.debug('removeDynamicComponent: ' + this.getAllocationString());
  }
  private addRule(rules: Array<Rule>, type: RuleTypeEnum, component: any) {
    let name = RuleTypeEnum[type];
    let ruleContext = component.context[name];
    if (ruleContext) {
      let rule = new Rule(type, this.modelService, this.messagingService);
      for (let rd of ruleContext) {
        rule.addRuleDescption(rd);
      }
      rules.push(rule);
      console.debug(component.path + ' Added rule ' + name + ' with length=' + rule.ruleDescriptions.length);
    }
  }
  private onAlertChange(message: AlertUpdatedMessage) {
    let component = this.componentService.getDynamicComponent(message.path);
    if (component && component.context.alert) {
      let alertComponent = this.componentService.getDynamicComponent(component.context.alert);
      if (alertComponent) {
        alertComponent.onAlertChange(message.state);
      }
    }
  }
}
