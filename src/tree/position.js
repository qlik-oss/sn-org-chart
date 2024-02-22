import { haveNoChildren } from "../utils/tree-utils";
import constants from "./size-constants";

export const widthTranslation = (d, widthSpacing, element, axis, initialZoomState, navigationMode) => {
  const { buttonMargin } = constants;
  const initialX = (initialZoomState && initialZoomState.initialX) || 0;
  if (navigationMode === "expandAll") {
    d[axis] = d.x + initialX;
    return d[axis];
  }
  if (d.parent) {
    if (!d.parent[axis]) {
      d.parent[axis] = widthTranslation(d.parent, widthSpacing, element, axis, initialZoomState);
    }
    if (d.parent.data.id === "Root") {
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

  return d[axis];
};

export const depthTranslation = (d, depthSpacing, axis, initialZoomState, navigationMode, styling) => {
  const { cardHeight, cardHeightLarge, leafMargin } = constants;
  const initialY = (initialZoomState && initialZoomState.initialY) || 0;

  if (d.parent && d.parent.data.id !== "Root" && navigationMode !== "expandAll" && haveNoChildren(d.parent.children)) {
    //d[axis] = d.parent.y + depthSpacing + d.data.childNumber * (([undefined, 'left', 'right'].includes(styling.alignment) ? cardHeight : cardHeightLarge) + leafMargin) + initialY;
    d[axis] = d.parent.y + depthSpacing + d.data.childNumber * (([undefined, 'left', 'right'].includes(styling.alignment) || styling.location === 'tooltip' ? cardHeight : cardHeightLarge) + leafMargin) + initialY;
  } else {
    d[axis] = d.y + initialY;
  }
  return d[axis];
};

export default function position(orientation, element, initialZoomState, navigationMode, styling) {
  const { widthMargin, heightMargin, cardWidth, cardHeight, cardHeightLarge, cardPadding } = constants;
  let widthSpacing;
  let depthSpacing;

  let orientations;
  //const actualCardHeight = styling ? [undefined, 'left', 'right'].includes(styling.alignment) ? cardHeight : cardHeightLarge : cardHeight;
  const actualCardHeight = styling ? [undefined, 'left', 'right'].includes(styling.alignment) || styling.location === 'tooltip' ? cardHeight : cardHeightLarge : cardHeight;
  switch (orientation) {
    case "ttb":
      widthSpacing = cardWidth + widthMargin;
      depthSpacing = navigationMode === 'expandAll' ? actualCardHeight + 2 * cardPadding : actualCardHeight + heightMargin;
      orientations = {
        depthSpacing,
        isVertical: true,
        x: (d) => widthTranslation(d, widthSpacing, element, "xActual", initialZoomState, navigationMode),
        y: d => depthTranslation(d, depthSpacing, 'yActual', initialZoomState, navigationMode, styling),
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
