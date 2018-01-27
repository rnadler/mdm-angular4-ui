import { browser, by, element } from 'protractor';

export class MdmUiPage {
  navigateTo() {
    return browser.get('/');
  }

  getTitleText() {
    return element(by.css('h1')).getText();
  }
}
