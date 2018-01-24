
import {ActionManager} from "./action.manager";
import {ModelService} from "./model/model.service";
import {MessagingService} from "./model/messaging.service";

class MockModelService extends ModelService {
  constructor() {
    super(new MessagingService());
  }
  public setValue(key, value) {}
  public revertFgData() {}
  public sendFgData() {}
}

describe('ActionManager Test', () => {
  let service: ActionManager;
  let mockModelService: MockModelService;

  beforeEach(() => {
    mockModelService = new MockModelService();
    service = new ActionManager(mockModelService)
  });

  it('#null input parameters', () => {
    service.runActions(null, null);
    service.runActions({actions: null}, null);
    service.runActions({actions: {thisIs: 'notAnArray'}}, null);
  });
  it('#ref should set value', () => {
    spyOn(mockModelService, 'setValue');
    service.runActions({ref: 'ref.path'}, 'newValue');
    expect(mockModelService.setValue).toHaveBeenCalledWith('ref.path', 'newValue');
  });
  it('#set should set value', () => {
    spyOn(mockModelService, 'setValue');
    service.runActions({actions: [{action: 'set', keyPath: 'key.path', value: 'value'}]}, null);
    expect(mockModelService.setValue).toHaveBeenCalledWith('key.path', 'value');
  });
  it('#set and ref should set value', () => {
    spyOn(mockModelService, 'setValue');
    service.runActions({actions: [{action: 'set', keyPath: 'key.path', value: 'value'}], ref: 'ref.path'}, 'newValue');
    expect(mockModelService.setValue).toHaveBeenCalledWith('key.path', 'value');
    expect(mockModelService.setValue).toHaveBeenCalledWith('ref.path', 'newValue');
    expect(mockModelService.setValue).toHaveBeenCalledTimes(2);
  });
  it('#revertFgData should be called', () => {
    spyOn(mockModelService, 'revertFgData');
    spyOn(mockModelService, 'setValue');
    service.runActions({actions: [{action: 'revertFgData'}, {action: 'revertFgData'}]}, null);
    expect(mockModelService.revertFgData).toHaveBeenCalledTimes(2);
    expect(mockModelService.setValue).toHaveBeenCalledTimes(0);
  });
  it('#sendFgData should be called', () => {
    spyOn(mockModelService, 'sendFgData');
    spyOn(mockModelService, 'setValue');
    service.runActions({actions: [{action: 'sendFgData'}]}, null);
    expect(mockModelService.sendFgData).toHaveBeenCalled();
    expect(mockModelService.setValue).toHaveBeenCalledTimes(0);
  });
});
