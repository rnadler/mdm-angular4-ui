import { MdmUiPage } from './app.po';

describe('mdm-ui App', () => {
  let page: MdmUiPage;

  beforeEach(() => {
    page = new MdmUiPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
