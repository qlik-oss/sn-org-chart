const siblingSpacing = 30;
export default function position(orientation, nodeSize) {
  const hasOnlyLeafs = children => {
    for (let i = 0; i < children.length; ++i) {
      console.log(children, i);
      if (children[i].children.length === 0) {
        return true;
      }
    }
    return false;
  };

  const widthTranslation = (d, axis) => {
    if (d.children.length > 0 && hasOnlyLeafs(d.children)) {
      d[axis] = d.parent[axis];
    } else {
      d[axis] =
        d.parent && d.parent[axis]
          ? d.parent[axis] +
            nodeSize.width / 2 +
            siblingSpacing / 2 +
            (d.data.childNumber - d.parent.children.length / 2) * (nodeSize.width + siblingSpacing)
          : 1;
    }

    return d[axis];
  };

  // const depthTranslation = (d, axis) => {
  //   d[axis] =
  //     d.parent && d.parent[axis]
  //       ? d.parent[axis] +
  //         nodeSize.width / 2 +
  //         siblingSpacing / 2 +
  //         (d.data.childNumber - d.parent.children.length / 2) * (nodeSize.width + siblingSpacing)
  //       : 1;
  //   return d[axis];
  // };

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
          x: d => widthTranslation(d, 'xActual'),
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

          x: d => widthTranslation(d, 'xActual'),
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

          y: d => widthTranslation(d, 'yActual'),
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
          y: d => widthTranslation(d, 'yActual'),
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
