import autoRegister from '../src/translations';
import en from '../locales/en-US.json';

describe('translations', () => {
  describe('autoRegister', () => {
    let translator;
    beforeEach(() => {
      translator = {
        get: (t) => t === 'Object.OrgChart.MaxData' && 'Object.OrgChart.MaxData',
        add: jest.fn(),
      };
    });

    it('Should not add anything when translator is not passed', () => {
      autoRegister();
      expect(translator.add).not.toHaveBeenCalled();
    });

    it('Should not add anything when get is undefined', () => {
      translator.get = undefined;
      autoRegister(translator);
      expect(translator.add).not.toHaveBeenCalled();
    });

    it('Should early return when translation is different from id', () => {
      translator.get = () => 'somexTranslation';
      autoRegister(translator);
      expect(translator.add).not.toHaveBeenCalled();
    });

    it('Should call add for every key', () => {
      autoRegister(translator);
      expect(translator.add).toHaveBeenCalledTimes(Object.keys(en).length);
    });
  });
});
