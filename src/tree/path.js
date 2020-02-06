import { areAllLeafs } from '../utils/tree-utils';

export function getPoints(d, o, isVertical) {
  const halfNode = { x: o.nodeSize.width / 2, y: o.nodeSize.height / 2 };
  const halfDepth = o.depthSpacing / 2;
  const start = { x: o.x(d) + halfNode.x, y: o.y(d) + halfNode.y };
  const end = { x: o.x(d.parent) + halfNode.x, y: o.y(d.parent) + halfNode.y };
  let points;

  if (areAllLeafs(d.parent.children)) {
    points = isVertical
      ? [
        { x: start.x, y: start.y },
        { x: end.x - halfNode.x, y: start.y },
        { x: end.x - halfNode.x, y: end.y + halfDepth },
        { x: end.x, y: end.y + halfDepth },
        { x: end.x, y: end.y },
      ]
      : [
        { x: start.x, y: start.y },
        { x: start.x, y: end.y - halfNode.y },
        { x: end.x + halfDepth, y: end.y - halfNode.y },
        { x: end.x + halfDepth, y: end.y },
        { x: end.x, y: end.y },
      ];
  } else if (start.x === end.x || start.y === end.y) {
    points = [
      { x: start.x, y: start.y },
      { x: end.x, y: end.y },
    ];
  } else {
    points = isVertical
      ? [
        { x: start.x, y: start.y },
        { x: start.x, y: start.y - halfDepth + 16 },
        { x: end.x, y: start.y - halfDepth + 16 },
        { x: end.x, y: end.y },
      ]
      : [
        { x: start.x, y: start.y },
        { x: start.x - halfDepth, y: start.y },
        { x: start.x - halfDepth, y: end.y },
        { x: end.x, y: end.y },
      ];
  }
  return points;
}

export function getPath(points) {
  // gets the path from first to last points, making turns with radius r at intermediate points
  const r = 4;
  let pathString = `M ${points[0].x} ${points[0].y}`;
  let dir;
  function setDir(i) {
    const delta = { x: points[i].x - points[i - 1].x, y: points[i].y - points[i - 1].y };
    dir = {
      x: (delta.x > 0) - (delta.x < 0) || +delta.x,
      y: (delta.y > 0) - (delta.y < 0) || +delta.y,
    };
  }
  setDir(1);
  for (let i = 1; i < points.length; ++i) {
    const point = points[i];
    pathString += ` L ${point.x - dir.x * r} ${point.y - dir.y * r}`;
    // Don't add curve for last point
    if (i < points.length - 1) {
      setDir(i + 1);
      pathString += ` Q ${point.x} ${point.y} ${point.x + dir.x * r} ${point.y + dir.y * r}`;
    }
  }

  return pathString;
}

export default function path(node, o, isVertical, top) {
  // Create the lines (links) between the nodes
  node
    .append('path')
    .attr('class', 'link')
    .attr('id', d => d.data.id)
    .attr('d', d => {
      if (d.parent) {
        if (d === top) {
          return '';
          // TODO: make a special path here for the top node
        }
        const points = getPoints(d, o, isVertical);
        return getPath(points);
      }

      return '';
    });
}
