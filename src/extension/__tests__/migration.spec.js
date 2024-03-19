import migrateStyle from "../migration";

describe("migration", () => {
  describe("migrateStyle", () => {
    let properties;
    beforeEach(() => {
      properties = {
        style: {
          fontColor: {
            colorType: "fontColorType",
            color: "fontColor",
            colorExpression: "fontColorExpression",
          },
          backgroundColor: {
            colorType: "backgroundColorType",
            color: "backgroundColor",
            colorExpression: "backgroundColorExpression",
          },
          border: {
            top: "top",
            fullBorder: "fullBorder",
            colorType: "bordercolorType",
            color: "borderColor",
            colorExpression: "borderColorExpression",
          },
        },
      };
    });

    it("should not migrate the properties when components has elements already", () => {
      properties.components = [{ key: "label" }, { key: "backgroundColor" }, { key: "border" }];
      const result = migrateStyle(properties);
      expect(result.components).toEqual([{ key: "label" }, { key: "backgroundColor" }, { key: "border" }]);
    });

    it("should migrate the properties when components is empty", () => {
      properties.components = [];
      const result = migrateStyle(properties);
      const labelComponent = {
        key: "label",
        label: {
          value: {
            colorType: "fontColorType",
            color: "fontColor",
            colorExpression: "fontColorExpression",
          },
        },
      };
      expect(result.components).toContainEqual(labelComponent);
    });
  });
});
