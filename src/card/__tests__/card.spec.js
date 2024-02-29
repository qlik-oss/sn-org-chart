import encodeUtils from "../../utils/encoder";
import card, { getBackgroundColor, getFontColor } from "../card";

describe("card", () => {
  describe("getBackgroundColor", () => {
    let data;
    let cardStyling;
    beforeEach(() => {
      data = {
        attributes: {},
      };
      cardStyling = {
        backgroundColor: "#e6e6e6",
      };
    });
    it("should return backgroundColor", () => {
      const result = getBackgroundColor(data, cardStyling);
      expect(result).toEqual("#e6e6e6");
    });

    it("should return color from attribute expression", () => {
      data.attributes.color = "green";
      const result = getBackgroundColor(data, cardStyling);
      expect(result).toEqual("rgba(0,128,0,1)");
    });

    it("should return backgroundColor when expression fails", () => {
      data.attributes.color = "myFakeColor";
      const result = getBackgroundColor(data, cardStyling);
      expect(result).toEqual("#e6e6e6");
    });
  });

  describe("getFontColor", () => {
    let cardStyling;
    let backgroundColor;
    beforeEach(() => {
      cardStyling = {
        cardTitle: {
          fontSize: "16",
          fontFamily: "Times New Roman",
        },
        cardBody: {
          fontSize: "14",
          fontFamily: "Times New Roman",
        },
        fontColor: "default",
      };
      backgroundColor = "#484848";
    });

    it("should return light color for default font", () => {
      const result = getFontColor(cardStyling, backgroundColor);
      expect(result).toEqual("#e6e6e6");
    });

    it("should return dark color for default font", () => {
      backgroundColor = "#e6e6e6";
      const result = getFontColor(cardStyling, backgroundColor);
      expect(result).toEqual("#484848");
    });

    it("should return fontColor when no default is selected", () => {
      cardStyling.fontColor = "myAwesomeColor";
      const result = getFontColor(cardStyling, backgroundColor);
      expect(result).toEqual("myAwesomeColor");
    });
  });

  describe("card", () => {
    let data;
    let cardStyling;
    let selections;
    let flags;
    beforeEach(() => {
      flags = {
        isEnabled: () => true,
      };
      data = {
        id: "someId",
        attributes: {image: "myImage"},
        elemNo: 5,
      };
      cardStyling = {
        cardTitle: {
          fontSize: "16",
          fontFamily: "Times New Roman",
        },
        cardBody: {
          fontSize: "14",
          fontFamily: "Times New Roman",
        },
        backgroundColor: "#e6e6e6",
        fontColor: "default",
        border: { top: true, colorType: "auto" },
        image: {
          alignment: 'left',
          location: 'tooltip',
          shape: 'rectangle',
          clip: true,
        },
      };
      selections = { api: { isActive: () => false } };
      encodeUtils.encodeTitle = jest.fn().mockImplementation((input) => input);
      encodeUtils.encodeCssColor = jest.fn().mockImplementation((input) => input);
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    it("should return html for node with only id", () => {
      data.attributes = null;
      const result = card(data, cardStyling, selections, flags);
      /*
      expect(result).toEqual(
        '<div class="sn-org-card-text" style="background-color:#e6e6e6;color:#484848; border:1px solid #737373; border-top:3px solid #737373; height:60px;"><div class="sn-org-card-title">someId</div></div>',
      );
      */
      expect(result).toMatch('<div class="sn-org-card-text" style="background-color:#e6e6e6;color:#484848; border:1px solid #737373; border-top:3px solid #737373; height:60px;display: flex;">');
      expect(result).toMatch('<div class="sn-org-textbox" style="max-height: 60px; height: fit-content; position: relative; top: 50%; transform: translate(0, -50%); padding-left: 3px; ">');
      expect(result).toMatch('<div class="sn-org-card-title" style="font-family:Times New Roman;font-size:16;">someId</div></div></div>');

    });
    

    it("should return html for node with attribute label", () => {
      data.attributes.label = "this is the label";
      const result = card(data, cardStyling, selections, flags);
      //expect(result).toMatch('<div class="sn-org-card-title">this is the label</div>');
      expect(result).toMatch('<div class="sn-org-card-title" style="font-family:Times New Roman;font-size:16;">this is the label</div>');

    });

    it("should return html for node with id and subLabel", () => {
      data.attributes.subLabel = "subsub";
      const result = card(data, cardStyling, selections, flags);
      //expect(result).toMatch('<div class="sn-org-card-title">someId</div>');
      //expect(result).toMatch('<div class="sn-org-card-label">subsub</div>');
      expect(result).toMatch('<div class="sn-org-card-title" style="font-family:Times New Roman;font-size:16;">someId</div>');
      expect(result).toMatch('<div class="sn-org-card-label" style="font-family:Times New Roman;font-size:14;">subsub</div>');
    });  

    it("should return html for node with three labels", () => {
      data.attributes.label = "this is the label";
      data.attributes.subLabel = "subsub";
      data.attributes.extraLabel = "extra";
      const result = card(data, cardStyling, selections, flags);
      /*
      expect(result).toMatch('<div class="sn-org-card-title">this is the label</div>');
      expect(result).toMatch('<div class="sn-org-card-label">subsub</div>');
      expect(result).toMatch('<div class="sn-org-card-label">extra</div>');
      */
      expect(result).toMatch('<div class="sn-org-card-title" style="font-family:Times New Roman;font-size:16;">this is the label</div>');
      expect(result).toMatch('<div class="sn-org-card-label" style="font-family:Times New Roman;font-size:14;">subsub</div>');
      expect(result).toMatch('<div class="sn-org-card-label" style="font-family:Times New Roman;font-size:14;">extra</div>');

    });

    it("should return html for node with three labels and measure", () => {
      data.attributes.label = "this is the label";
      data.attributes.subLabel = "subsub";
      data.attributes.extraLabel = "extra";
      data.measure = "measure";
      const result = card(data, cardStyling, selections, flags);
      /*
      expect(result).toMatch('<div class="sn-org-card-label">subsub</div>');
      expect(result).not.toMatch('<div class="sn-org-card-label">extra</div>');
      expect(result).toMatch('<div class="sn-org-card-label">measure</div>');
      */
      expect(result).toMatch('<div class="sn-org-card-label" style="font-family:Times New Roman;font-size:14;">subsub</div>');
      expect(result).not.toMatch('<div class="sn-org-card-label" style="font-family:Times New Roman;font-size:14;">extra</div>');
      expect(result).toMatch('<div class="sn-org-card-label" style="font-family:Times New Roman;font-size:14;">measure</div>');

    });

    it("should return html for node with three labels and measure with label", () => {
      data.attributes.label = "this is the label";
      data.attributes.subLabel = "subsub";
      data.attributes.extraLabel = "extra";
      data.measure = "measure";
      cardStyling.measureLabel = "measureLabel";
      const result = card(data, cardStyling, selections, flags);
      /*
      expect(result).toMatch('<div class="sn-org-card-label">subsub</div>');
      expect(result).not.toMatch('<div class="sn-org-card-label">extra</div>');
      expect(result).toMatch('<div class="sn-org-card-label">measureLabel: measure</div>');
      */
      expect(result).toMatch('<div class="sn-org-card-label" style="font-family:Times New Roman;font-size:14;">subsub</div>');
      expect(result).not.toMatch('<div class="sn-org-card-label" style="font-family:Times New Roman;font-size:14;">extra</div>');
      expect(result).toMatch('<div class="sn-org-card-label" style="font-family:Times New Roman;font-size:14;">measureLabel: measure</div>');

    });

    it("should return html for node with id and measure", () => {
      data.measure = "measure";
      const result = card(data, cardStyling, selections, flags);
      //expect(result).toMatch('<div class="sn-org-card-title">someId</div>');
      //expect(result).toMatch('<div class="sn-org-card-label">measure</div>');
      expect(result).toMatch('<div class="sn-org-card-title" style="font-family:Times New Roman;font-size:16;">someId</div>');
      expect(result).toMatch('<div class="sn-org-card-label" style="font-family:Times New Roman;font-size:14;">measure</div>');
    });

    it("should return html for selected node in active state", () => {
      data.measure = "measure";
      data.selected = true;
      selections = { api: { isActive: () => true }, state: [data.elemNo] };
      const result = card(data, cardStyling, selections, flags);
      expect(result).toMatch('<div class="sn-org-card-text selected"');
      expect(result).toMatch("border:; border-top:;");
      expect(result).toMatch("height:56px;");
    });

    it("should return html for not selected node in active state", () => {
      data.measure = "measure";
      data.selected = false;
      selections = { api: { isActive: () => true }, state: [7] };
      const result = card(data, cardStyling, selections, flags);
      expect(result).toMatch('<div class="sn-org-card-text not-selected"');
      expect(result).toMatch("border:1px solid #737373; border-top:3px solid #737373;");
      expect(result).toMatch("height:60px;");
    });

    it("should return html for card with only top border", () => {
      cardStyling.border.fullBorder = false;
      const result = card(data, cardStyling, selections, flags);
      expect(result).toMatch("border:; border-top:3px solid #737373;");
      expect(result).toMatch("height:61px;");
    });

    it("should return html for card with no borders", () => {
      cardStyling.border.top = false;
      cardStyling.border.fullBorder = false;
      const result = card(data, cardStyling, selections, flags);
      expect(result).toMatch("border:; border-top:;");
      expect(result).toMatch("height:64px;");
    });

    it("should default to both borders", () => {
      cardStyling.border = {};
      const result = card(data, cardStyling, selections, flags);
      expect(result).toMatch("border:1px solid #737373; border-top:3px solid #737373;");
      expect(result).toMatch("height:60px;");
    });

    it("should use borderColor when colorType is not auto", () => {
      cardStyling.border.colorType = "colorPicker";
      cardStyling.borderColor = "myColor";
      const result = card(data, cardStyling, selections, flags);
      expect(result).toMatch("border:1px solid myColor; border-top:3px solid myColor;");
    });

    it("should return image on the left", () => {
      cardStyling.image.location = "card";
      const result = card(data, cardStyling, selections, flags);
      expect(result).toMatch('height:60px;display: flex; flex-direction: row;');
      expect(result).toMatch('<div style="order:0;"><img src="myImage" class="sn-org-card-image" style="height: 50px; width: 50px;  object-fit: cover; "/></div>');
    });

    it("should return image on the top", () => {
      cardStyling.image.location = "card";
      cardStyling.image.alignment = "top";
      const result = card(data, cardStyling, selections, flags);
      expect(result).toMatch('height:204px;display: flex; flex-direction: column;');
      expect(result).toMatch('<div style="order:0; margin: 0 auto;"><img src="myImage" class="sn-org-card-image" style="height: 130px; width: 130px;  object-fit: cover; "/></div>');
    });

  });
});
