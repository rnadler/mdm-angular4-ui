
// http://www.processinginfinity.com/weblog/2016/08/18/MessageBus-Pattern-in-Angular2-TypeScript
// https://angularclass.com/blog/create-a-simple-reactive-store-for-angular-2/

import {Observable} from "rxjs/Observable";
import {Subject} from "rxjs/Subject";
import "rxjs/add/operator/filter";
import {async} from "rxjs/scheduler/async";
import "rxjs/add/operator/observeOn";
import {Injectable} from "@angular/core";

interface Message {
  channel: string;
  data: any;
}

@Injectable()
export class MessagingService {
  private static _instance: MessagingService;
  private message$: Subject<Message> = new Subject<Message>();

  constructor() {
    MessagingService._instance = this;
  }
  public static getInstance(): MessagingService {
    if (!MessagingService._instance) {
      new MessagingService();
    }
    return MessagingService._instance;
  }
  public publish<T>(message: T): void {
    const channel = (<any>message.constructor).name;
    this.message$.next({ channel: channel, data: message });
  }

  public of<T>(messageType: { new(...args: any[]): T }): Observable<T> {
    const channel = (<any>messageType).name;
    return this.message$
      .observeOn(async)
      .filter(m => m.channel === channel).map(m => m.data);
  }
}
