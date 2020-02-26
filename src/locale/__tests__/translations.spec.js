import autoRegister from '../translations';
import en from '../en-US';

describe('translations', () => {
  describe('autoRegister', () => {
    let translator;
    beforeEach(() => {
      translator = {
        get: t => t === 'Object.OrgChart.MaxData' && 'Object.OrgChart.MaxData',
        add: sinon.spy(),
      };
    });

    it('Should not add anything when translator is not passed', () => {
      autoRegister();
      expect(translator.add).to.not.have.been.called;
    });

    it('Should not add anything when get is undefined', () => {
      translator.get = undefined;
      autoRegister(translator);
      expect(translator.add).to.not.have.been.called;
    });

    it('Should early return when translation is different from id', () => {
      autoRegister(translator);
      expect(translator.add).to.have.callCount(Object.keys(en).length);
    });
  });
});
