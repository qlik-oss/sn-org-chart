import colorUtils from '../color-utils';

describe('color-utils', () => {
  describe('resolveExpression', () => {
    it('should resolve color for rgb expression', () => {
      const color = colorUtils.resolveExpression('RGB(255,255,0)');
      expect(color).to.equal('rgb(255,255,0)');
    });
    it('should resolve color for rgba expression', () => {
      const color = colorUtils.resolveExpression('rgba(255,255,0,0.39)');
      expect(color).to.equal('rgba(255,255,0,0.39)');
    });
    it('should resolve color for argb expression', () => {
      const color = colorUtils.resolveExpression('ARGB(100,255,255,0)');
      expect(color).to.equal('rgba(255,255,0,0.39)');
    });
    it('should resolve color for hex expression', () => {
      const color = colorUtils.resolveExpression('#123456');
      expect(color).to.equal('#123456');
    });
    it('should resolve color for css color', () => {
      const color = colorUtils.resolveExpression('red');
      expect(color).to.equal('rgba(255,0,0,1)');
    });
    it('should resolve color for css color transparent', () => {
      const color = colorUtils.resolveExpression('transparent');
      expect(color).to.equal('rgba(255,255,255,0)');
    });
    it('should return none for invalid expressions', () => {
      const color = colorUtils.resolveExpression('RGB(asdf)');
      expect(color).to.equal('none');
    });
  });

  describe('getDarkColor', () => {
    it('should not darken #000000', () => {
      const result = colorUtils.getDarkColor('#000000');
      expect(result).to.equal('#000000');
    });
    it('should darken #ffffff to #d9d9d9', () => {
      const result = colorUtils.getDarkColor('#ffffff');
      expect(result).to.equal('#808080');
    });
    it('should darken rgb(255,255,255) to rgb(217,217,217)', () => {
      const result = colorUtils.getDarkColor('rgb(255,255,255)');
      expect(result).to.equal('rgb(128,128,128)');
    });
    it('should darken rgba(255,255,255,1) to rgba(217,217,217,1)', () => {
      const result = colorUtils.getDarkColor('rgba(255,255,255,1)');
      expect(result).to.equal('rgba(128,128,128,1)');
    });
  });

  describe('isDarkColor', () => {
    it('should be dark color #484848', () => {
      expect(colorUtils.isDarkColor('#484848')).to.be.true;
    });

    it('should not be dark color #484848', () => {
      expect(colorUtils.isDarkColor('#e6e6e6')).to.be.false;
    });

    it('should be dark color rgb(250,0,0)', () => {
      expect(colorUtils.isDarkColor('rgb(250,0,0)')).to.be.true;
    });

    it('should not be dark color rgba(255,192,203,1)', () => {
      expect(colorUtils.isDarkColor('rgba(255,192,203,1)')).to.be.false;
    });

    it('should be dark color rgba(255,192,203,1)', () => {
      expect(colorUtils.isDarkColor('rgba(255,192,203,1)')).to.be.false;
    });
  });
});
