import { getTooltipStyle, getTooltipContent } from '../tooltip';

describe('tooltip', () => {
  describe('getTooltipStyle', () => {
    const d = {
      xActual: 0,
      yActual: 0,
      depthSpaceing: 200,
    };
    const constainerHeight = 1000;
    const x = () => d.xActual;
    const y = () => d.yActual;
    const sel = {
      transform: {
        zoom: 1,
        y: 1,
        x: 1,
      },
    };

    it('Should return string containing style', () => {
      const style = getTooltipStyle(d, constainerHeight, x, y, sel);
      expect(style).to.equal('bottom: 1014px;left: -43px;visibility: visible;opacity: 0.9;');
    });
  });

  describe('getTooltipContent', () => {
    let d;
    let cardStyling;
    let content;

    beforeEach(() => {
      d = {
        data: {
          id: 'someId',
          measure: null,
          attributes: {
            label: null,
            subLabel: null,
            extraLabel: null,
          },
        },
      };
      cardStyling = {
        measureLabel: '',
      };
    });

    it('Should return string containing id', () => {
      content = getTooltipContent(d, cardStyling);
      expect(content).to.equal('someId<br />');
    });
    it('Should return string containing label', () => {
      d.data.attributes.label = 'someLabel';
      content = getTooltipContent(d, cardStyling);
      expect(content).to.equal('someLabel<br />');
    });
    it('Should return string containing id and subLabel', () => {
      d.data.attributes.subLabel = 'someSubLabel';
      content = getTooltipContent(d, cardStyling);
      expect(content).to.equal('someId<br />someSubLabel<br />');
    });
    it('Should return string containing id, subLabel and extraLabel', () => {
      d.data.attributes.subLabel = 'someSubLabel';
      d.data.attributes.extraLabel = 'someExtraLabel';
      content = getTooltipContent(d, cardStyling);
      expect(content).to.equal('someId<br />someSubLabel<br />someExtraLabel<br />');
    });
    it('Should return string containing id and measure', () => {
      d.data.measure = 'someMeasure';
      content = getTooltipContent(d, cardStyling);
      expect(content).to.equal('someId<br />someMeasure');
    });
    it('Should return string containing id and measure', () => {
      d.data.measure = 'someMeasure';
      cardStyling.measureLabel = 'someMeasureLabel';
      content = getTooltipContent(d, cardStyling);
      expect(content).to.equal('someId<br />someMeasureLabel: someMeasure');
    });
  });
});
