
import {Parser} from 'expr-eval';
import {ModelService} from "../model/model.service";
import {isNumeric} from "rxjs/util/isNumeric";

export class TestEvaluator {
  private test: string;
  expression: any;
  private modelService: ModelService;

  constructor(test: string, modelService: ModelService) {
    this.test = test;
    this.modelService = modelService;
    try {
      // Doesn't like periods in the variable names.
      this.expression = Parser.parse(test.replace(/\./g, '_'));
    } catch (e) {
      let tokens = String(this.test).split(' ');
      if (tokens.length == 1) {
        let t = tokens[0].toLowerCase();
        let tf = t == 'true' || t == 'yes';
        this.expression = Parser.parse(tf + ' == true');
      } else {
        console.error('Unable to parse test=' + this.test);
      }
    }
  }
  evaluate() : boolean {
    let vars = {};
    let variables = this.expression.variables();
    for (let vname of variables) {
      let value = this.modelService.getValue(vname.replace(/_/g,'.'));
      if (value != null) {
        vars[vname] = isNumeric(value) ? Number(value) : value;
      }
    }
    console.log(this.expression.toString() + ' evalVars=' +  JSON.stringify(vars));
    return this.expression.evaluate(vars);
  }
}
