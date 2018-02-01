
import {DynamicComponent} from "./dynamic.component";
import {RuleTypeEnum} from "./rules/rule.type.enum";

export class RelevanceBuilder {
  private _testResult: boolean;
  private _fromUpdate: boolean;

  constructor(private _component: DynamicComponent) {}

  withTestResult(testResult: boolean): RelevanceBuilder {
    this._testResult = testResult;
    return this;
  }

  withFromUpdate(fromUpdate: boolean): RelevanceBuilder {
    this._fromUpdate = fromUpdate;
    return this;
  }

  build(): boolean {
    let previousRelevant = !this._component.hidden;
    let localRelevant = this.isRelevant();
    let relevant = this._testResult && this._component.isValid() && localRelevant;
    this._component.hidden = !relevant;
    if (this._component.element) {
      this._component.element.hidden = this._component.hidden;
    }
    let callUpdate = !this._fromUpdate && relevant && !previousRelevant;
    // console.log(this.path + ' updateRelevance testResult/valid/relevant=' + testResult + '/' + this.isValid() + '/' + localRelevant +
    //     ' relevant/previous=' + relevant + '/' + previousRelevant + ' callUpdate=' + callUpdate + ' fromUpdate=' + fromUpdate);
    if (callUpdate) {
      this._component.update(false);
    }
    return relevant;
  }

  protected isRelevant(): boolean {
    if (this._component.ruleSet) {
      if (!this._component.ruleSet.getRulesOfType(RuleTypeEnum.relevant)
          .map(r => r.getRelevantTestResult())
          .reduce((a, b) => a && b)) {
        return false;
      }
    }
    for (let rule of this._component.relevantRules) {
      if (!rule.getRelevantTestResult()) {
        return false;
      }
    }
    return true;
  }
}
