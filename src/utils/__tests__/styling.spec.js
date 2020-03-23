import stylingUtils, { getColor } from '../styling';

const palette = ['firstColor', 'secondColor'];
const defaultColor = '#e6e6e6';
const Theme = {
  getColorPickerColor: color => palette[color.index] || 'none',
};

describe('styling', () => {
  describe('getColor', () => {
    let reference;
    beforeEach(() => {
      reference = { colorType: 'auto', colorExpression: 'pink', color: { index: 1 } };
    });
    it('should return default color', () => {
      const result = getColor(reference, Theme, defaultColor);
      expect(result).to.equal(defaultColor);
    });

    it('should return color from expression', () => {
      reference.colorType = 'byExpression';
      const result = getColor(reference, Theme, defaultColor);
      expect(result).to.equal('rgba(255,192,203,1)');
    });

    it('should return color from colorPicker', () => {
      reference.colorType = 'colorPicker';
      const result = getColor(reference, Theme, defaultColor);
      expect(result).to.equal('secondColor');
    });

    it('should return default color from colorPicker', () => {
      reference.colorType = 'colorPicker';
      reference.color.index = 10;
      const result = getColor(reference, Theme, defaultColor);
      expect(result).to.equal('#e6e6e6');
    });
  });

  describe('cardStyling', () => {
    let layout;
    beforeEach(() => {
      layout = {
        style: {
          backgroundColor: { colorType: 'auto' },
          fontColor: { colorType: 'auto' },
        },
        qHyperCube: {
          qMeasureInfo: [
            {
              qFallbackTitle: 'measureLabel',
            },
          ],
        },
      };
    });
    it('should return cardStyling', () => {
      const result = stylingUtils.cardStyling({ layout });
      expect(result).to.deep.equal({
        backgroundColor: '#e6e6e6',
        fontColor: 'default',
        measureLabel: 'measureLabel',
        border: { colorType: 'auto' },
        borderColor: '#737373',
      });
    });
    it('should return cardStyling with no measureLabel', () => {
      layout.qHyperCube.qMeasureInfo = [];
      const result = stylingUtils.cardStyling({ layout });
      expect(result).to.deep.equal({
        backgroundColor: '#e6e6e6',
        fontColor: 'default',
        measureLabel: null,
        border: { colorType: 'auto' },
        borderColor: '#737373',
      });
    });

    it('should return cardStyling with borderColor from color picker', () => {
      layout.style.border = { colorType: 'colorPicker', color: { index: 1 } };
      const result = stylingUtils.cardStyling({ layout, Theme });
      expect(result).to.deep.equal({
        backgroundColor: '#e6e6e6',
        fontColor: 'default',
        measureLabel: 'measureLabel',
        border: { colorType: 'colorPicker', color: { index: 1 } },
        borderColor: 'secondColor',
      });
    });
  });
});
