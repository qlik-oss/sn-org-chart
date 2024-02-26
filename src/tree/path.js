import { haveNoChildren } from "../utils/tree-utils";
import constants from "./size-constants";

export function getPoints(d, topId, { depthSpacing, isVertical, x, y }, navigationMode, styling) {
  
  // TODO: Generalize to make all directions work, currently on only ttb working
  const { cardWidth, cardHeight, cardHeightLarge, buttonHeight, cardPadding, buttonMargin } = constants;
  const actualCardHeight = [undefined, 'left', 'right'].includes(styling.alignment) || styling.location === 'tooltip' ? cardHeight : cardHeightLarge;
  const points = [];
  const halfCard = { x: cardWidth / 2, y: cardHeight / 2 };
  const start = { x: d.xActual, y: d.yActual };

  // TODO: fix so auto mode does not get a path to parent not showing
  if (d.parent && d.parent.data.id !== "Root") {
    const halfCard = { x: cardWidth / 2, y: actualCardHeight / 2 };
    const yOffset = navigationMode === 'expandAll' ? actualCardHeight : actualCardHeight + cardPadding + buttonHeight;
    const end = { x: x(d.parent) + halfCard.x, y: y(d.parent) + yOffset };

    if (navigationMode !== "expandAll" && haveNoChildren(d.parent.children)) {
      // to leafs
      points.push(
        isVertical
          ? [
              { x: start.x, y: start.y + halfCard.y },
              { x: end.x - halfCard.x, y: start.y + halfCard.y },
              { x: end.x - halfCard.x, y: end.y + buttonMargin },
              { x: end.x, y: end.y + buttonMargin },
              { x: end.x, y: end.y },
            ]
          : [
              { x: start.x, y: start.y },
              { x: start.x, y: end.y - halfCard.y },
              { x: end.x + halfDepth, y: end.y - halfCard.y },
              { x: end.x + halfDepth, y: end.y },
              { x: end.x, y: end.y },
            ],
      );
    } else if (start.x === x(d.parent) || start.y === y(d.parent)) {
      // straight line
      points.push([
        { x: start.x + halfCard.x, y: start.y },
        { x: end.x, y: end.y },
      ]);
    } else {
      // to nodes with children
      points.push(
        isVertical
          ? [
              { x: start.x + halfCard.x, y: start.y },
              { x: start.x + halfCard.x, y: start.y - cardPadding },
              { x: end.x, y: start.y - cardPadding },
              { x: end.x, y: end.y },
            ]
          : [
              { x: start.x, y: start.y },
              { x: start.x - cardPadding, y: start.y },
              { x: start.x - cardPadding, y: end.y },
              { x: end.x, y: end.y },
            ],
      );
    }
  } else if (d.parent) {
    // to up button or dummy root
    points.push([
      { x: start.x + halfCard.x, y: start.y },
      { x: start.x + halfCard.x, y: start.y - cardPadding },
    ]);
  }

  if (d.children && d.data.id !== "Root") {
    // to expand button
    points.push([
      { x: start.x + halfCard.x, y: start.y + actualCardHeight },
      { x: start.x + halfCard.x, y: start.y + actualCardHeight + cardPadding },
    ]);
  }

  return points;
}

export function getPath(points) {
  // gets the path from first to last points, making turns with radius r at intermediate points
  const { r } = constants;
  let pathString = `M ${points[0].x} ${points[0].y} `;
  let dir;
  const setDir = (i) => {
    const delta = {
      x: points[i].x - points[i - 1].x,
      y: points[i].y - points[i - 1].y,
    };
    dir = {
      x: (delta.x > 0) - (delta.x < 0) || +delta.x,
      y: (delta.y > 0) - (delta.y < 0) || +delta.y,
    };
  };
  setDir(1);
  for (let i = 1; i < points.length; ++i) {
    const point = points[i];
    if (i < points.length - 1) {
      pathString += `L ${point.x - dir.x * r} ${point.y - dir.y * r} `;
      setDir(i + 1);
      pathString += `Q ${point.x} ${point.y} ${point.x + dir.x * r} ${point.y + dir.y * r} `;
    } else {
      // Don't add curve for last point
      pathString += `L ${point.x} ${point.y} `;
    }
  }

  return pathString;
}

export default function createPaths(node, positioning, topId, navigationMode, styling) {
  node
    .append("path")
    .attr("class", "sn-org-path")
    .attr("id", (d) => d.data.id)
    .attr("d", (d) => {
      let path = "";
      const pointSets = getPoints(d, topId, positioning, navigationMode, styling);
      pointSets.forEach((points) => {
        path += getPath(points).slice(0, -1);
      });

      return path;
    });
}
