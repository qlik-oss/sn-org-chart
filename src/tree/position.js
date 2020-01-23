// const siblingSpacing = 50;

export default function position(orientation, nodeSize) {
  const nodeMargin = 100;
  let siblingSpacing;
  let depthSpacing;

  const isOnlyLeafs = children => {
    for (let i = 0; i < children.length; ++i) {
      if (children[i].children !== undefined) {
        return false;
      }
    }
    return true;
  };

  const widthTranslation = (d, axis) => {
    if (d.parent && isOnlyLeafs(d.parent.children)) {
      d[axis] = d.parent[axis] + nodeMargin / 2;
    } else {
      d[axis] = d.parent
        ? d.parent[axis] + siblingSpacing / 2 + (d.data.childNumber - d.parent.children.length / 2) * siblingSpacing
        : 0;
    }

    return d[axis];
  };

  const depthTranslation = (d, axis) => {
    if (d.parent && isOnlyLeafs(d.parent.children)) {
      d[axis] = d.parent[axis] + depthSpacing + d.data.childNumber * depthSpacing;
    } else {
      d[axis] = d.y;
    }
    return d[axis];
  };

  let orientations;
  switch (orientation) {
    case 'ttb':
      siblingSpacing = nodeSize.width + nodeMargin;
      depthSpacing = nodeSize.height + nodeMargin;
      orientations = {
        'top-to-bottom': {
          depthSpacing,
          x: d => widthTranslation(d, 'xActual'),
          y: d => depthTranslation(d, 'yActual'),
        },
      };
      break;
    case 'btt':
      siblingSpacing = nodeSize.width + nodeMargin;
      depthSpacing = -nodeSize.height - nodeMargin;
      orientations = {
        'bottom-to-top': {
          depthSpacing,
          x: d => widthTranslation(d, 'xActual'),
          y: d => depthTranslation(d, 'yActual'),
        },
      };
      break;
    case 'ltr':
      siblingSpacing = nodeSize.height + nodeMargin;
      depthSpacing = nodeSize.width + nodeMargin;
      orientations = {
        'left-to-right': {
          depthSpacing,
          x: d => depthTranslation(d, 'xActual'),
          y: d => widthTranslation(d, 'yActual'),
        },
      };
      break;
    case 'rtl':
      siblingSpacing = nodeSize.height + nodeMargin;
      depthSpacing = -nodeSize.width - nodeMargin;
      orientations = {
        'right-to-left': {
          depthSpacing,
          x: d => depthTranslation(d, 'xActual'),
          y: d => widthTranslation(d, 'yActual'),
        },
      };
      break;
    default:
      break;
  }
  return orientations;
}
