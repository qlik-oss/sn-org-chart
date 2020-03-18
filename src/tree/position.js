import { haveNoChildren } from '../utils/tree-utils';
import constants from './size-constants';

export const widthTranslation = (d, widthSpacing, element, axis, initialZoomState, navigationMode) => {
  const { buttonMargin } = constants;
  const initialX = (initialZoomState && initialZoomState.initialX) || 0;

  switch (navigationMode) {
    case 'expandAll':
      d[axis] = d.x + initialX;
      break;
    default:
      if (navigationMode === 'expandAll') {
        d[axis] = d.x;
        return d.x;
      }
      if (d.parent) {
        if (!d.parent[axis]) {
          d.parent[axis] = widthTranslation(d.parent, widthSpacing, element, axis, initialZoomState);
        }
        if (d.parent.data.id === 'Root') {
          d[axis] = d.parent[axis] + (d.data.childNumber - (d.parent.children.length - 1) / 2) * widthSpacing;
        } else {
          d[axis] = haveNoChildren(d.parent.children)
            ? d.parent[axis] + buttonMargin
            : d.parent[axis] + (d.data.childNumber - (d.parent.children.length - 1) / 2) * widthSpacing;
        }
      } else {
        // In case of zoom mode we need to have the tree moved to the right from the start
        d[axis] = initialX;
      }
      break;
  }

  return d[axis];
};

export const depthTranslation = (d, depthSpacing, axis, initialZoomState, navigationMode) => {
  const { cardHeight, leafMargin } = constants;
  const initialY = (initialZoomState && initialZoomState.initialY) || 0;

  if (d.parent && d.parent.data.id !== 'Root' && navigationMode !== 'expandAll' && haveNoChildren(d.parent.children)) {
    d[axis] = d.parent.y + depthSpacing + d.data.childNumber * (cardHeight + leafMargin) + initialY;
  } else {
    d[axis] = d.y + initialY;
  }
  return d[axis];
};

export default function position(orientation, element, initialZoomState, navigationMode) {
  const { widthMargin, heightMargin, cardWidth, cardHeight } = constants;
  let widthSpacing;
  let depthSpacing;

  let orientations;
  switch (orientation) {
    case 'ttb':
      widthSpacing = cardWidth + widthMargin;
      depthSpacing = navigationMode === 'expandAll' ? cardHeight + widthMargin : cardHeight + heightMargin;
      orientations = {
        depthSpacing,
        isVertical: true,
        x: d => widthTranslation(d, widthSpacing, element, 'xActual', initialZoomState, navigationMode),
        y: d => depthTranslation(d, depthSpacing, 'yActual', initialZoomState, navigationMode),
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
