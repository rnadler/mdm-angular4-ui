
// Misc. helper methods
export class Utils {

  static getParent(path: string) {
    if (!path) {
      return null;
    }
    let rv = path.split('.');
    rv.pop();
    return rv.join('.');
  }

  static stripPath(path: string) {
    if (!path) {
      return null;
    }
    return path.split('.').pop();
  }

  // Note: For some reason Object.assign({}, obj) did not work!?!
  static cloneObject(obj: any): any {
    return JSON.parse(JSON.stringify(obj))
  }
}
