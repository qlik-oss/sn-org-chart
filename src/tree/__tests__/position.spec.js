import position, { depthTranslation } from '../position';
import defaultValues from '../../__tests__/default-orgchart-props';

describe('position', () => {
  describe('position', () => {
    const orientation = 'ttb';
    const element = '';
    it('should return position object', () => {
      const { depthSpacing, isVertical, x, y } = position(orientation, element);
      expect(depthSpacing).to.equal(124);
      expect(isVertical).to.equal(true);
      expect(x).to.be.a('function');
      expect(y).to.be.a('function');
    });
  });

  describe('depthTranslation', () => {
    const depthSpacing = 124;
    let axis;
    let d;
    beforeEach(() => {
      axis = 'xActual';
      d = JSON.parse(JSON.stringify(defaultValues.nodes));
    });
    it('should return yActual for leaf node', () => {
      const yActual = depthTranslation(d, depthSpacing, axis);
      expect(yActual).to.equal(124);
    });
    it('should return yActual for leaf node', () => {
      d.parent.children = undefined;
      const yActual = depthTranslation(d, depthSpacing, axis);
      expect(yActual).to.equal(204);
    });
  });
});
