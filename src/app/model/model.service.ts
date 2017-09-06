import {Injectable} from "@angular/core";
import jp from "jsonpath";
import {MessagingService} from "./messaging-service";
import {ModelUpdatedMessage} from "./model-updated-message";

@Injectable()
export class ModelService {
  private model: any;
  readonly FLOWGENERATOR: string = 'FlowGenerator';
  readonly VARIANT: string = 'Variant';

  constructor(private messagingService: MessagingService) {}

  setModel(model: any) {
    this.model = model;
  }

  getValue(ref: string) {
    return this.getContextValue(this.model, ref);
  }
  getContextValue(context: any, ref: string) {
    if (ref === undefined) {
      console.warn("ModelService: Undefined ref from context=" + JSON.stringify(context));
      return undefined;
    }
    const isString = typeof ref === 'string' || ref instanceof String;
    if (!isString) {
      return ref;
    }
    let val = jp.value(context, '$.' + ref);
    if (val === undefined && !ref.startsWith(this.FLOWGENERATOR)) {
      console.warn("ModelService: Failed to get ref=" + ref);
    }
    return val;
  }

  setValue(ref: string, value: any) {
    return this.setContextValue(this.model, ref, value);
  }

  setContextValue(context: any, ref: string, value: any) {
    let previousValue = this.getContextValue(context, ref);
    if (previousValue === value) {
      return value;
    }
    let rv = jp.apply(context, '$.' + ref, oldValue => value);
    if (rv.length === 0) {
      return null;
    }
    this.messagingService.publish(new ModelUpdatedMessage(ref, value));
    console.log('ModelService setValue ref=' + ref + ' value=' + value);
    return rv;
  }
  setFgData(fgData: any) {
    this.setValue(this.FLOWGENERATOR, fgData[this.FLOWGENERATOR]);
  }
  setVariantData(variantData: any) {
    this.setValue(this.VARIANT, variantData[this.VARIANT]);
  }
}
