import { areAllLeafs } from '../utils/tree-utils';

export function getPath(points, r) {
  // gets the path from first to last points, making turns with radius r at intermediate points
  let pathString = `M ${points[0].x} ${points[0].y}`;
  let dir = {
    x: Math.sign(points[1].x - points[0].x),
    y: Math.sign(points[1].y - points[0].y),
  };

  for (let i = 1; i < points.length; ++i) {
    const point = points[i];
    if (!(dir.x === 0 && dir.y === 0)) {
      pathString += ` L ${point.x - dir.x * r} ${point.y - dir.y * r}`;
    }
    // Don't add curve for last point
    if (i < points.length - 1) {
      dir = {
        x: Math.sign(points[i + 1].x - point.x),
        y: Math.sign(points[i + 1].y - point.y),
      };
      if (!(dir.x === 0 && dir.y === 0)) {
        pathString += ` Q ${point.x} ${point.y} ${point.x + dir.x * r} ${point.y + dir.y * r}`;
      }
    }
  }

  return pathString;
}

export default function path(node, o, isVertical) {
  // Create the lines (links) between the nodes
  node
    .append('path')
    .attr('class', 'link')
    .attr('id', d => d.data.id)
    .attr('d', d => {
      if (d.parent) {
        const r = 30;
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
        } else {
          points = isVertical
            ? [
              { x: start.x, y: start.y },
              { x: start.x, y: start.y - halfDepth },
              { x: end.x, y: start.y - halfDepth },
              { x: end.x, y: end.y },
            ]
            : [
              { x: start.x, y: start.y },
              { x: start.x - halfDepth, y: start.y },
              { x: start.x - halfDepth, y: end.y },
              { x: end.x, y: end.y },
            ];
        }

        return getPath(points, r);
      }

      return '';
    });
}
