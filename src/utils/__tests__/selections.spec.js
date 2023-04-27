import defaultValues from "../../__tests__/default-orgchart-props";
import selections from "../selections";

describe("selections", () => {
  describe("select", () => {
    const { select } = selections;
    let node;
    let selectionObj;
    let isActive;
    beforeEach(() => {
      node = JSON.parse(JSON.stringify(defaultValues.nodes));
      isActive = false;
      selectionObj = {
        api: {
          isActive: () => isActive,
          clear: jest.fn(),
          select: jest.fn(),
          begin: jest.fn(),
        },
        singleSelect: true,
        setState: jest.fn(),
        state: [],
      };
    });
    it("should not run anyhing if api or is undefined", () => {
      node = undefined;
      select(node, selectionObj);
      expect(selectionObj.setState).not.toHaveBeenCalled();
    });
    it("should early return if elemNo is negative", () => {
      node.data.elemNo = -2;
      select(node, selectionObj);
      expect(selectionObj.setState).not.toHaveBeenCalled();
    });
    it("should early return if elemNo isLocked is true", () => {
      node.data.isLocked = true;
      select(node, selectionObj);
      expect(selectionObj.setState).not.toHaveBeenCalled();
    });
    it("should call begin and setState to node id", () => {
      select(node, selectionObj);
      expect(selectionObj.api.begin).toHaveBeenCalledTimes(1);
      expect(selectionObj.api.select).toHaveBeenCalledTimes(1);
      expect(selectionObj.setState).toHaveBeenCalledWith([1]);
    });
    it("should not call begin and push node id to selectionState", () => {
      isActive = true;
      selectionObj.state.push(2);
      select(node, selectionObj);
      expect(selectionObj.api.begin).not.toHaveBeenCalled();
      expect(selectionObj.api.select).toHaveBeenCalledTimes(1);
      expect(selectionObj.setState).toHaveBeenCalledWith([2, 1]);
    });
    it("should get all children when singleSelect is false", () => {
      selectionObj.singleSelect = false;
      select(node, selectionObj);
      expect(selectionObj.api.select).toHaveBeenCalledTimes(1);
      expect(selectionObj.setState).toHaveBeenCalledWith([1, 2, 3, 798, 88]);
    });
    it("should deselect node", () => {
      isActive = true;
      selectionObj.state = [1, 2];
      select(node, selectionObj);
      expect(selectionObj.setState).toHaveBeenCalledWith([2]);
    });
    it("should deselect node and children", () => {
      isActive = true;
      selectionObj.singleSelect = false;
      selectionObj.state = [1, 2];
      select(node, selectionObj);
      expect(selectionObj.api.clear).toHaveBeenCalledTimes(1);
      expect(selectionObj.setState).toHaveBeenCalledWith([]);
    });
  });
});
