import { areAllLeafs } from '../utils/tree-utils';

export default function position(orientation, nodeSize, element) {
  const nodeMargin = 100;
  let widthSpacing;
  let depthSpacing;

  // TODO: should expose for test, need to pass more arguments...
  const widthTranslation = (d, axis) => {
    if (d.parent) {
      if (!d.parent[axis]) {
        d.parent[axis] = widthTranslation(d.parent, axis);
      }
      d[axis] = areAllLeafs(d.parent.children)
        ? d.parent[axis] + nodeMargin / 2
        : d.parent[axis] + (d.data.childNumber - (d.parent.children.length - 1) / 2) * widthSpacing;
    } else if (!d.children) {
      d[axis] = 0;
    } else {
      // In case of zoom mode we need to have the tree moved to the right from the start
      const neededWidth = (nodeSize.width + nodeMargin) * d.children.length - nodeMargin;
      const zoomFactor = neededWidth / element.clientWidth;
      d[axis] = (element.clientWidth / 2) * zoomFactor - nodeSize.width / 2;
      if (!d.zoomFactor) {
        d.zoomFactor = zoomFactor;
      }
    }

    return d[axis];
  };

  const depthTranslation = (d, axis) => {
    if (d.parent && areAllLeafs(d.parent.children)) {
      d[axis] = d.parent[axis] + (d.data.childNumber + 1) * depthSpacing;
    } else {
      d[axis] = d.y;
    }
    return d[axis];
  };

  let orientations;
  switch (orientation) {
    case 'ttb':
      widthSpacing = nodeSize.width + nodeMargin;
      depthSpacing = nodeSize.height + nodeMargin;
      orientations = {
        depthSpacing,
        nodeSize,
        x: d => widthTranslation(d, 'xActual'),
        y: d => depthTranslation(d, 'yActual'),
      };
      break;
    case 'btt':
      widthSpacing = nodeSize.width + nodeMargin;
      depthSpacing = -nodeSize.height - nodeMargin;
      orientations = {
        depthSpacing,
        nodeSize,
        x: d => widthTranslation(d, 'xActual'),
        y: d => depthTranslation(d, 'yActual'),
      };
      break;
    case 'ltr':
      widthSpacing = nodeSize.height + nodeMargin;
      depthSpacing = nodeSize.width + nodeMargin;
      orientations = {
        depthSpacing,
        nodeSize,
        x: d => depthTranslation(d, 'xActual'),
        y: d => widthTranslation(d, 'yActual'),
      };
      break;
    case 'rtl':
      widthSpacing = nodeSize.height + nodeMargin;
      depthSpacing = -nodeSize.width - nodeMargin;
      orientations = {
        depthSpacing,
        nodeSize,
        x: d => depthTranslation(d, 'xActual'),
        y: d => widthTranslation(d, 'yActual'),
      };
      break;
    default:
      break;
  }
  return orientations;
}
