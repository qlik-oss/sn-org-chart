import defaultValues from "../../__tests__/default-orgchart-props";
import transform, {
  anyCycle,
  createNodes,
  fetchPage,
  getAllTreeElemNo,
  getAttributeIndecies,
  getAttributes,
  getDataMatrix,
  haveNoChildren,
} from "../tree-utils";

function generateMatrix(numRows, childCount = 1) {
  const matrix = [];
  for (let i = 0; i < numRows; i++) {
    matrix.push([{ qText: `${i}`, qElemNumber: i }, { qText: i === 0 ? "" : `${Math.floor(i / childCount)}` }]);
  }
  return matrix;
}

const translator = { get: (d) => d };

describe("tree-utils", () => {
  describe("anyCycle", () => {
    let nodes;
    beforeEach(() => {
      const node3 = { id: "3", children: [] };
      const node2 = { id: "2", children: [node3] };
      const node1 = { id: "1", children: [node2] };
      nodes = [node1, node2, node3];
    });
    it("should not detect a cycle in the nodes", () => {
      const result = anyCycle(nodes);
      expect(result).toBeFalsy();
    });
    it("should detect a cycle in the nodes", () => {
      nodes[2].children = [{ id: "1", children: [] }];
      const result = anyCycle(nodes);
      expect(result).toBeTruthy();
    });
  });

  describe("fetchPage", () => {
    const model = { getHyperCubeData: async () => [{ qMatrix: [{}], qArea: { qHeight: 1 } }] };
    it("should return empty string when fetch correctly", async () => {
      const result = await fetchPage([], [], model, 1, 1, 1, 10);
      expect(result).toEqual("");
    });
    it("should return max data when limit reached", async () => {
      const result = await fetchPage([], [], model, 10, 1, 1, 3);
      expect(result).toEqual("max-data-limit");
    });
  });

  describe("getDataMatrix", () => {
    let layout;
    const model = { getHyperCubeData: async () => [{ qMatrix: [{}], qArea: { qHeight: 1 } }] };
    beforeEach(() => {
      layout = { qHyperCube: { qDataPages: [{ qArea: { qHeight: 1 }, qMatrix: [{}] }], qSize: { qcy: 1 } } };
    });
    it("should return snapshotData", async () => {
      const dataMatrix = { dataMatrix: "SomeFakeSnapshotData" };
      layout.snapshotData = dataMatrix;
      const result = await getDataMatrix(layout, model);
      expect(result.status).toEqual("");
      expect(result.dataMatrix).toEqual("SomeFakeSnapshotData");
    });

    it("should return data matrix", async () => {
      const result = await getDataMatrix(layout, model);
      expect(result.status).toEqual("");
      expect(result.dataMatrix.length).toEqual(1);
    });

    it("should fetch more data", async () => {
      layout.qHyperCube.qSize.qcy = 2;
      const result = await getDataMatrix(layout, model);
      expect(result.status).toEqual("");
      expect(result.dataMatrix.length).toEqual(2);
    });

    it("should return empty dataMatrix", async () => {
      layout.qHyperCube.qDataPages[0].qArea.qHeight = 0;
      layout.qHyperCube.qDataPages[0].qMatrix = [];
      layout.qHyperCube.qSize.qcy = 0;
      const result = await getDataMatrix(layout, model);
      expect(result.status).toEqual("");
      expect(result.dataMatrix.length).toEqual(0);
    });

    it("should handle multiple datapages", async () => {
      layout.qHyperCube.qDataPages.push({ qArea: { qHeight: 1 }, qMatrix: [{}] });
      const result = await getDataMatrix(layout, model);
      expect(result.status).toEqual("");
      expect(result.dataMatrix.length).toEqual(2);
    });
  });

  describe("createNodes", () => {
    it("should create a tree", () => {
      const matrix = [[{ qText: "007", qElemNumber: 0 }, { qText: "-" }]];
      const node = createNodes(matrix, [], null, null, translator);
      expect(node.id).toEqual("007");
    });
    it("should add a warning for max data", () => {
      const matrix = [[{ qText: "007", qElemNumber: 0 }, { qText: "-" }]];
      const node = createNodes(matrix, [], "max-data-limit", null, translator);
      expect(node.warn).toEqual(["Object.OrgChart.MaxData"]);
    });
    it("should add a warning for max children", () => {
      const matrix = generateMatrix(103, 103);
      const node = createNodes(matrix, [], null, null, translator);
      expect(node.warn).toEqual(["Object.OrgChart.MaxChildren"]);
    });
    it("should add max node warning on root nodes", () => {
      const matrix = generateMatrix(150, 0);
      const node = createNodes(matrix, [], null, null, translator);
      expect(node.warn).toEqual(["Object.OrgChart.MaxChildren", "Object.OrgChart.DummyWarn"]);
    });
    it("should detect all cycles", () => {
      const matrix = generateMatrix(10, 2);
      matrix[0][1].qText = "1";
      const node = createNodes(matrix, [], null, null, translator);
      expect(node.error).toEqual("no_root");
    });
    it("should detect isolate cycles", () => {
      const matrix = generateMatrix(10, 2);
      matrix[1][1].qText = "5";
      const node = createNodes(matrix, [], null, null, translator);
      expect(node.warn.length).toEqual(1);
    });
    it("should generate a dummy root", () => {
      const matrix = generateMatrix(10, 2);
      matrix[1][1].qText = "-";
      const node = createNodes(matrix, [], null, null, translator);
      expect(node.warn.length).toEqual(1);
      expect(node.id).toEqual("Root");
    });
  });

  describe("getAttributesIndecies", () => {
    let attrsInfo;
    let indecies;
    beforeEach(() => {
      attrsInfo = [];
    });
    it("should return empty array when attrsInfo is empty", () => {
      indecies = getAttributeIndecies(attrsInfo);
      expect(indecies).toEqual([]);
    });
    it("should return empty array when attrsInfo is empty", () => {
      attrsInfo = [{ id: "colorByExpression" }, {}, { id: "labelExpression" }];
      const expected = [
        { prop: "color", index: 0 },
        { prop: "label", index: 2 },
      ];
      indecies = getAttributeIndecies(attrsInfo);
      expect(indecies).toEqual(expected);
    });
  });

  describe("getAttributes", () => {
    let qAttrExpr;
    let indecies;
    let attributes;
    let expected;
    beforeEach(() => {
      indecies = [];
      qAttrExpr = {
        qValues: [
          {
            qText: "someExpression",
          },
        ],
      };
    });
    it("should return array with atrtibute", () => {
      indecies.push({ prop: "label", index: 0 });
      expected = { label: "someExpression" };
      attributes = getAttributes(indecies, qAttrExpr);
      expect(attributes).toEqual(expected);
    });
    it("should return array with resolved color", () => {
      indecies.push({ prop: "color", index: 0 });
      expected = { color: "none" };
      attributes = getAttributes(indecies, qAttrExpr);
      expect(attributes).toEqual(expected);
    });
  });

  describe("haveNoChildren", () => {
    const nodes = [{}, {}];
    it("should return true for undifined input", () => {
      expect(haveNoChildren(undefined)).toBeTruthy();
    });
    it("should return true for array with only leafs", () => {
      expect(haveNoChildren(nodes)).toBeTruthy();
    });

    it("should return false for array that contains at least one node with children", () => {
      nodes[0].children = [{}];
      expect(haveNoChildren(nodes)).toBeFalsy();
    });
  });

  describe("getAllTreeElemNo", () => {
    it("should return all ids in tree and activate", () => {
      const result = getAllTreeElemNo(defaultValues.nodes, true);
      expect(result).toEqual([2, 3, 798, 88]);
      expect(defaultValues.nodes.children[0].data.selected).toEqual(true);
    });

    it("should return all ids in tree and de-activate", () => {
      const result = getAllTreeElemNo(defaultValues.nodes, false);
      expect(result).toEqual([2, 3, 798, 88]);
      expect(defaultValues.nodes.children[0].data.selected).toEqual(false);
    });
  });

  describe("transform", () => {
    let layout;
    let model;
    it("should throw error when no qHyperCube", async () => {
      layout = {};
      try {
        await transform({ layout, model, translator });
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });
    it("should return false when only one dimension in the hypercube", async () => {
      layout = { qHyperCube: { qDimensionInfo: [{}] } };
      const result = await transform({ layout, model, translator });
      expect(result).toBeFalsy();
    });
    it("should return null for empty dataMatrix", async () => {
      layout = {
        qHyperCube: {
          qDimensionInfo: [{}, {}],
          qDataPages: [{ qArea: { qHeight: 1 }, qMatrix: [] }],
          qSize: { qcy: 1 },
        },
      };
      const result = await transform({ layout, model, translator });
      expect(result).toBeNull();
    });
    it("should return tree object", async () => {
      layout = {
        qHyperCube: {
          qDimensionInfo: [{}, {}],
          qDataPages: [{ qArea: { qHeight: 1 }, qMatrix: [[{ qText: "node" }, { qText: "parent" }]] }],
          qSize: { qcy: 1 },
        },
      };
      const result = await transform({ layout, model, translator });
      expect(result).toBeInstanceOf(Object);
    });
  });
});
