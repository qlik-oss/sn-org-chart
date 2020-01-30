import card, { getBackgroundColor, getFontColor } from '../card';

describe('card', () => {
  describe('getBackgroundColor', () => {
    let data;
    let cardStyling;
    beforeEach(() => {
      data = {
        attributes: {},
      };
      cardStyling = {
        backgroundColor: '#e6e6e6',
      };
    });
    it('should return backgroundColor', () => {
      const result = getBackgroundColor(data, cardStyling);
      expect(result).to.equal('#e6e6e6');
    });

    it('should return color from attribute expression', () => {
      data.attributes.color = 'green';
      const result = getBackgroundColor(data, cardStyling);
      expect(result).to.equal('rgba(0,128,0,1)');
    });

    it('should return backgroundColor when expression fails', () => {
      data.attributes.color = 'myFakeColor';
      const result = getBackgroundColor(data, cardStyling);
      expect(result).to.equal('#e6e6e6');
    });
  });

  describe('getFontColor', () => {
    let cardStyling;
    let backgroundColor;
    beforeEach(() => {
      cardStyling = {
        fontColor: 'default',
      };
      backgroundColor = '#484848';
    });

    it('should return light color for default font', () => {
      const result = getFontColor(cardStyling, backgroundColor);
      expect(result).to.equal('#e6e6e6');
    });

    it('should return dark color for default font', () => {
      backgroundColor = '#e6e6e6';
      const result = getFontColor(cardStyling, backgroundColor);
      expect(result).to.equal('#484848');
    });

    it('should return fontColor when no default is selected', () => {
      cardStyling.fontColor = 'myAwesomeColor';
      const result = getFontColor(cardStyling, backgroundColor);
      expect(result).to.equal('myAwesomeColor');
    });
  });

  describe('card', () => {
    function getHtml(html) {
      return `<div class="org-card-top" style="background-color:#737373;"></div><div class="org-card-textarea" style="background-color:#e6e6e6;color:#484848;">${html}</div>`;
    }
    let data;
    let cardStyling;
    beforeEach(() => {
      data = {
        id: 'someId',
        attributes: {},
      };
      cardStyling = { backgroundColor: '#e6e6e6', fontColor: 'default' };
    });

    it('should return html for root node', () => {
      data.id = 'Root';
      const result = card(data, cardStyling);
      expect(result).to.equal('<div class="org-root"/>');
    });

    it('should return html for node with only id', () => {
      const result = card(data, cardStyling);
      expect(result).to.equal(getHtml(`<div class="org-card-title">${data.id}</div>`));
    });

    it('should return html for node with attribute label', () => {
      data.attributes.label = 'this is the label';
      const result = card(data, cardStyling);
      expect(result).to.equal(getHtml('<div class="org-card-title">this is the label</div>'));
    });

    it('should return html for node with id and subLabel', () => {
      data.attributes.subLabel = 'subsub';
      const result = card(data, cardStyling);
      expect(result).to.equal(
        getHtml(
          `<div class="org-card-title">${data.id}</div><div class="org-card-text">${data.attributes.subLabel}</div>`
        )
      );
    });

    it('should return html for node with id and measure', () => {
      data.measure = 'measure';
      const result = card(data, cardStyling);
      expect(result).to.equal(
        getHtml(`<div class="org-card-title">${data.id}</div><div class="org-card-text">${data.measure}</div>`)
      );
    });
  });
});
