
import jp from "jsonpath";

export class ModelService {
  private static model: any;

  static setModel(model: any) {
    this.model = model;
  }

  static getValue(ref: string) {
    if (this.model === null) {
      console.error("ModelService: No model set! ref=" + ref);
      return null;
    }
    let val = jp.query(this.model, '$.' + ref);
    if (val === null) {
      console.error("ModelService: Failed to find ref=" + ref);
      return null;
    }
    return val[0];
  }
}
