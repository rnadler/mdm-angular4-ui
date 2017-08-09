import {Injectable} from "@angular/core";
import jp from "jsonpath";
import {MessagingService} from "./messaging-service";
import {ModelUpdatedMessage} from "./model-updated-message";

@Injectable()
export class ModelService {
  private model: any;

  constructor(private messagingService: MessagingService) {}

  setModel(model: any) {
    this.model = model;
  }

  getValue(ref: string) {
    let val = jp.value(this.model, '$.' + ref);
    if (val === null) {
      console.error("ModelService: Failed to get ref=" + ref);
      return null;
    }
    return val;
  }

  setValue(ref: string, value: any) {
    return this.setContextValue(this.model, ref, value);
  }

  setContextValue(context: any, ref: string, value: any) {
    let rv = jp.apply(context, '$.' + ref, oldValue => value);
    if (rv.length === 0) {
      return null;
    }
    this.messagingService.publish(new ModelUpdatedMessage(ref, value));
    console.log('ModelService setValue ref=' + ref + ' value=' + value);
    return rv;
  }
}
