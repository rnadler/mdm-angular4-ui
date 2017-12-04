import {Injectable} from "@angular/core";
import jp from "jsonpath";
import {MessagingService} from "./messaging-service";
import {ModelUpdatedMessage} from "./model-updated-message";

@Injectable()
export class ModelService {
  private model: any;
  private modelClone: any;
  readonly FLOWGENERATOR: string = 'FlowGenerator';
  readonly VARIANT: string = 'Variant';

  constructor(private messagingService: MessagingService) {}

  setModel(model: any) {
    this.model = model;
    this.modelClone = Object.assign({}, model);
  }
  revertModelValue(ref: string) {
    let value = this.getContextValue(this.modelClone, ref);
    console.log('ModelService revertModelValue ref=' + ref + ' value=' + value);
    return this.setValue(ref, value, false);
  }
  getValue(ref: string) {
    return this.getContextValue(this.model, ref);
  }
  getContextValue(context: any, ref: string) {
    if (context === undefined) {
      console.warn("ModelService: Undefined context! ref=" + ref);
      return undefined;
    }
    if (ref === undefined) {
      console.warn("ModelService: Undefined ref from context=" + JSON.stringify(context));
      return undefined;
    }
    if (typeof ref !== 'string') {
      return ref;
    }
    if (ref.indexOf("'") === 0) {
      return ref.replace(/[']+/g, '')
    }
    let val = jp.value(context, '$.' + ref);
    if (val === undefined && !ref.startsWith(this.FLOWGENERATOR)) {
      console.warn("ModelService: Failed to get ref=" + ref);
    }
    return val;
  }

  setValue(ref: string, value: any, publishMessage: boolean = true) {
    return this.setContextValue(this.model, ref, value, publishMessage);
  }

  setContextValue(context: any, ref: string, value: any, publishMessage: boolean = true) {
    let previousValue = this.getContextValue(context, ref);
    if (ref !== this.FLOWGENERATOR && ref !== this.VARIANT && previousValue === value) {
      return value;
    }
    let rv = jp.apply(context, '$.' + ref, oldValue => value);
    if (rv.length === 0) {
      console.warn('ModelService failed to setValue ref=' + ref + ' value=' + value);
      return null;
    }
    if (publishMessage) {
      this.messagingService.publish(new ModelUpdatedMessage(ref, value));
    }
    console.log('ModelService setValue ref=' + ref + ' value=' + value + ' publish=' + publishMessage);
    return rv;
  }
  setFgData(fgData: any) {
    this.setValue(this.FLOWGENERATOR, fgData[this.FLOWGENERATOR]);
  }
  setVariantData(variantData: any) {
    this.setValue(this.VARIANT, variantData[this.VARIANT]);
  }
}
