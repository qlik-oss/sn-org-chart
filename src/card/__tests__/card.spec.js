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
    let data;
    let cardStyling;
    let selections;
    beforeEach(() => {
      data = {
        id: 'someId',
        attributes: {},
        elemNo: 5,
      };
      cardStyling = { backgroundColor: '#e6e6e6', fontColor: 'default', border: { show: 'top' } };
      selections = { api: { isActive: () => false } };
    });

    it('should return html for node with only id', () => {
      data.attributes = null;
      const result = card(data, cardStyling, selections);
      expect(result).to.equal(
        '<div class="sn-org-card-text" style="background-color:#e6e6e6;color:#484848; border:; border-top:3px solid #737373; height:61px;"><div class="sn-org-card-title">someId</div></div>'
      );
    });

    it('should return html for node with attribute label', () => {
      data.attributes.label = 'this is the label';
      const result = card(data, cardStyling, selections);
      expect(result).to.include('<div class="sn-org-card-title">this is the label</div>');
    });

    it('should return html for node with id and subLabel', () => {
      data.attributes.subLabel = 'subsub';
      const result = card(data, cardStyling, selections);
      expect(result).to.include('<div class="sn-org-card-title">someId</div>');
      expect(result).to.include('<div class="sn-org-card-label">subsub</div>');
    });

    it('should return html for node with three labels', () => {
      data.attributes.label = 'this is the label';
      data.attributes.subLabel = 'subsub';
      data.attributes.extraLabel = 'extra';
      const result = card(data, cardStyling, selections);
      expect(result).to.include('<div class="sn-org-card-title">this is the label</div>');
      expect(result).to.include('<div class="sn-org-card-label">subsub</div>');
      expect(result).to.include('<div class="sn-org-card-label">extra</div>');
    });

    it('should return html for node with three labels and measure', () => {
      data.attributes.label = 'this is the label';
      data.attributes.subLabel = 'subsub';
      data.attributes.extraLabel = 'extra';
      data.measure = 'measure';
      const result = card(data, cardStyling, selections);
      expect(result).to.include('<div class="sn-org-card-label">subsub</div>');
      expect(result).to.not.include('<div class="sn-org-card-label">extra</div>');
      expect(result).to.include('<div class="sn-org-card-label">measure</div>');
    });

    it('should return html for node with three labels and measure with label', () => {
      data.attributes.label = 'this is the label';
      data.attributes.subLabel = 'subsub';
      data.attributes.extraLabel = 'extra';
      data.measure = 'measure';
      cardStyling.measureLabel = 'measureLabel';
      const result = card(data, cardStyling, selections);
      expect(result).to.include('<div class="sn-org-card-label">subsub</div>');
      expect(result).to.not.include('<div class="sn-org-card-label">extra</div>');
      expect(result).to.include('<div class="sn-org-card-label">measureLabel: measure</div>');
    });

    it('should return html for node with id and measure', () => {
      data.measure = 'measure';
      const result = card(data, cardStyling, selections);
      expect(result).to.include('<div class="sn-org-card-title">someId</div>');
      expect(result).to.include('<div class="sn-org-card-label">measure</div>');
    });

    it('should return html for selected node in active state', () => {
      data.measure = 'measure';
      data.selected = true;
      selections = { api: { isActive: () => true }, state: [data.elemNo] };
      const result = card(data, cardStyling, selections);
      expect(result).to.include('<div class="sn-org-card-text selected"');
      expect(result).to.include('border:; border-top:;');
      expect(result).to.include('height:56px;');
    });

    it('should return html for not selected node in active state', () => {
      data.measure = 'measure';
      data.selected = false;
      selections = { api: { isActive: () => true }, state: [7] };
      const result = card(data, cardStyling, selections);
      expect(result).to.include('<div class="sn-org-card-text not-selected"');
      expect(result).to.include('border:; border-top:3px solid #737373;');
      expect(result).to.include('height:61px;');
    });

    it('should return html for card with all borders', () => {
      cardStyling.border.show = 'all';
      const result = card(data, cardStyling, selections);
      expect(result).to.include('border:1px solid #737373; border-top:3px solid #737373;');
      expect(result).to.include('height:60px;');
    });

    it('should return html for card with no borders', () => {
      cardStyling.border.show = 'none';
      const result = card(data, cardStyling, selections);
      expect(result).to.include('border:; border-top:;');
      expect(result).to.include('height:64px;');
    });
  });
});
