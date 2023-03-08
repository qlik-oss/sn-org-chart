import en from './en-US';

export default function autoRegister(translator) {
  if (translator && translator.get && translator.add) {
    const t = 'Object.OrgChart.MaxData';
    const g = translator.get(t);
    // if translated string is different from its id
    // assume translations already exists for current locale
    if (g !== t) {
      return;
    }

    Object.keys(en).forEach((key) => {
      translator.add({
        id: key,
        locale: {
          'en-US': en[key],
        },
      });
    });
  }
}
