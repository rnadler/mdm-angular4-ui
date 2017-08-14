
import {RuleDescription} from "./rule-description";
import {TestEvaluator} from "./test-evaluator";
import {RuleTypeEnum} from "./rule-type-enum";
import {ModelService} from "../model/model.service";

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
    return [].concat(this.ruleDescriptions.filter(rd => rd.keyPath).map(rd => rd.keyPath));
  }
  evaluateRules(components: Array<any>) {
    for (let rd in this.ruleDescriptions) {
      let ruleDescription = this.ruleDescriptions[rd];
      let test = ruleDescription.test;
      let label = RuleTypeEnum[this.type] + '[' + rd + '] ';
      let testResult = new TestEvaluator(test, this.modelService).evaluate();
      console.log('test ' + label + 'testText=' + test + ' testResult=' + testResult);
      let keyPath = ruleDescription.keyPath;
      if (testResult && keyPath) {
        let value = this.modelService.getValue(ruleDescription.value);
        this.setComponentsValue(components, keyPath, value);
        console.log('evaluate ' + label + 'set keyPath=' + keyPath + ' to value=' + value);
          //' setRv=' + JSON.stringify(setRv));
        this.updateComonents(components);
      } else if (this.type === RuleTypeEnum.relevant) {
        this.updateComonentsRelevance(components, testResult);
      }
    }
  }
  private updateComonents(components: Array<any>) {
    for (let component of components) {
      component.update();
    }
  }
  private updateComonentsRelevance(components: Array<any>, testResult) {
    for (let component of components) {
      component.updateRelevance(testResult);
    }
  }
  private setComponentsValue(components: Array<any>, keyPath, value) {
    let setRv = this.modelService.setValue(keyPath, value);
    if (setRv === null) {
      for (let component of components) {
        setRv = this.modelService.setContextValue(component.context, keyPath, value);
      }
    }
  }
}
