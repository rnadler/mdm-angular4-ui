import {Component} from "@angular/core";
import {DynamicComponent} from "../dynamic.component";
import {ElementService} from "../element.service";
import {UiStateService} from "../ui.state.service";

@Component({
  selector: 'repeat-element',
  template: `
    <div [attr.id]="path" class="panel panel-info" [hidden]="hidden">
      <div class="panel-heading" *ngIf="context.label">
        <h2 class="panel-title">{{context.label}}</h2>
      </div>
      <div class="container">
        <div class="row">
          <div *ngFor="let element of elements">
            <div class="column" *ngIf="!element.hidden">
              <dynamic-content [type]="element.type" [context]="element.context"
                               [path]="element.path" [element]="element"></dynamic-content>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class RepeatElementComponent extends DynamicComponent  {

  constructor(uiStateService: UiStateService) {
    super(uiStateService);
  }
  ngOnInit(): void {
    this.update();
    super.ngOnInit();
  }
}
ElementService.addElement('repeat', RepeatElementComponent);
