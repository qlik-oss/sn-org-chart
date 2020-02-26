import position, { depthTranslation, widthTranslation } from '../position';
import defaultValues from '../../__tests__/default-orgchart-props';

describe('position', () => {
  describe('position', () => {
    const orientation = 'ttb';
    const element = '';
    it('should return position object', () => {
      const { depthSpacing, isVertical, x, y } = position(orientation, element);
      expect(depthSpacing).to.equal(120);
      expect(isVertical).to.equal(true);
      expect(x).to.be.a('function');
      expect(y).to.be.a('function');
    });
    it('should not return position when incorrect orientation', () => {
      expect(position('someOrientation', element)).to.be.undefined;
    });
  });

  describe('depthTranslation', () => {
    const depthSpacing = 124;
    let axis;
    let d;
    let initialZoomState;
    beforeEach(() => {
      axis = 'xActual';
      d = JSON.parse(JSON.stringify(defaultValues.nodes));
      initialZoomState = { initialX: 0, initialY: 0 };
    });
    it('should return yActual for node with initial offset', () => {
      initialZoomState.initialY = 100;
      const yActual = depthTranslation(d, depthSpacing, axis, initialZoomState);
      expect(yActual).to.equal(224);
    });
    it('should return yActual for node', () => {
      const yActual = depthTranslation(d, depthSpacing, axis, initialZoomState);
      expect(yActual).to.equal(124);
    });
    it('should return yActual for leaf node', () => {
      d.parent.children = undefined;
      const yActual = depthTranslation(d, depthSpacing, axis, initialZoomState);
      expect(yActual).to.equal(205);
    });
  });

  describe('widthTranslation', () => {
    const widthSpacing = 124;
    const element = {
      clientWidth: 1000,
    };
    let axis;
    let d;
    let initialZoomState;
    beforeEach(() => {
      axis = 'xActual';
      d = JSON.parse(JSON.stringify(defaultValues.nodes));
      initialZoomState = { initialX: 100, initialY: 0 };
    });
    it('should return xActual for node', () => {
      const xActual = widthTranslation(d, widthSpacing, element, axis, initialZoomState);
      expect(xActual).to.equal(125);
    });
    it('should return xActual for node, calculating xActual for parent recursively', () => {
      d.parent.xActual = undefined;
      const xActual = widthTranslation(d, widthSpacing, element, axis, initialZoomState);
      expect(xActual).to.equal(224);
    });
    it('should return xActual for node', () => {
      const xActual = widthTranslation(d, widthSpacing, element, axis, initialZoomState);
      expect(xActual).to.equal(125);
    });
    it('should return xActual for node with root parent and initialsZoom', () => {
      d.parent.data.id = 'Root';
      const xActual = widthTranslation(d, widthSpacing, element, axis, initialZoomState);
      expect(xActual).to.equal(225);
    });
    it('should return xActual for node with root parent and no initialsZoom', () => {
      d.parent.data.id = 'Root';
      const xActual = widthTranslation(d, widthSpacing, element, axis, {});
      expect(xActual).to.equal(125);
    });
    it('should return xActual for node without parent', () => {
      d = {};
      const xActual = widthTranslation(d, widthSpacing, element, axis, initialZoomState);
      expect(xActual).to.equal(100);
    });
    it('should return xActual for node without parent and no initialX', () => {
      d = {};
      initialZoomState.initialX = undefined;
      const xActual = widthTranslation(d, widthSpacing, element, axis, initialZoomState);
      expect(xActual).to.equal(0);
    });
  });
});
