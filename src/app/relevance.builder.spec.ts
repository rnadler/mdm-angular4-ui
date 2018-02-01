
import {DynamicComponent} from "./dynamic.component";
import {RelevanceBuilder} from "./relevance.builder";

class MockDynamicComponent extends DynamicComponent {
  constructor() {
    super(null);
  }
  isValid() { return true; }
  update() {}
}

class MockRelevanceBuilder extends RelevanceBuilder {
  private _isRelevant: boolean;
  constructor(component: DynamicComponent) {
    super(component);
  }
  withIsRelevant(relevant: boolean) { this._isRelevant = relevant; return this; }
  isRelevant(): boolean { return this._isRelevant}
}

describe('RelevanceBuilder Test', () => {
  let builder: MockRelevanceBuilder;
  let mockDynamicComponent: MockDynamicComponent;

  beforeEach(() => {
    mockDynamicComponent = new MockDynamicComponent();
    builder = new MockRelevanceBuilder(mockDynamicComponent);
  });

  it('test result true', () => {
    spyOn(mockDynamicComponent, 'update');
    mockDynamicComponent.hidden = true;
    builder
      .withIsRelevant(true)
      .withFromUpdate(true)
      .withTestResult(true);
    expect(builder.build()).toBe(true);
    expect(mockDynamicComponent.update).toHaveBeenCalledTimes(0);
  });
  it('test result false', () => {
    mockDynamicComponent.hidden = true;
    builder
      .withIsRelevant(true)
      .withFromUpdate(true)
      .withTestResult(false);
    expect(builder.build()).toBe(false);
  });
  it('is relavent false', () => {
    mockDynamicComponent.hidden = true;
    builder
      .withIsRelevant(false)
      .withFromUpdate(true)
      .withTestResult(true);
    expect(builder.build()).toBe(false);
  });
  it('call update', () => {
    spyOn(mockDynamicComponent, 'update');
    mockDynamicComponent.hidden = true;
    builder
      .withIsRelevant(true)
      .withFromUpdate(false)
      .withTestResult(true);
    expect(builder.build()).toBe(true);
    expect(mockDynamicComponent.update).toHaveBeenCalledTimes(1);
  });
  it('do not call update if previous not relavent', () => {
    spyOn(mockDynamicComponent, 'update');
    mockDynamicComponent.hidden = false;
    builder
      .withIsRelevant(true)
      .withFromUpdate(false)
      .withTestResult(true);
    expect(builder.build()).toBe(true);
    expect(mockDynamicComponent.update).toHaveBeenCalledTimes(0);
  });
});
