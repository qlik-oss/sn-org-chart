import { haveNoChildren } from '../utils/tree-utils';
import constants from './size-constants';

export const widthTranslation = (d, widthSpacing, element, axis) => {
  const { widthMargin, cardWidth, buttonMargin } = constants;

  if (d.parent) {
    if (!d.parent[axis]) {
      d.parent[axis] = widthTranslation(d.parent, widthSpacing, element, axis);
    }
    d[axis] =
      d.parent.data.id !== 'Root' && haveNoChildren(d.parent.children)
        ? d.parent[axis] + buttonMargin
        : d.parent[axis] + (d.data.childNumber - (d.parent.children.length - 1) / 2) * widthSpacing;
  } else if (!d.children) {
    d[axis] = (element.clientWidth - cardWidth) / 2;
    d.zoomFactor = 1;
  } else {
    // In case of zoom mode we need to have the tree moved to the right from the start
    const neededWidth = (cardWidth + widthMargin) * d.children.length - widthMargin;
    const zoomFactor = neededWidth / element.clientWidth;
    d[axis] = (element.clientWidth / 2) * zoomFactor - cardWidth / 2;
    if (!d.zoomFactor) {
      d.zoomFactor = zoomFactor;
    }
  }

  return d[axis];
};

export const depthTranslation = (d, depthSpacing, axis) => {
  const { cardHeight, leafMargin } = constants;

  if (d.parent && d.parent.data.id !== 'Root' && haveNoChildren(d.parent.children)) {
    d[axis] = d.parent.y + depthSpacing + d.data.childNumber * (cardHeight + leafMargin);
  } else {
    d[axis] = d.y;
  }
  return d[axis];
};

export default function position(orientation, element) {
  const { widthMargin, heightMargin, cardWidth, cardHeight } = constants;
  let widthSpacing;
  let depthSpacing;

  let orientations;
  switch (orientation) {
    case 'ttb':
      widthSpacing = cardWidth + widthMargin;
      depthSpacing = cardHeight + heightMargin;
      orientations = {
        depthSpacing,
        isVertical: true,
        x: d => widthTranslation(d, widthSpacing, element, 'xActual'),
        y: d => depthTranslation(d, depthSpacing, 'yActual'),
      };
      break;
    // case 'btt':
    //   widthSpacing = cardWidth + widthMargin;
    //   depthSpacing = -cardHeight - heightMargin;
    //   orientations = {
    //     depthSpacing,
    //     isVertical: true,
    //     x: d => widthTranslation(d, element, 'xActual'),
    //     y: d => depthTranslation(d, 'yActual'),
    //   };
    //   break;
    // case 'ltr':
    //   widthSpacing = cardHeight + heightMargin;
    //   depthSpacing = cardWidth + widthMargin;
    //   orientations = {
    //     depthSpacing,
    //     isVertical: false,
    //     x: d => depthTranslation(d, 'xActual'),
    //     y: d => widthTranslation(d, element, 'yActual'),
    //   };
    //   break;
    // case 'rtl':
    //   widthSpacing = cardHeight + heightMargin;
    //   depthSpacing = -cardWidth - widthMargin;
    //   orientations = {
    //     depthSpacing,
    //     isVertical: false,
    //     x: d => depthTranslation(d, 'xActual'),
    //     y: d => widthTranslation(d, element, 'yActual'),
    //   };
    //   break;
    default:
      break;
  }
  return orientations;
}
