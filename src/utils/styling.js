import colorUtils from './color-utils';

const stylingUtils = {
  cardStyling: ({ Theme, layout }) => {
    const palette = colorUtils.getPalette(Theme);
    const backgroundColor = layout.style.background.useColorExpression
      ? colorUtils.resolveExpression(layout.style.background.colorExpression)
      : colorUtils.resolveColor(layout.style.background.color, palette);

    const labelColor = layout.style.label.useColorExpression
      ? colorUtils.resolveExpression(layout.style.label.colorExpression)
      : colorUtils.resolveColor(layout.style.label.color, palette);

    const subLabelColor = layout.style.subLabel.useColorExpression
      ? colorUtils.resolveExpression(layout.style.subLabel.colorExpression)
      : colorUtils.resolveColor(layout.style.subLabel.color, palette);

    const detailsColor = layout.style.details.useColorExpression
      ? colorUtils.resolveExpression(layout.style.details.colorExpression)
      : colorUtils.resolveColor(layout.style.details.color, palette);

    const cardStyling = {
      backgroundColor,
      label: `white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-size:24px;color:${labelColor}`,
      subLabel: `white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-size:20px;color:${subLabelColor}`,
      details: `white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-size:20px;color:${detailsColor}`,
    };
    return cardStyling;
  },
};

export default stylingUtils;
