import colorUtils from './color-utils';

function getColor(reference, palette) {
  return reference.useColorExpression
    ? colorUtils.resolveExpression(reference.colorExpression)
    : colorUtils.resolveColor(reference.color, palette);
}

const stylingUtils = {
  cardStyling: ({ Theme, layout }) => {
    const palette = colorUtils.getPalette(Theme);
    const backgroundColor = getColor(layout.style.background, palette);
    const labelColor = getColor(layout.style.label, palette);
    const subLabelColor = getColor(layout.style.subLabel, palette);
    const detailsColor = getColor(layout.style.details, palette);

    const cardStyling = {
      backgroundColor,
      label: `color:${labelColor};`,
      subLabel: `color:${subLabelColor};`,
      details: `color:${detailsColor};`,
    };
    return cardStyling;
  },
};

export default stylingUtils;
