import {Injectable} from "@angular/core";
import {ModelService} from "./model/model.service";
import {RulesService} from "./rules/rules.service";

@Injectable()
export class UiStateService {

  constructor(public modelService: ModelService, public rulesService: RulesService) {}

}
