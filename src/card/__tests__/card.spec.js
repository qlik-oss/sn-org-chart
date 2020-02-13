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
    function getHtml(html, selected) {
      if (selected === ' selected') {
        return `<div class="sn-org-card-text${selected}" style="background-color:#e6e6e6;color:#484848;">${html}</div>`;
      }
      if (selected) {
        return `<div class="sn-org-card-top" style="background-color:#737373;"></div><div class="sn-org-card-text${selected}" style="background-color:#e6e6e6;color:#484848;">${html}</div>`;
      }
      return `<div class="sn-org-card-top" style="background-color:#737373;"></div><div class="sn-org-card-text" style="background-color:#e6e6e6;color:#484848;">${html}</div>`;
    }
    let data;
    let cardStyling;
    let selections;
    beforeEach(() => {
      data = {
        id: 'someId',
        attributes: {},
        elemNo: 5,
      };
      cardStyling = { backgroundColor: '#e6e6e6', fontColor: 'default' };
      selections = { api: { isActive: () => false } };
    });

    it('should return html for root node', () => {
      data.id = 'Root';
      const result = card(data, cardStyling, selections);
      expect(result).to.equal('<div class="sn-org-root"/>');
    });

    it('should return html for node with only id', () => {
      const result = card(data, cardStyling, selections);
      expect(result).to.equal(getHtml(`<div class="sn-org-card-title">${data.id}</div>`));
    });

    it('should return html for node with attribute label', () => {
      data.attributes.label = 'this is the label';
      const result = card(data, cardStyling);
      expect(result).to.equal(getHtml(`<div class="org-card-title">${data.attributes.label}</div>`));
    });

    it('should return html for node with id and subLabel', () => {
      data.attributes.subLabel = 'subsub';
      const result = card(data, cardStyling, selections);
      expect(result).to.equal(
        getHtml(
          `<div class="sn-org-card-title">${data.id}</div><div class="sn-org-card-label">${data.attributes.subLabel}</div>`
        )
      );
    });
    it('should return html for node with three labels', () => {
      data.attributes.label = 'this is the label';
      data.attributes.subLabel = 'subsub';
      data.attributes.extraLabel = 'extra';
      const result = card(data, cardStyling, selections);
      expect(result).to.equal(
        getHtml(
          `<div class="sn-org-card-title">${data.attributes.label}</div><div class="sn-org-card-label">${data.attributes.subLabel}</div><div class="sn-org-card-label">${data.attributes.extraLabel}</div>`
        )
      );
    });
    it('should return html for node with three labels and measure', () => {
      data.attributes.label = 'this is the label';
      data.attributes.subLabel = 'subsub';
      data.attributes.extraLabel = 'extra';
      data.measure = 'measure';
      const result = card(data, cardStyling, selections);
      expect(result).to.equal(
        getHtml(
          `<div class="sn-org-card-title">${data.attributes.label}</div><div class="sn-org-card-label">${data.attributes.subLabel}</div><div class="sn-org-card-label">${data.measure}</div>`
        )
      );
    });
    it('should return html for node with id and measure', () => {
      data.measure = 'measure';
      const result = card(data, cardStyling, selections);
      expect(result).to.equal(
        getHtml(`<div class="sn-org-card-title">${data.id}</div><div class="sn-org-card-label">${data.measure}</div>`)
      );
    });

    it('should return html for selected node in active state', () => {
      data.measure = 'measure';
      data.selected = true;
      selections = { api: { isActive: () => true } };
      const result = card(data, cardStyling, selections, [data.elemNo]);
      expect(result).to.equal(
        getHtml(
          `<div class="sn-org-card-title">${data.id}</div><div class="sn-org-card-label">${data.measure}</div>`,
          ' selected'
        )
      );
    });

    it('should return html for not selected node in active state', () => {
      data.measure = 'measure';
      data.selected = false;
      selections = { api: { isActive: () => true } };
      const result = card(data, cardStyling, selections, [7]);
      expect(result).to.equal(
        getHtml(
          `<div class="sn-org-card-title">${data.id}</div><div class="sn-org-card-label">${data.measure}</div>`,
          ' not-selected'
        )
      );
    });
  });
});
