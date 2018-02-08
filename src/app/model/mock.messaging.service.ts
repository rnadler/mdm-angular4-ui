
import {MessagingService} from "./messaging.service";

export class MockMessagingService extends MessagingService {
  constructor() {
    super(null);
  }
  public publish(message: any) {}
}
