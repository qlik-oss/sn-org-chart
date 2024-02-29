import { getPath, getPoints } from "../path";
import constants from "../size-constants";

describe("path", () => {
  describe("getPath", () => {
    const points = [
      { x: 0, y: 0 },
      { x: 100, y: 0 },
      { x: 100, y: 200 },
      { x: 200, y: 200 },
    ];
    const expected = "M 0 0 L 96 0 Q 100 0 100 4 L 100 196 Q 100 200 104 200 L 200 200 ";

    it("should return a path", () => {
      const path = getPath(points);
      expect(path).toEqual(expected);
    });
  });

  describe("getPoints", () => {
    // TODO: update tests when all directions work
    const { heightMargin, cardHeight } = constants;
    let nodeSize;
    let parent;
    let d;
    let positioning;
    let expectedPoints;
    let topId;
    let navigationMode;
    let styling;

    beforeAll(() => {
      styling = {
        image: {
          aliagnment: "left",
          location: "card",
        },
      };
    });

    beforeEach(() => {
      topId = "0";
      parent = {
        data: {
          id: "0",
        },
        xActual: 0,
        yActual: 0,
        children: [
          {
            children: [{}],
          },
        ],
      };
      d = {
        parent,
        xActual: 300,
        yActual: cardHeight + heightMargin,
        data: {
          id: "1",
        },
      };
      positioning = {
        nodeSize,
        isVertical: true,
        depthSpacing: cardHeight + heightMargin,
        x: (node) => node.xActual,
        y: (node) => node.yActual,
      };
      navigationMode = "free";
    });

    it("should return points for vertical tree", () => {
      expectedPoints = [
        { x: 376, y: 120 },
        { x: 376, y: 112 },
        { x: 76, y: 112 },
        { x: 76, y: 96 },
      ];
      const points = getPoints(d, topId, positioning, navigationMode, styling)[0];
      expect(points).toEqual(expectedPoints);
    });

    it("should return points for vertical tree w only leafs", () => {
      parent.children = [{}];
      expectedPoints = [
        { x: 300, y: 152 },
        { x: 0, y: 152 },
        { x: 0, y: 112 },
        { x: 76, y: 112 },
        { x: 76, y: 96 },
      ];
      const points = getPoints(d, topId, positioning, navigationMode, styling)[0];
      expect(points).toEqual(expectedPoints);
    });

    it("should return points for vertical tree w only leafs in expandAll mode", () => {
      navigationMode = "expandAll";
      parent.children = [{}];
      expectedPoints = [
        { x: 376, y: 120 },
        { x: 376, y: 112 },
        { x: 76, y: 112 },
        { x: 76, y: 64 },
      ];
      const points = getPoints(d, topId, positioning, navigationMode, styling)[0];
      expect(points).toEqual(expectedPoints);
    });

    it("should return points for a straight vertical line", () => {
      d.xActual = 0;
      expectedPoints = [
        { x: 76, y: 120 },
        { x: 76, y: 96 },
      ];
      const points = getPoints(d, topId, positioning, navigationMode, styling)[0];
      expect(points).toEqual(expectedPoints);
    });

    it("should return points for line to expand button", () => {
      d.children = [{}];
      expectedPoints = [
        { x: 376, y: 184 },
        { x: 376, y: 192 },
      ];
      const points = getPoints(d, topId, positioning, navigationMode, styling)[1];
      expect(points).toEqual(expectedPoints);
    });

    it("should return points for line to dummy", () => {
      topId = "Root";
      d.parent.data.id = "Root";
      expectedPoints = [
        { x: 376, y: 120 },
        { x: 376, y: 112 },
      ];
      const points = getPoints(d, topId, positioning, navigationMode, styling)[0];
      expect(points).toEqual(expectedPoints);
    });

    it("should return no points if no parent", () => {
      d.parent = undefined;
      const points = getPoints(d, topId, positioning, navigationMode, styling);
      expect(points).toEqual([]);
    });
  });
});
