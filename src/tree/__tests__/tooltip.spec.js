import { getTooltipStyle } from '../tooltip';

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

    it('', () => {
      const style = getTooltipStyle(d, constainerHeight, x, y, sel);
      expect(style).to.equal('bottom: 1014px;left: -43px;visibility: visible;opacity: 0.9;');
    });
  });

  describe('openTooltip', () => {});
});
