import {Input, OnInit} from "@angular/core";
import jp from "jsonpath";
import {RuleSet} from "./rules/rule-set";
import {RulesService} from "./rules/rules.service";

export class ContentContainer implements OnInit {
  elements: any;
  @Input() context: any;
  @Input() path: string;
  ruleSet: RuleSet;

  ngOnInit(): void {
    if (typeof this.context === 'string' || this.context instanceof String) {
      return;
    }
    this.elements = [];
    let elements = jp.query(this.context, '$..controls')[0];
    for (let el in elements) {
      this.elements.push({context: elements[el], path: this.getPath(el)});
    }
    this.ruleSet = RulesService.createRuleSet(this);
  }
  setContext(data: any) {
    this.context = data;
    this.ngOnInit();
  }
  private getPath(name: string) {
    if (this.path === undefined) {
      return name;
    }
    return this.path + '.' + name;
  }
  updateRelevance(testResult: boolean) {
    console.log(this.path + ' updateRelevance testResult=' + testResult);
  }
}
