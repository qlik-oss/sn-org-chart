import { areAllLeafs } from '../utils/tree-utils';

export default function path(node, o, isVertical) {
  // Create the lines (links) between the nodes
  node
    .append('path')
    .attr('class', 'link')
    .attr('id', d => d.data.id)
    .attr('d', d => {
      if (d.parent) {
        const halfNode = { x: o.nodeSize.width / 2, y: o.nodeSize.height / 2 };
        const start = { x: o.x(d) + halfNode.x, y: o.y(d) + halfNode.y };
        const end = { x: o.x(d.parent) + halfNode.x, y: o.y(d.parent) + halfNode.y };
        const size = { x: Math.abs(end.x - start.x), y: Math.abs(end.y - start.y) };
        const inverse = { x: end.x - start.x < 0 ? -1 : 1, y: end.y - start.y < 0 ? -1 : 1 };
        const rDef = 30;

        if (areAllLeafs(d.parent.children)) {
          const halfDepth = o.depthSpacing / 2;
          const r = { x: inverse.x * rDef, y: inverse.y * rDef };
          if (isVertical) {
            return `
              M ${start.x} ${start.y}
              L ${end.x - halfNode.x - r.x} ${start.y}
              C ${end.x - halfNode.x} ${start.y} ${end.x - halfNode.x} ${start.y} ${end.x - halfNode.x} ${start.y + r.y}
              L ${end.x - halfNode.x} ${end.y + halfDepth - r.y}
              C ${end.x - halfNode.x} ${end.y + halfDepth} ${end.x - halfNode.x} ${end.y + halfDepth} ${end.x - halfNode.x - r.x} ${end.y + halfDepth}
              L ${end.x + r.x} ${end.y + halfDepth}
              C ${end.x} ${end.y + halfDepth} ${end.x} ${end.y + halfDepth} ${end.x} ${end.y + halfDepth + r.y}
              L ${end.x} ${end.y}
              `;
          }
          return `
            M ${start.x} ${start.y}
            L ${start.x} ${end.y - halfNode.y - r.y}
            C ${start.x} ${end.y - halfNode.y} ${start.x} ${end.y - halfNode.y} ${start.x + r.x} ${end.y - halfNode.y}
            L ${end.x + halfDepth - r.x} ${end.y - halfNode.y}
            C ${end.x + halfDepth} ${end.y - halfNode.y} ${end.x + halfDepth} ${end.y - halfNode.y} ${end.x + halfDepth} ${end.y - halfNode.y - r.y}
            L ${end.x + halfDepth} ${end.y + r.y}
            C ${end.x + halfDepth} ${end.y} ${end.x + halfDepth} ${end.y} ${end.x + halfDepth + r.x} ${end.y}
            L ${end.x} ${end.y}
            `;
        }

        const rAbs = Math.min(size.x, size.y) / 2 < rDef ? Math.min(size.x, size.y) / 2 : rDef;
        const r = { x: inverse.x * rAbs, y: inverse.y * rAbs };
        let dist;
        let firstLine;
        let firstCurve;
        let secondCurve;
        if (isVertical) {
          dist = { x: inverse.x * (size.x - rAbs * 2), y: inverse.y * (size.y / 2 - rAbs) };
          firstLine = `${start.x} ${start.y + dist.y}`;
          firstCurve = `${start.x} ${start.y + dist.y + r.y} ${start.x} ${start.y + dist.y + r.y} ${start.x + r.x} ${start.y + dist.y + r.y}`;
          secondCurve = `${end.x}  ${start.y + dist.y + r.y} ${end.x}  ${start.y + dist.y + r.y} ${end.x} ${end.y - dist.y}`;
        } else {
          dist = { x: inverse.x * (size.x / 2 - rAbs), y: inverse.y * (size.y - rAbs * 2) };
          firstLine = `${start.x + dist.x} ${start.y}`;
          firstCurve = `${start.x + dist.x + r.x} ${start.y} ${start.x + dist.x + r.x} ${start.y} ${start.x + dist.x + r.x} ${start.y + r.y}`;
          secondCurve = `${start.x + dist.x + r.x} ${end.y} ${start.x + dist.x + r.x} ${end.y} ${end.x - dist.x} ${end.y}`;
        }

        return `
          M ${start.x} ${start.y}
          L ${firstLine}
          C ${firstCurve}
          L ${start.x + dist.x + r.x} ${start.y + dist.y + r.y}
          C ${secondCurve}
          L ${end.x} ${end.y}
          `;
      }

      return '';
    });
}
