
import jp from "jsonpath";
import {MessagingService} from "./messaging-service";
import {ModelUpdatedMessage} from "./model-updated-message";

export class ModelService {
  private static model: any;

  static setModel(model: any) {
    this.model = model;
  }

  static getValue(ref: string) {
    let val = jp.value(this.model, '$.' + ref);
    if (val === null) {
      console.error("ModelService: Failed to get ref=" + ref);
      return null;
    }
    return val;
  }

  static setValue(ref: string, value: any) {
    return ModelService.setContextValue(this.model, ref, value);
  }

  static setContextValue(context: any, ref: string, value: any) {
    let rv = jp.apply(context, '$.' + ref, oldValue => value);
    if (rv.length === 0) {
      return null;
    }
    MessagingService.publish(new ModelUpdatedMessage(ref, value));
    console.log('ModelService setValue ref=' + ref + ' value=' + value);
    return rv;
  }
}
