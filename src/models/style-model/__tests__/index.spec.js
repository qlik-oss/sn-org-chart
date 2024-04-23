import createStyleModel from "..";

describe("createStyleModel", () => {
  const flags = { isEnabled: () => true };

  const layout = {
    key: "layout",
    components: [],
  };

  const themeService = {
    getStyles: () => ({
      axis: {
        label: {
          name: {
            fontSize: "14px",
            fontFamily: "Source Sans Pro, sans-serif",
          },
        },
      },
      label: {
        value: {
          fontSize: "11px",
          fontFamily: "Source Sans Pro, sans-serif",
        },
      },
    }),
  };

  it("card title should return theme style when no matching component", () => {
    const result = createStyleModel({ layout, themeService, flags });
    expect(result.axis.label.getStyle()).toEqual({
      fontSize: "14px",
      fontFamily: "Source Sans Pro, sans-serif",
    });
  });

  it("card title should return correct result when layout components has axis", () => {
    const component = {
      key: "axis",
      axis: { label: { name: { fontFamily: "Arial, sans-serif", fontSize: "20px" } } },
    };
    layout.components.push(component);
    const result = createStyleModel({ layout, themeService, flags });
    expect(result.axis.label.getStyle()).toEqual({
      fontSize: "20px",
      fontFamily: "Arial, sans-serif",
    });
  });

  it("background color should return default style when no matching component", () => {
    layout.style = {
      fontColor: {
        colorType: "auto",
        color: { index: -1, color: "#484848" },
        colorExpression: "",
      },
      backgroundColor: {
        colorType: "colorPicker",
        color: { index: -1, color: "#ffffff" },
        colorExpression: "",
      },
      border: {
        top: true,
        fullBorder: true,
        colorType: "auto",
        color: { index: -1, color: "#737373" },
        colorExpression: "",
      },
    };
    const result = createStyleModel({ layout, themeService, flags });
    expect(result.backgroundColor.getStyle()).toEqual({
      colorType: "colorPicker",
      color: { index: -1, color: "#ffffff" },
      colorExpression: "",
    });
  });

  it("background color should return correct result when layout components has backgroundColor", () => {
    const component = {
      key: "backgroundColor",
      backgroundColor: { colorType: "auto", color: { index: -1, color: "#10cfc9" }, colorExpression: "" },
    };
    layout.components.push(component);
    const result = createStyleModel({ layout, themeService, flags });
    expect(result.backgroundColor.getStyle()).toEqual({
      colorType: "auto",
      color: { index: -1, color: "#10cfc9" },
      colorExpression: "",
    });
  });
});
