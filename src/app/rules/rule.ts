
import {RuleDescription} from "./rule-description";
import {TestEvaluator} from "./test-evaluator";
import {RuleTypeEnum} from "./rule-type-enum";
import {ModelService} from "../model/model.service";
import {DynamicComponent} from "../dynamic.component";

export class Rule {
  type: RuleTypeEnum;
  ruleDescriptions: Array<RuleDescription>;
  private modelService: ModelService;

  constructor(type: RuleTypeEnum, modelService: ModelService) {
    this.type = type;
    this.ruleDescriptions = [];
    this.modelService = modelService;
  }
  addRuleDescption(ruleDesc: any) {
    this.ruleDescriptions.push(ruleDesc);
  }
  getKeyPaths() {
    return this.ruleDescriptions.filter(rd => rd.keyPath).map(rd => rd.keyPath);
  }
  getIds() {
    return this.ruleDescriptions.filter(rd => rd.id).map(rd => rd.id);
  }
  evaluateRules(components: Array<DynamicComponent>) {
    for (let rd in this.ruleDescriptions) {
      let ruleDescription = this.ruleDescriptions[rd];
      let test = ruleDescription.test;
      let label = RuleTypeEnum[this.type] + '[' + rd + '] ';
      let testResult = new TestEvaluator(test, this.modelService).evaluate();
      //console.log('test ' + label + 'testText=' + test + ' testResult=' + testResult);
      let valuePath = ruleDescription.value;
      if (testResult && valuePath) {
        let keyPath = ruleDescription.keyPath;
        let value = this.modelService.getValue(valuePath);
        this.setComponentsValue(components, keyPath, value);
        console.log('evaluate ' + label + 'set keyPath=' + keyPath + ' to value=' + value);
        this.updateComonents(components);
      } else if (this.type === RuleTypeEnum.relevant) {
        this.updateComonentsRelevance(components, testResult);
      }
    }
  }
  private updateComonents(components: Array<DynamicComponent>) {
    for (let component of components) {
      component.update();
    }
  }
  private updateComonentsRelevance(components: Array<DynamicComponent>, testResult) {
    for (let component of components) {
      if(typeof component.updateRelevance === 'function') {
        component.updateRelevance(testResult);
      }
    }
  }
  private setComponentsValue(components: Array<DynamicComponent>, keyPath, value) {
    if (this.modelService.setValue(keyPath, value) === null) {
      for (let component of components) {
        this.modelService.setContextValue(component.context, keyPath, value);
      }
    }
  }
}
