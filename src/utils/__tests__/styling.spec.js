import stylingUtils, { getColor } from '../styling';

describe('styling', () => {
  describe('getColor', () => {
    let reference;
    const palette = ['firstColor', 'secondColor'];
    const defaultColor = '#e6e6e6';
    beforeEach(() => {
      reference = { colorType: 'auto', colorExpression: 'pink', color: { index: 1 } };
    });
    it('should return default color', () => {
      const result = getColor(reference, palette, defaultColor);
      expect(result).to.equal(defaultColor);
    });

    it('should return color from expression', () => {
      reference.colorType = 'byExpression';
      const result = getColor(reference, palette, defaultColor);
      expect(result).to.equal('rgba(255,192,203,1)');
    });

    it('should return color from colorPicker', () => {
      reference.colorType = 'colorPicker';
      const result = getColor(reference, palette, defaultColor);
      expect(result).to.equal('secondColor');
    });

    it('should return default color from colorPicker', () => {
      reference.colorType = 'colorPicker';
      reference.color.index = 10;
      const result = getColor(reference, palette, defaultColor);
      expect(result).to.equal('#e6e6e6');
    });
  });

  describe('cardStyling', () => {
    const layout = {
      style: {
        backgroundColor: { colorType: 'auto' },
        fontColor: { colorType: 'auto' },
      },
    };
    it('should return cardStyling', () => {
      const result = stylingUtils.cardStyling({ layout });
      expect(result).to.deep.equal({ backgroundColor: '#e6e6e6', fontColor: 'default' });
    });
  });
});