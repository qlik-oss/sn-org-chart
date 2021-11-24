import { getBBoxOfNodes, getTranslations, getInitialZoomState, applyTransform, getSnapshotZoom } from '../transform';

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
        };
        expect(translatoions).to.deep.equal(expected);
      });

      it('should return correct translations when scaleToWidth', () => {
        height = 2000;
        const translatoions = getTranslations(bBox, height, width);
        expected = {
          scaleFactor: 0.5,
          divTranslation: '0px, 250px',
        };
        expect(translatoions).to.deep.equal(expected);
      });
    });
  });

  describe('getInitialZoomState', () => {
    let element;
    let bBox;
    let navigationMode;
    beforeEach(() => {
      element = { clientWidth: 1000, clientHeight: 1000 };
      bBox = { width: 1000, height: 1000, x: 0, y: 0 };
      navigationMode = 'free';
    });

    it('should zoom in x direction', () => {
      bBox.width = 1936;
      const result = getInitialZoomState(bBox, element, navigationMode);
      expect(result).to.eql({ initialX: 32, initialY: 500, initialZoom: 2 });
    });

    it('should zoom in y direction', () => {
      bBox.height = 1936;
      const result = getInitialZoomState(bBox, element, navigationMode);
      expect(result).to.eql({ initialX: 500, initialY: 32, initialZoom: 2 });
    });

    it('should limit zoom to max zoom', () => {
      bBox.height = 10000000;
      const result = getInitialZoomState(bBox, element, navigationMode);
      expect(result).to.eql({ initialX: 2500, initialY: 32, initialZoom: 6 });
    });

    it('should not limit zoom to max zoom in expandAll mode', () => {
      bBox.height = 99999936;
      navigationMode = 'expandAll';
      const result = getInitialZoomState(bBox, element, navigationMode);
      expect(result).to.eql({ initialX: 49999500, initialY: 32, initialZoom: 100000 });
    });
  });

  describe('applyTransform', () => {
    const eventTransform = {
      k: 2,
      x: 100,
      y: 200,
    };
    const svg = {
      attr: sinon.spy(),
      classed: sinon.spy(),
    };
    const divBox = {
      attr: sinon.spy(),
      classed: sinon.spy(),
    };
    const height = 500;
    const width = 1000;

    it('should add classes, set transform and style attributes', () => {
      applyTransform(eventTransform, svg, divBox, width, height);
      expect(svg.attr).to.be.calledWith('transform', eventTransform);
      expect(svg.classed).to.be.calledWith('org-disable-transition', true);
      expect(divBox.attr).to.be.calledWith(
        'style',
        `width:${width}px;height:${height}px; transform: translate(100px, 200px) scale(2)`
      );
      expect(divBox.classed).to.be.calledWith('org-disable-transition', true);
    });
  });

  describe('getSnapshotZoom', () => {
    let rect;
    let viewState;
    let initialTransform;

    beforeEach(() => {
      viewState = {
        size: {
          w: 100,
          h: 200,
        },
        transform: {
          x: 100,
          y: 200,
          zoom: 2,
        },
      };
      rect = {
        width: 1000,
        height: 500,
      };
      initialTransform = {
        x: 100,
        y: 200,
        zoom: 2,
      };
    });

    it('should return snapshotZoom object adjusted to height', () => {
      const snapshotZoom = { ...getSnapshotZoom(rect, viewState) };
      expect(snapshotZoom).to.eql({ k: 5, x: 250, y: 500 });
    });

    it('should return snapshotZoom object adjusted to width', () => {
      rect = {
        width: 500,
        height: 1000,
      };
      const snapshotZoom = { ...getSnapshotZoom(rect, viewState) };
      expect(snapshotZoom).to.eql({ k: 10, x: 500, y: 1000 });
    });

    it('should return snapshotZoom object from transform when viewstate not present', () => {
      const snapshotZoom = { ...getSnapshotZoom(rect, undefined, initialTransform) };
      expect(snapshotZoom).to.eql({ k: 2, x: 100, y: 200 });
    });
  });
});
