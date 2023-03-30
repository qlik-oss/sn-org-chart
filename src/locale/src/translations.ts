import { stardust } from '@nebula.js/stardust';

import all from '../all.json';

export default function autoRegister(translator: stardust.Translator) {
  if (translator && translator.get && translator.add) {
    const t = 'Object.OrgChart.MaxData';
    const g = translator.get(t);
    // if translated string is different from its id
    // assume translations already exists for current locale
    if (g !== t) {
      return;
    }

    Object.keys(all).forEach(key => {
      translator.add(all[key as keyof typeof all]);
    });
  }
}
