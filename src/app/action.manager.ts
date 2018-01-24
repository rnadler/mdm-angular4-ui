
import {Injectable} from "@angular/core";
import {ModelService} from "./model/model.service";

@Injectable()
export class ActionManager {
  constructor(private modelService: ModelService) {}

  public runActions(context: any, newValue: any) {
    if (!context) {
      return;
    }
    if (context.ref) {
      this.modelService.setValue(context.ref, newValue);
    }
    if (context.actions instanceof Array) {
      for (let action of context.actions) {
        if (action.action === 'set') {
          this.modelService.setValue(action.keyPath, action.value);
        } else if (action.action === 'revertFgData') {
          this.modelService.revertFgData();
        } else if (action.action === 'sendFgData') {
          this.modelService.sendFgData();
        } else {
          console.warn('Unknown action! ' + action.action);
        }
      }
    }
  }
}
