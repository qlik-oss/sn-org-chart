import defaultValues from "../../__tests__/default-orgchart-props";
import position, { depthTranslation, widthTranslation } from "../position";

describe("position", () => {
  describe("position", () => {
    const orientation = "ttb";
    const element = "";
    const initialZoomState = { initialX: 0, initialY: 0 };
    const navigationMode = "free";
    const styling = {
      image: {
        alignment: "left",
        location: "both",
      },
    };

    it("should return position object", () => {
      const { depthSpacing, isVertical, x, y } = position(
        orientation,
        element,
        initialZoomState,
        navigationMode,
        styling,
      );
      expect(depthSpacing).toEqual(120);
      expect(isVertical).toEqual(true);
      expect(x).toBeInstanceOf(Function);
      expect(y).toBeInstanceOf(Function);
    });
    it("should not return position when incorrect orientation", () => {
      expect(position("someOrientation", element, initialZoomState, navigationMode, styling)).toBeUndefined();
    });
  });

  describe("depthTranslation", () => {
    const depthSpacing = 124;
    let axis;
    let d;
    let initialZoomState;
    let navigationMode;
    let styling;
    beforeEach(() => {
      axis = "xActual";
      d = JSON.parse(JSON.stringify(defaultValues.nodes));
      initialZoomState = { initialX: 0, initialY: 0 };
      navigationMode = "free";
      styling = {
        image: {
          alignment: "left",
          location: "card",
        },
      };
    });
    it("should return yActual for node with initial offset", () => {
      initialZoomState.initialY = 100;
      const yActual = depthTranslation(d, depthSpacing, axis, initialZoomState, navigationMode, styling);
      expect(yActual).toEqual(224);
    });
    it("should return yActual for node", () => {
      const yActual = depthTranslation(d, depthSpacing, axis, initialZoomState, navigationMode, styling);
      expect(yActual).toEqual(124);
    });
    it("should return yActual for leaf node", () => {
      d.parent.children = undefined;
      const yActual = depthTranslation(d, depthSpacing, axis, initialZoomState, navigationMode, styling);
      expect(yActual).toEqual(205);
    });
    it("should return yActual for leaf node in expandAll navigation mode", () => {
      navigationMode = "expandAll";
      const yActual = depthTranslation(d, depthSpacing, axis, initialZoomState, navigationMode, styling);
      expect(yActual).toEqual(124);
    });
  });

  describe("widthTranslation", () => {
    const widthSpacing = 124;
    const element = {
      clientWidth: 1000,
    };
    let axis;
    let d;
    let initialZoomState;
    let navigationMode;
    beforeEach(() => {
      axis = "xActual";
      d = JSON.parse(JSON.stringify(defaultValues.nodes));
      initialZoomState = { initialX: 100, initialY: 0 };
      navigationMode = "free";
    });
    it("should return xActual for node", () => {
      const xActual = widthTranslation(d, widthSpacing, element, axis, initialZoomState, navigationMode);
      expect(xActual).toEqual(125);
    });
    it("should return xActual for leaf node", () => {
      d.parent.children = [{}];
      const xActual = widthTranslation(d, widthSpacing, element, axis, initialZoomState, navigationMode);
      expect(xActual).toEqual(17);
    });
    it("should return xActual for node, calculating xActual for parent recursively", () => {
      d.parent.xActual = undefined;
      const xActual = widthTranslation(d, widthSpacing, element, axis, initialZoomState, navigationMode);
      expect(xActual).toEqual(224);
    });
    it("should return xActual for node with root parent and initialsZoom", () => {
      d.parent.data.id = "Root";
      const xActual = widthTranslation(d, widthSpacing, element, axis, initialZoomState, navigationMode);
      expect(xActual).toEqual(125);
    });
    it("should return xActual for node with root parent and no initialsZoom", () => {
      d.parent.data.id = "Root";
      const xActual = widthTranslation(d, widthSpacing, element, axis, {}, navigationMode);
      expect(xActual).toEqual(125);
    });
    it("should return xActual for node without parent", () => {
      d = {};
      const xActual = widthTranslation(d, widthSpacing, element, axis, initialZoomState, navigationMode);
      expect(xActual).toEqual(100);
    });
    it("should return xActual for node without parent and no initialX", () => {
      d = {};
      initialZoomState.initialX = undefined;
      const xActual = widthTranslation(d, widthSpacing, element, axis, initialZoomState, navigationMode);
      expect(xActual).toEqual(0);
    });
    it("should return xActual for node without parent and no initialX in expandAll mode", () => {
      navigationMode = "expandAll";
      const xActual = widthTranslation(d, widthSpacing, element, axis, initialZoomState, navigationMode);
      expect(xActual).toEqual(100);
    });
  });
});
