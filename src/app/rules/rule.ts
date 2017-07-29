
import {RuleDescription} from "./rule-description";
import {TestEvaluator} from "./test-evaluator";
import {RuleTypeEnum} from "./rule-type-enum";
import {ModelService} from "../model/model.service";

export class Rule {
  type: RuleTypeEnum;
  ruleDescriptions: Array<RuleDescription>;

  constructor(type: RuleTypeEnum) {
    this.type = type;
    this.ruleDescriptions = [];
  }
  addRuleDescption(ruleDesc: any) {
    this.ruleDescriptions.push(ruleDesc);
  }
  evaluateRules(component: any) {
    for (let rd in this.ruleDescriptions) {
      let ruleDescription = this.ruleDescriptions[rd];
      let test = ruleDescription.test;
      let label = RuleTypeEnum[this.type] + '[' + rd + '] ';
      let testResult = new TestEvaluator(test).evaluate();
      console.log(component.path + ' test ' + label + 'testText=' + test + ' testResult=' + testResult);
      let keyPath = ruleDescription.keyPath;
      if (testResult && keyPath) {
        let value = ModelService.getValue(ruleDescription.value);
        let setRv = ModelService.setValue(keyPath, value);
        if (setRv === null) {
          setRv = ModelService.setContextValue(component.context, keyPath, value);
        }
        console.log(component.path + ' evaluate ' + label + 'set keyPath=' + keyPath + ' to value=' + value);
          //' setRv=' + JSON.stringify(setRv));
        component.update();
      } else if (this.type === RuleTypeEnum.relevant) {
        component.updateRelevance(testResult);
      }
    }
  }
}
