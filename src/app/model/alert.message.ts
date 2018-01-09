import {AlertCallback} from "../ui.state.service";

export interface IAlertMessage {
  path: string,
  message: string,
  keyPath: string,
  valuePath: string
  alertCallback: AlertCallback
}
