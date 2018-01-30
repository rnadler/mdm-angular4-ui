
import {Injectable} from "@angular/core";
import {ModelService} from "./model/model.service";
import {MessagingService} from "./model/messaging.service";
import {ButtonEvent} from "./model/button.event";
import {IDynamicComponent} from "./model/dynamic.component.interface";

@Injectable()
export class ActionManager {
  constructor(private modelService: ModelService, private messagingService: MessagingService) {}

  public runActions(component: IDynamicComponent, newValue: any) {
    if (component.supportsButtonEvent()) {
      this.messagingService.publish(new ButtonEvent(component.path, newValue))
    }
    let context = component.context;
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
