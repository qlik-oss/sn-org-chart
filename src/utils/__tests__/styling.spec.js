import stylingUtils, { getColor } from "../styling";

const palette = ["firstColor", "secondColor"];
const defaultColor = "#e6e6e6";
const Theme = {
  getColorPickerColor: (color) => palette[color.index] || "none",
};

describe("styling", () => {
  describe("getColor", () => {
    let reference;
    beforeEach(() => {
      reference = {
        colorType: "auto",
        colorExpression: "pink",
        color: { index: 1 },
      };
    });
    it("should return default color", () => {
      const result = getColor(reference, Theme, defaultColor);
      expect(result).toEqual(defaultColor);
    });

    it("should return color from expression", () => {
      reference.colorType = "byExpression";
      const result = getColor(reference, Theme, defaultColor);
      expect(result).toEqual("rgba(255,192,203,1)");
    });

    it("should return color from colorPicker", () => {
      reference.colorType = "colorPicker";
      const result = getColor(reference, Theme, defaultColor);
      expect(result).toEqual("secondColor");
    });

    it("should return default color from colorPicker", () => {
      reference.colorType = "colorPicker";
      reference.color.index = 10;
      const result = getColor(reference, Theme, defaultColor);
      expect(result).toEqual("#e6e6e6");
    });
  });

  describe("cardStyling", () => {
    let layout;
    let styleModel;
    beforeEach(() => {
      layout = {
        style: {
          backgroundColor: { colorType: "auto" },
          fontColor: { colorType: "auto" },
        },
        qHyperCube: {
          qMeasureInfo: [
            {
              qFallbackTitle: "measureLabel",
            },
          ],
        },
      };
      styleModel = {
        axis: {
          label: {
            getStyle: () => ({
              fontFamily: "Times New Roman",
              fontSize: "16",
            }),
          },
        },
        label: {
          value: {
            getStyle: () => ({
              fontFamily: "Times New Roman",
              fontSize: "14",
              colorType: "colorPicker",
              color: "#404040",
            }),
          },
        },
        backgroundColor: {
          getStyle: () => ({
            colorType: "colorPicker",
            color: "#ccffff",
          }),
        },
        border: {
          getStyle: () => ({
            top: true,
            fullBorder: true,
            colorType: "auto",
          }),
        },
        image: {
          getStyle: () => ({
            location: "card",
            alignment: "left",
            shape: "rectangle",
            clip: true,
          }),
        },
      };
    });
    it("should return cardStyling", () => {
      const result = stylingUtils.cardStyling({ Theme, layout, styleModel });
      expect(result).toEqual({
        cardTitle: {
          fontSize: "16",
          fontFamily: "Times New Roman",
        },
        cardBody: {
          fontSize: "14",
          fontFamily: "Times New Roman",
        },
        backgroundColor: "#ffffff",
        fontColor: "default",
        measureLabel: "measureLabel",
        border: {
          top: true,
          fullBorder: true,
          colorType: "auto",
        },
        borderColor: "#808080",
      });
    });
    it("should return cardStyling with no measureLabel", () => {
      layout.qHyperCube.qMeasureInfo = [];
      const result = stylingUtils.cardStyling({ Theme, layout, styleModel });
      expect(result).toEqual({
        cardTitle: {
          fontSize: "16",
          fontFamily: "Times New Roman",
        },
        cardBody: {
          fontSize: "14",
          fontFamily: "Times New Roman",
        },
        backgroundColor: "#ffffff",
        fontColor: "default",
        measureLabel: null,
        border: {
          top: true,
          fullBorder: true,
          colorType: "auto",
        },
        borderColor: "#808080",
      });
    });

    it("should return cardStyling with borderColor from color picker", () => {
      const fn = () => ({
        top: true,
        fullBorder: true,
        colorType: "colorPicker",
        color: { index: 1 },
        colorExpression: "",
      });
      styleModel.border.getStyle = fn;
      const result = stylingUtils.cardStyling({ Theme, layout, styleModel });
      expect(result).toEqual({
        cardTitle: {
          fontSize: "16",
          fontFamily: "Times New Roman",
        },
        cardBody: {
          fontSize: "14",
          fontFamily: "Times New Roman",
        },
        backgroundColor: "#ffffff",
        fontColor: "default",
        measureLabel: "measureLabel",
        border: {
          colorType: "colorPicker",
          color: { index: 1 },
          colorExpression: "",
          top: true,
          fullBorder: true,
        },
        borderColor: "secondColor",
      });
    });
  });
});
