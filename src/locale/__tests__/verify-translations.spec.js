import verifyTranslations from '../tools/verify-translations';

describe('verify-translations', () => {
  let all;
  let languages;
  beforeEach(() => {
    all = {
      "Object_OrgChart_BackgroundColor": {
        "id": "Object.OrgChart.BackgroundColor",
        "locale": {
          "en-US": "Background color",
          "it-IT": "Colore sfondo",
          "zh-CN": "背景颜色",
        }
      },
    };
    languages = [
      'en-US',
      'it-IT',
      'zh-CN',
    ];
  });

  it('should not throw error if all languages present', () => {
    jest.spyOn(console, 'warn').mockImplementation();

    verifyTranslations(all, languages);
    expect(console.warn).not.toHaveBeenCalled();
  });

  it('should throw error if en-us is not present', () => {
    all = {
      "Object_OrgChart_BackgroundColor": {
        "id": "Object.OrgChart.BackgroundColor",
        "locale": {
          "it-IT": "Colore sfondo",
          "zh-CN": "背景颜色",
        }
      },
    };
    
    expect(() => {verifyTranslations(all, languages)}).toThrow(new Error(`String 'Object.OrgChart.BackgroundColor' is missing value for 'en-US'`));
  });

  it('should not throw error if other langauge not present', () => {
    all = {
      "Object_OrgChart_BackgroundColor": {
        "id": "Object.OrgChart.BackgroundColor",
        "locale": {
          "en-US": "Background color",
          "it-IT": "Colore sfondo",
        }
      },
    };
    jest.spyOn(console, 'warn').mockImplementation();

    verifyTranslations(all, languages);
    expect(console.warn).toHaveBeenCalledWith(
      expect.stringContaining(`String 'Object.OrgChart.BackgroundColor' is missing value for 'zh-CN'`),
    );
  });

});