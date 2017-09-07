
import {ModelService} from "./model.service";
import {MessagingService} from "./messaging-service";

describe('ModelService Test', () => {
  let service: ModelService;

  beforeEach(() => {
    service = new ModelService(new MessagingService());
    service.setModel({
      data: 'test data'
    });
  });

  it('#getValue of undefined ref should return undefined', () => {
    expect(service.getValue(undefined)).toBe(undefined);
  });
  it('#getValue of object ref should return object', () => {
    const ref = Object({test: true});
    expect(service.getValue(ref)).toBe(ref);
  });
  // it('#getValue of string ref should return data', () => {
  //   expect(service.getValue('data')).toBe('test data');
  // });
});
