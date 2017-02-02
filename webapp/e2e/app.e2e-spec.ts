import { UcgamesUiPage } from './app.po';

describe('ucgames-ui App', function() {
  let page: UcgamesUiPage;

  beforeEach(() => {
    page = new UcgamesUiPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
