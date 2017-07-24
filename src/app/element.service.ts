
export class ElementService {
  private static elementsMap = {};
  static DEFAULT: string = 'default';

  static addElement(name: string, component: any) {
    this.elementsMap[name] = component;
  }
  static addDefaultElement(component: any) {
    this.addElement(this.DEFAULT, component);
  }

  static getComponent(name: string) {
    let type = ElementService.elementsMap[name];
    return type || ElementService.elementsMap[ElementService.DEFAULT];
  }
}
