import stylingUtils, { getColor } from '../styling';

describe('styling', () => {
  describe('getColor', () => {
    let reference;
    const palette = ['firstColor', 'secondColor'];
    const defaultColor = '#e6e6e6';
    const Theme = {
      getColorPickerColor: color => palette[color.index] || 'none',
    };
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
    const layout = {
      style: {
        backgroundColor: { colorType: 'auto' },
        fontColor: { colorType: 'auto' },
        border: { show: 'top' },
      },
      qHyperCube: {
        qMeasureInfo: [
          {
            qFallbackTitle: 'measureLabel',
          },
        ],
      },
    };
    it('should return cardStyling', () => {
      const result = stylingUtils.cardStyling({ layout });
      expect(result).to.deep.equal({
        backgroundColor: '#e6e6e6',
        fontColor: 'default',
        measureLabel: 'measureLabel',
        border: { show: 'top' },
      });
    });
    it('should return cardStyling with no measureLabel', () => {
      layout.qHyperCube.qMeasureInfo = [];
      const result = stylingUtils.cardStyling({ layout });
      expect(result).to.deep.equal({
        backgroundColor: '#e6e6e6',
        fontColor: 'default',
        measureLabel: null,
        border: { show: 'top' },
      });
    });
  });
});
