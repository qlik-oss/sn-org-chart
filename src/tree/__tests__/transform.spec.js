import { getBBoxOfNodes, getTranslations, getInitialZoomState } from '../transform';

describe('transform', () => {
  describe('getBBoxOfNodes', () => {
    const nodes = [
      { xActual: 0, yActual: 0 },
      { xActual: -200, yActual: -100 },
      { xActual: 200, yActual: 100 },
    ];

    it('should return correct bBox', () => {
      const bbox = getBBoxOfNodes(nodes);
      const expected = {
        x: -200,
        y: -140,
        width: 552,
        height: 344,
      };
      expect(bbox).to.deep.equal(expected);
    });

    describe('getTranslations', () => {
      const bBox = {
        x: 0,
        y: 0,
        width: 500,
        height: 500,
      };
      let height;
      let width;
      let expected;

      beforeEach(() => {
        expected = {};
        width = 1000;
        height = 500;
      });

      it('should return correct translations', () => {
        const translatoions = getTranslations(bBox, height, width);
        expected = {
          scaleFactor: 1,
          divTranslation: '250px, 0px',
          svgTranslation: '250 0',
        };
        expect(translatoions).to.deep.equal(expected);
      });

      it('should return correct translations when scaleToWidth', () => {
        height = 2000;
        const translatoions = getTranslations(bBox, height, width);
        expected = {
          scaleFactor: 0.5,
          divTranslation: '0px, 250px',
          svgTranslation: '0 250',
        };
        expect(translatoions).to.deep.equal(expected);
      });
    });
  });

  describe('getInitialZoomState', () => {
    let element;
    let bBox;
    beforeEach(() => {
      element = { clientWidth: 1000, clientHeight: 1000 };
      bBox = { width: 1000, height: 1000, x: 0, y: 0 };
    });

    it('should zoom in x direction', () => {
      bBox.width = 1936;
      const result = getInitialZoomState(bBox, element);
      expect(result).to.eql({ initialX: 32, initialY: 500, initialZoom: 2 });
    });

    it('should zoom in y direction', () => {
      bBox.height = 1936;
      const result = getInitialZoomState(bBox, element);
      expect(result).to.eql({ initialX: 500, initialY: 32, initialZoom: 2 });
    });
  });
});
