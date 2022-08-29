import { getTooltipStyle, getTooltipContent } from '../tooltip';
import encodeUtils from '../../utils/encoder';

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
    const transform = {
      zoom: 1,
      y: 1,
      x: 1,
    };

    it('Should return string containing style', () => {
      const style = getTooltipStyle(d, constainerHeight, x, y, transform);
      expect(style).toEqual('bottom:1014px;left:77px;');
    });
  });

  describe('getTooltipContent', () => {
    const htmlBegining = '<div class="sn-org-tooltip-inner"><div class="sn-org-tooltip-header">';
    let d;
    let styling;
    let content;
    encodeUtils.encodeTitle = jest.fn().mockImplementation((input) => input);

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
      styling = {
        measureLabel: '',
      };
    });

    it('Should return string containing id', () => {
      content = getTooltipContent(d, styling);
      expect(content).toEqual(`${htmlBegining}someId</div></div>`);
    });
    it('Should return string containing label', () => {
      d.data.attributes.label = 'someLabel';
      content = getTooltipContent(d, styling);
      expect(content).toEqual(`${htmlBegining}someLabel</div></div>`);
    });
    it('Should return string containing id and subLabel', () => {
      d.data.attributes.subLabel = 'someSubLabel';
      content = getTooltipContent(d, styling);
      expect(content).toEqual(`${htmlBegining}someId</div>someSubLabel<br /></div>`);
    });
    it('Should return string containing id, subLabel and extraLabel', () => {
      d.data.attributes.subLabel = 'someSubLabel';
      d.data.attributes.extraLabel = 'someExtraLabel';
      content = getTooltipContent(d, styling);
      expect(content).toEqual(`${htmlBegining}someId</div>someSubLabel<br />someExtraLabel<br /></div>`);
    });
    it('Should return string containing id and measure', () => {
      d.data.measure = 'someMeasure';
      content = getTooltipContent(d, styling);
      expect(content).toEqual(`${htmlBegining}someId</div>someMeasure</div>`);
    });
    it('Should return string containing id and measure', () => {
      d.data.measure = 'someMeasure';
      styling.measureLabel = 'someMeasureLabel';
      content = getTooltipContent(d, styling);
      expect(content).toEqual(`${htmlBegining}someId</div>someMeasureLabel: someMeasure</div>`);
    });
  });
});
