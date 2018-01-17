import {IAlertMessage} from "./alert.message";

export interface IDynamicComponent {
  onAlertChange(state: boolean): void;
  supportsAlertMessage(): boolean;
  isSameParent(keyPath: string): boolean;
  alertMessage: IAlertMessage;
  context: any;
  path: string;
}
