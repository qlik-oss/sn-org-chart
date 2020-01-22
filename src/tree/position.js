const siblingSpacing = 30;
export default function position(orientation, nodeSize) {
  // This would allow for different orientations of the tree structure (not needed for now)
  let orientations;
  switch (orientation) {
    case 'ttb':
      orientations = {
        'top-to-bottom': {
          depthSpacing: 200,
          pathOffsetSelf: {
            x: nodeSize.width / 2,
            y: 0,
          },
          pathOffsetParent: {
            x: nodeSize.width / 2,
            y: nodeSize.height,
          },
          x(d) {
            // eslint-disable-next-line no-param-reassign
            d.xActual =
              d.parent && d.parent.xActual
                ? d.parent.xActual +
                  nodeSize.width / 2 +
                  siblingSpacing / 2 +
                  (d.data.childNumber - d.parent.children.length / 2) * (nodeSize.width + siblingSpacing)
                : 1;
            return d.xActual;
          },
          y(d) {
            return d.y;
          },
        },
      };
      break;
    case 'btt':
      orientations = {
        'bottom-to-top': {
          depthSpacing: -200,
          pathOffsetSelf: {
            x: nodeSize.width / 2,
            y: nodeSize.height,
          },
          pathOffsetParent: {
            x: nodeSize.width / 2,
            y: 0,
          },
          x(d) {
            // eslint-disable-next-line no-param-reassign
            d.xActual =
              d.parent && d.parent.xActual
                ? d.parent.xActual +
                  nodeSize.width / 2 +
                  siblingSpacing / 2 +
                  (d.data.childNumber - d.parent.children.length / 2) * (nodeSize.width + siblingSpacing)
                : 1;
            return d.xActual;
          },
          y(d) {
            return d.y;
          },
        },
      };
      break;
    case 'ltr':
      orientations = {
        'left-to-right': {
          depthSpacing: 500,
          pathOffsetSelf: {
            x: 0,
            y: nodeSize.height / 2,
          },
          pathOffsetParent: {
            x: nodeSize.width,
            y: nodeSize.height / 2,
          },
          y(d) {
            // eslint-disable-next-line no-param-reassign
            d.yActual =
              d.parent && d.parent.yActual
                ? d.parent.yActual +
                  nodeSize.height / 2 +
                  siblingSpacing / 2 +
                  (d.data.childNumber - d.parent.children.length / 2) * (nodeSize.height + siblingSpacing)
                : 1;
            return d.yActual;
          },
          x(d) {
            return d.y;
          },
        },
      };
      break;
    case 'rtl':
      orientations = {
        'right-to-left': {
          depthSpacing: -500,
          pathOffsetSelf: {
            x: nodeSize.width,
            y: nodeSize.height / 2,
          },
          pathOffsetParent: {
            x: 0,
            y: nodeSize.height / 2,
          },
          y(d) {
            // eslint-disable-next-line no-param-reassign
            d.yActual =
              d.parent && d.parent.yActual
                ? d.parent.yActual +
                  nodeSize.height / 2 +
                  siblingSpacing / 2 +
                  (d.data.childNumber - d.parent.children.length / 2) * (nodeSize.height + siblingSpacing)
                : 1;
            return d.yActual;
          },
          x(d) {
            return d.y;
          },
        },
      };
      break;
    default:
      break;
  }
  return orientations;
}
