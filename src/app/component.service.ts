import {Injectable} from "@angular/core";
import {DynamicComponent} from "./dynamic.component";

@Injectable()
export class ComponentService {
  private dynamicComponents: Array<DynamicComponent> = [];

  addDynamicComponent(component: DynamicComponent) {
    if (this.getDynamicComponent(component.path) === null) {
      this.dynamicComponents.push(component);
      console.log(this.dynamicComponents.length + ': add component ' + component.path);
      return true;
    }
    return false;
  }
  removeDynamicComponent(component: DynamicComponent) {
    this.dynamicComponents = this.dynamicComponents.filter(c => c !== component);
    console.log(this.dynamicComponents.length + ': remove component ' + component.path);
  }
  getDynamicComponent(path: string) {
    let results = this.dynamicComponents.filter(c => c.path === path);
    if (results.length === 0) {
      return null;
    }
    if (results.length > 1) {
      console.error('getDynamicComponent got ' + results.length + ' results for path=' + path);
      return null;
    }
    return results[0];
  }
  updateDynamicComponents(ref: string = undefined) {
    for (let component of this.getComponentsByRef(ref)) {
      component.update();
    }
  }
  getComponentsByRef(ref: string) {
    return this.dynamicComponents.filter(c => ref === undefined || c.context.ref === ref);
  }
  length() {
    return this.dynamicComponents.length;
  }
}
