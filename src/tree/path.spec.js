import { calculatePath, getPath } from './path';

describe('path', () => {
  const r = 30;

  describe('calculatePath', () => {
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

  describe('getPath', () => {
    let points;
    // spy on calculatePath
    const d = {
      parent: {
        xActual: 500,
        yActual: 500
      },
      xActual: 0,
      yActual: 0
    };
    const o = {
      nodeSize: {
        width: 200,
        height: 100,
      },
      depthSpacing: 200,
      x: d => d.zActual,
      y: d => d.yActual,
    };

    it('should create a path', () => {
      points = {
        // some points based ont hardcoded values
      };
      expect(calculatePath).to.have.been.calledWith(points, r);
    });
  });
});
