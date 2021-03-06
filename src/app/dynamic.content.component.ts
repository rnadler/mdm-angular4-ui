import {
  Component, Input, OnInit, OnDestroy,
  ViewChild, ViewContainerRef,
  ComponentFactoryResolver, ComponentRef
} from '@angular/core';
import {ElementService} from "./element.service";
import {DynamicComponent} from "./dynamic.component";
import {RulesService} from "./rules/rules.service";

@Component({
  selector: 'dynamic-content',
  template: `<div #container ></div>`
})
export class DynamicContentComponent implements OnInit, OnDestroy {

  @ViewChild('container', { read: ViewContainerRef })
  container: ViewContainerRef;
  @Input() type: string;
  @Input() context: any;
  @Input() path: string;
  @Input() element: any;
  private componentRef: ComponentRef<{}>;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver, private rulesService: RulesService) {
  }

  ngOnInit() {
    if (this.type) {
      let componentType = ElementService.getComponent(this.type);

      // note: componentType must be declared within module.entryComponents
      let factory = this.componentFactoryResolver.resolveComponentFactory(componentType);
      this.componentRef = this.container.createComponent(factory);

      // set component context
      let instance = <DynamicComponent> this.componentRef.instance;
      instance.context = this.context;
      instance.path = this.path;
      instance.type = this.type;
      instance.element = this.element;
      this.rulesService.addDynamicComponent(instance);
    }
  }
  ngOnDestroy() {
    if (this.componentRef) {
      this.componentRef.destroy();
      this.componentRef = null;
    }
  }

}
