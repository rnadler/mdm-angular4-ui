
// http://www.processinginfinity.com/weblog/2016/08/18/MessageBus-Pattern-in-Angular2-TypeScript

import {Observable} from "rxjs/Observable";
import {Subject} from "rxjs/Subject";
import "rxjs/add/operator/filter";
import {async} from "rxjs/scheduler/async";
import "rxjs/add/operator/observeOn";

interface Message {
  channel: string;
  data: any;
}

export class MessagingService {
  private static message$: Subject<Message> = new Subject<Message>();

  public static publish<T>(message: T): void {
    const channel = (<any>message.constructor).name;
    this.message$.next({ channel: channel, data: message });
  }

  public static of<T>(messageType: { new(...args: any[]): T }): Observable<T> {
    const channel = (<any>messageType).name;
    return this.message$
      .observeOn(async)
      .filter(m => m.channel === channel).map(m => m.data);
  }
}
