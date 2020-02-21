import { haveNoChildren } from '../utils/tree-utils';
import constants from './size-constants';

export const widthTranslation = (d, widthSpacing, element, axis, initialZoomState) => {
  const { buttonMargin } = constants;

  if (d.parent) {
    if (!d.parent[axis]) {
      d.parent[axis] = widthTranslation(d.parent, widthSpacing, element, axis);
    }
    d[axis] =
      d.parent.data.id !== 'Root' && haveNoChildren(d.parent.children)
        ? d.parent[axis] + buttonMargin
        : d.parent[axis] + (d.data.childNumber - (d.parent.children.length - 1) / 2) * widthSpacing;
  } else {
    // In case of zoom mode we need to have the tree moved to the right from the start
    d[axis] = (initialZoomState && initialZoomState.x) || 0;
  }

  return d[axis];
};

export const depthTranslation = (d, depthSpacing, axis, initialZoomState) => {
  const { cardHeight, leafMargin } = constants;

  if (d.parent && d.parent.data.id !== 'Root' && haveNoChildren(d.parent.children)) {
    d[axis] =
      d.parent.y +
      depthSpacing +
      d.data.childNumber * (cardHeight + leafMargin) +
      ((initialZoomState && initialZoomState.y) || 0);
  } else {
    d[axis] = d.y + ((initialZoomState && initialZoomState.y) || 0);
  }
  return d[axis];
};

export default function position(orientation, element, initialZoomState) {
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
        x: d => widthTranslation(d, widthSpacing, element, 'xActual', initialZoomState),
        y: d => depthTranslation(d, depthSpacing, 'yActual', initialZoomState),
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
