import { getPoints, getPath } from './path';

describe('path', () => {
  describe('getPath', () => {
    const r = 30;
    const points = [
      { x: 0, y: 0 },
      { x: 100, y: 0 },
      { x: 100, y: 200 },
      { x: 200, y: 200 },
    ];
    const expected = 'M 0 0 L 70 0 Q 100 0 100 30 L 100 170 Q 100 200 130 200 L 170 200';

    it('should create a path', () => {
      const path = getPath(points, r);
      expect(path).to.equal(expected);
    });
  });

  describe('getPoints', () => {
    let isVertical;
    let nodeSize;
    let parent;
    let d;
    let o;
    let expectedPoints;

    beforeEach(() => {
      isVertical = true;
      nodeSize = {
        width: 200,
        height: 100,
      };
      parent = {
        xActual: 0,
        yActual: 0,
        children: [{
          children: [{}],
        }],
      };
      d = {
        parent,
        xActual: 300,
        yActual: 200,
      };
      o = {
        nodeSize,
        depthSpacing: nodeSize.height + 100,
        x: node => node.xActual,
        y: node => node.yActual,
      };
    });

    it('should return points for vertical tree', () => {
      expectedPoints = [
        { x: 400, y: 250 },
        { x: 400, y: 150 },
        { x: 100, y: 150 },
        { x: 100, y: 50 }
      ];
      const points = getPoints(d, o, isVertical);
      expect(points).to.deep.equal(expectedPoints);
    });

    it('should return points for horizontal tree', () => {
      isVertical = false;
      o.depthSpacing = nodeSize.width + 100;
      expectedPoints = [
        { x: 400, y: 250 },
        { x: 250, y: 250 },
        { x: 250, y: 50 },
        { x: 100, y: 50 }
      ];
      const points = getPoints(d, o, isVertical);
      expect(points).to.deep.equal(expectedPoints);
    });

    it('should return points for vertical tree w only leafs', () => {
      parent.children = [{}];
      expectedPoints = [
        { x: 400, y: 250 },
        { x: 0, y: 250 },
        { x: 0, y: 150 },
        { x: 100, y: 150 },
        { x: 100, y: 50 }
      ];
      const points = getPoints(d, o, isVertical);
      expect(points).to.deep.equal(expectedPoints);
    });

    it('should return points for horizontal tree w only leafs', () => {
      isVertical = false;
      o.depthSpacing = nodeSize.width + 100;
      parent.children = [{}];
      expectedPoints = [
        { x: 400, y: 250 },
        { x: 400, y: 0 },
        { x: 250, y: 0 },
        { x: 250, y: 50 },
        { x: 100, y: 50 }
      ];
      const points = getPoints(d, o, isVertical);
      expect(points).to.deep.equal(expectedPoints);
    });

    it('should return points for a straight vertical line', () => {
      d.xActual = 0;
      expectedPoints = [
        { x: 100, y: 250 },
        { x: 100, y: 50 }
      ];
      const points = getPoints(d, o, isVertical);
      expect(points).to.deep.equal(expectedPoints);
    });

    it('should return points for a straight horizontal line', () => {
      d.yActual = 0;
      expectedPoints = [
        { x: 400, y: 50 },
        { x: 100, y: 50 }
      ];
      const points = getPoints(d, o, isVertical);
      expect(points).to.deep.equal(expectedPoints);
    });
  });
});
