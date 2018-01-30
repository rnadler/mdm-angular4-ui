import {ElementService} from "../element.service";

export class ButtonEvent {
  constructor(public path: string, public message: any) {}
}
ElementService.addElement('ButtonEvent', ButtonEvent);
