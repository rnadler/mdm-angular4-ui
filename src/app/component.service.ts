import {Injectable} from "@angular/core";
import {DynamicComponent} from "./dynamic.component";

@Injectable()
export class ComponentService {
  private dynamicComponents: Array<DynamicComponent> = [];

  addDynamicComponent(component: DynamicComponent) {
    if (this.getDynamicComponent(component.path) === null) {
      this.dynamicComponents.push(component);
      return true;
    }
    return false;
  }
  removeDynamicComponent(component: DynamicComponent) {
    this.dynamicComponents = this.dynamicComponents.filter(c => c !== component);
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
    let components = this.dynamicComponents.filter(c => ref === undefined || c.context.ref === ref);
    for (let component of components) {
      component.update();
    }
  }
  length() {
    return this.dynamicComponents.length;
  }
}
