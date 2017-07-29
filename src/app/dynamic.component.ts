import {RulesService} from "./rules/rules.service";
import {OnInit} from "@angular/core";
import {RuleSet} from "./rules/rule-set";
import {ModelService} from "./model/model.service";

export abstract class DynamicComponent implements OnInit {
  context: any;
  path: string;
  ruleSet: RuleSet;

  ngOnInit(): void {
    this.ruleSet = RulesService.createRuleSet(this);
  }
  update() {}

  onChange(newValue: any) {
    console.log('onChange: ' + this.path + ' setting ref=' + this.context.ref + ' to newValue=' + newValue);
    ModelService.setValue(this.context.ref, newValue);
  }
}
