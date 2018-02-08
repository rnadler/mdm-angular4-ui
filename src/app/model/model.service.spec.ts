
import {ModelService} from "./model.service";
import {MockMessagingService} from "./mock.messaging.service";

describe('ModelService Test', () => {
  let service: ModelService;
  let mockMessagingService: MockMessagingService;

  beforeEach(() => {
    mockMessagingService = new MockMessagingService();
    service = new ModelService(mockMessagingService);
    service.setModel({
      data: 'test data',
      FlowGenerator: {
        fgData: 'value1'
      }
    });
  });

  it('#getValue of undefined ref should return undefined', () => {
    expect(service.getValue(undefined)).toBe(undefined);
  });
  it('#getValue of object ref should return the object', () => {
    const ref = Object({test: true});
    expect(service.getValue(ref)).toBe(ref);
  });
  it('#getValue of literal string ref should return the string', () => {
    expect(service.getValue("'data'")).toBe('data');
  });
  it('#getValue of string ref should return data', () => {
    expect(service.getValue('data')).toBe('test data');
  });
  it('#getContextQuery should return expected data', () => {
    expect(Object.keys(ModelService.getContextQuery({controls: { c1: 'a', c2: 'b'}}, '$..controls')).length).toBe(2);
  });
  it('#revertFgData should revert data', () => {
    expect(service.getValue('FlowGenerator.fgData')).toBe('value1');
    service.setValue('FlowGenerator.fgData', 'newValue');
    expect(service.getValue('FlowGenerator.fgData')).toBe('newValue');
    spyOn(mockMessagingService, 'publish');
    service.revertFgData();
    expect(service.getValue('FlowGenerator.fgData')).toBe('value1');
    expect(mockMessagingService.publish).toHaveBeenCalledTimes(1);
  });
});
