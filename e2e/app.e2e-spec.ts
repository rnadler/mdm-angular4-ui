import { MdmUiPage } from './app.po';

describe('mdm-ui App', () => {
  let page: MdmUiPage;

  beforeEach(() => {
    page = new MdmUiPage();
  });

  it('should display correct title', () => {
    page.navigateTo();
    expect(page.getTitleText()).toContain('Data Driven Angular')
  });
});
