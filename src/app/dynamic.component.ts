import {RulesService} from "./rules/rules.service";
import {Input, OnDestroy, OnInit} from "@angular/core";
import {RuleSet} from "./rules/rule-set";
import {ModelService} from "./model/model.service";
import jp from "jsonpath";
import {ElementService} from "./element.service";
import {ComponentService} from "./component.service";

export abstract class DynamicComponent implements OnInit, OnDestroy {
  @Input() context: any;
  @Input() path: string;
  type: string;
  hidden: boolean;
  elements: any;
  element: any;
  ruleSet: RuleSet;

  constructor(protected modelService: ModelService, private rulesService: RulesService,
              private componentService: ComponentService) {}

  ngOnInit(): void {
    this.ruleSet = this.rulesService.createRuleSet(this);
  }
  update() {
    this.elements = [];
    let elements = jp.query(this.context, '$..controls')[0];
    for (let el in elements) {
      let context = elements[el];
      let type = context.ui != null ? context.ui : ElementService.DEFAULT;
      this.elements.push({context: context, path: this.getPath(el), type: type, hidden: false});
    }
    this.updateRelevance(!this.hidden);
  }

  onChange(newValue: any) {
    console.log('onChange: ' + this.path + ' setting ref=' + this.context.ref + ' to newValue=' + newValue);
    this.modelService.setValue(this.context.ref, newValue);
  }
  updateRelevance(testResult: boolean) {
    let relevant = testResult && this.isValid();
    this.hidden = !relevant;
    if (this.element) {
      this.element.hidden = this.hidden;
    }
    console.log(this.path + ' updateRelevance testResult/valid=' + testResult + '/' + this.isValid() + ' relevant=' + relevant );
  }
  isValid() {
    return true;
  }
  private getPath(name: string) {
    if (this.path === undefined) {
      return name;
    }
    return this.path + '.' + name;
  }
  ngOnDestroy() {
    this.rulesService.removeRuleSet(this.ruleSet);
    this.componentService.removeDynamicComponent(this);
  }
}
