import { stardust } from '@nebula.js/stardust';

import autoRegister from '../src/translations';
import all from '../all.json';

describe('translations', () => {
  describe('autoRegister', () => {
    let translator: stardust.Translator;
    beforeEach(() => {
      translator = {
        get: () => 'Object.OrgChart.MaxData',
        add: jest.fn(),
      };
    });

    it('Should early return when translation is different from id', () => {
      translator.get = () => 'somexTranslation';
      autoRegister(translator);
      expect(translator.add).not.toHaveBeenCalled();
    });

    it('Should call add for every key', () => {
      autoRegister(translator);
      expect(translator.add).toHaveBeenCalledTimes(Object.keys(all).length);
    });
  });
});
