import {RulesService} from "./rules/rules.service";
import {EventEmitter, Input, OnInit, Output} from "@angular/core";
import {RuleSet} from "./rules/rule-set";
import {ModelService} from "./model/model.service";
import jp from "jsonpath";
import {ElementService} from "./element.service";

export abstract class DynamicComponent implements OnInit {
  @Input() context: any;
  @Input() path: string;
  @Output() hiddenChangedEvent: EventEmitter<boolean> = new EventEmitter();
  type: string;
  hidden: boolean;
  elements: any;
  ruleSet: RuleSet;

  constructor(protected modelService: ModelService, private rulesService: RulesService) {}

  ngOnInit(): void {
    this.ruleSet = this.rulesService.createRuleSet(this);
  }
  update() {
    this.elements = [];
    let elements = jp.query(this.context, '$..controls')[0];
    for (let el in elements) {
      let context = elements[el];
      let type = context.ui != null ? context.ui : ElementService.DEFAULT;
      this.elements.push({context: context, path: this.getPath(el), type: type});
    }
  }

  onChange(newValue: any) {
    console.log('onChange: ' + this.path + ' setting ref=' + this.context.ref + ' to newValue=' + newValue);
    this.modelService.setValue(this.context.ref, newValue);
  }
  updateRelevance(testResult: boolean) {
    this.hidden = !testResult;
    this.hiddenChangedEvent.emit(!testResult);
    console.log(this.path + ' updateRelevance testResult=' + testResult);
  }
  private getPath(name: string) {
    if (this.path === undefined) {
      return name;
    }
    return this.path + '.' + name;
  }
}
