
import {ComponentService} from "./component.service";
import {DynamicComponent} from "./dynamic.component";


describe('ComponentService Test', () => {
  let service: ComponentService;

  beforeEach(() => {
    service = new ComponentService();
  });

  it('#addDynamicComponent adds new component', () => {
    let component = <DynamicComponent>{path: 'mypath'};
    expect(service.addDynamicComponent(component)).toBe(true);
    expect(service.addDynamicComponent(component)).toBe(false);
    expect(service.length).toBe(1);
  });
  it('#removeDynamicComponent removes component', () => {
    let component = <DynamicComponent>{path: 'mypath'};
    expect(service.addDynamicComponent(component)).toBe(true);
    expect(service.length).toBe(1);
    service.removeDynamicComponent(component);
    expect(service.length).toBe(0);
  });
  it('#getDynamicComponent gets a component', () => {
    expect(service.addDynamicComponent(<DynamicComponent>{path: 'mypath'})).toBe(true);
    expect(service.length).toBe(1);
    expect(service.getDynamicComponent('mypath').path).toBe('mypath');
    expect(service.getDynamicComponent('xxx')).toBe(null);
  });
  it('#getComponentsByRef gets components', () => {
    expect(service.addDynamicComponent(<DynamicComponent>{path: 'mypath', context: { ref: 'ref1'}})).toBe(true);
    expect(service.addDynamicComponent(<DynamicComponent>{path: 'mypath2', context: { ref: 'ref1'}})).toBe(true);
    expect(service.addDynamicComponent(<DynamicComponent>{path: 'mypath3', context: { ref: 'ref3'}})).toBe(true);
    expect(service.length).toBe(3);
    expect(service.getComponentsByRef('ref1').length).toBe(2);
    expect(service.getComponentsByRef(null).length).toBe(3);
  });

});
