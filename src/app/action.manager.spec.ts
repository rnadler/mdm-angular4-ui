
import {ActionManager} from "./action.manager";
import {ModelService} from "./model/model.service";
import {IDynamicComponent} from "./model/dynamic.component.interface";
import {IAlertMessage} from "./model/alert.message";
import {MockMessagingService} from "./model/mock.messaging.service";

class MockModelService extends ModelService {
  constructor() {
    super(new MockMessagingService());
  }
  public setValue(key, value) {}
  public revertFgData() {}
  public sendFgData() {}
}

class MockDynamicComponent implements IDynamicComponent {
  alertMessage: IAlertMessage;
  context: any;
  path: string;
  _supportsButtonEvent: boolean;
  constructor(context: any, supportsButtonEvent: boolean = false) {
    this.context = context;
    this._supportsButtonEvent = supportsButtonEvent;
  }
  onAlertChange(state: boolean): void {
  }
  supportsAlertMessage(): boolean {
    return false;
  }
  supportsButtonEvent(): boolean {
    return this._supportsButtonEvent;
  }
  isSameParent(keyPath: string): boolean {
    return false;
  }
}

describe('ActionManager Test', () => {
  let service: ActionManager;
  let mockModelService: MockModelService;
  let mockMessagingService: MockMessagingService;

  beforeEach(() => {
    mockModelService = new MockModelService();
    mockMessagingService = new MockMessagingService();
    service = new ActionManager(mockModelService, mockMessagingService);
  });

  it('#null input parameters', () => {
    spyOn(mockMessagingService, 'publish');
    service.runActions(new MockDynamicComponent(null), null);
    service.runActions(new MockDynamicComponent({actions: null}), null);
    service.runActions(new MockDynamicComponent({actions: {thisIs: 'notAnArray'}}), null);
    expect(mockMessagingService.publish).toHaveBeenCalledTimes(0);
  });
  it('#ref should set value', () => {
    spyOn(mockModelService, 'setValue');
    service.runActions(new MockDynamicComponent({ref: 'ref.path'}), 'newValue');
    expect(mockModelService.setValue).toHaveBeenCalledWith('ref.path', 'newValue');
  });
  it('#set should set value', () => {
    spyOn(mockModelService, 'setValue');
    service.runActions(new MockDynamicComponent({actions: [{action: 'set', keyPath: 'key.path', value: 'value'}]}), null);
    expect(mockModelService.setValue).toHaveBeenCalledWith('key.path', 'value');
  });
  it('#set and ref should set value', () => {
    spyOn(mockModelService, 'setValue');
    service.runActions(new MockDynamicComponent({actions: [{action: 'set', keyPath: 'key.path', value: 'value'}], ref: 'ref.path'}), 'newValue');
    expect(mockModelService.setValue).toHaveBeenCalledWith('key.path', 'value');
    expect(mockModelService.setValue).toHaveBeenCalledWith('ref.path', 'newValue');
    expect(mockModelService.setValue).toHaveBeenCalledTimes(2);
  });
  it('#revertFgData should be called', () => {
    spyOn(mockModelService, 'revertFgData');
    spyOn(mockModelService, 'setValue');
    service.runActions(new MockDynamicComponent({actions: [{action: 'revertFgData'}, {action: 'revertFgData'}]}), null);
    expect(mockModelService.revertFgData).toHaveBeenCalledTimes(2);
    expect(mockModelService.setValue).toHaveBeenCalledTimes(0);
  });
  it('#sendFgData should be called', () => {
    spyOn(mockModelService, 'sendFgData');
    spyOn(mockModelService, 'setValue');
    service.runActions(new MockDynamicComponent({actions: [{action: 'sendFgData'}]}), null);
    expect(mockModelService.sendFgData).toHaveBeenCalled();
    expect(mockModelService.setValue).toHaveBeenCalledTimes(0);
  });
  it('#buttonEvent is called', () => {
    spyOn(mockMessagingService, 'publish');
    service.runActions(new MockDynamicComponent({actions: null}, true), null);
    expect(mockMessagingService.publish).toHaveBeenCalledTimes(1);
  });
});
