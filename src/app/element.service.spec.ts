
import {ElementService} from "./element.service";

describe('ElementService test', () => {
  let service: ElementService;

  beforeEach(() => {
    ElementService.addElement('test1', 'component1');
    ElementService.addDefaultElement('defaultComponent');
  });

  it('#getComponent should return named component', () => {
    expect(ElementService.getComponent('test1')).toBe('component1');
  });
  it('#getComponent should return default component', () => {
    expect(ElementService.getComponent('xxx')).toBe('defaultComponent');
  });
});
