export default function path(node, o, isVertical, nodeSize) {
  const isOnlyLeafs = children => {
    for (let i = 0; i < children.length; ++i) {
      if (children[i].children !== undefined) {
        return false;
      }
    }
    return true;
  };
  // Create the lines (links) between the nodes
  node
    .append('path')
    .attr('class', 'link')
    .attr('id', d => d.data.id)
    .attr('style', 'color:white;')
    .attr('d', d => {
      if (d.parent) {
        const halfNode = { x: nodeSize.width / 2, y: nodeSize.height / 2 };
        const start = { x: o.x(d) + halfNode.x, y: o.y(d) + halfNode.y };
        const end = { x: o.x(d.parent) + halfNode.x, y: o.y(d.parent) + halfNode.y };
        const size = { x: Math.abs(end.x - start.x), y: Math.abs(end.y - start.y) };
        const inverse = { x: end.x - start.x < 0 ? -1 : 1, y: end.y - start.y < 0 ? -1 : 1 };
        const rDef = 30;

        if (isOnlyLeafs(d.parent.children)) {
          const halfDepth = o.depthSpacing / 2;
          const r = { x: inverse.x * rDef, y: inverse.y * rDef };
          let firstLine;
          let firstCurve;
          let secondLine;
          let secondCurve;
          let thirdLine;
          let thirdCurve;
          if (isVertical) {
            firstLine = `${end.x - halfNode.x - r.x} ${start.y}`;
            firstCurve = `${end.x - halfNode.x} ${start.y} ${end.x - halfNode.x} ${start.y} ${end.x - halfNode.x} ${start.y + r.y}`;
            secondLine = `${end.x - halfNode.x} ${end.y + halfDepth - r.y}`;
            secondCurve = `${end.x - halfNode.x} ${end.y + halfDepth} ${end.x - halfNode.x} ${end.y + halfDepth} ${end.x - halfNode.x - r.x} ${end.y + halfDepth}`;
            thirdLine = `${end.x + r.x} ${end.y + halfDepth}`;
            thirdCurve = `${end.x} ${end.y + halfDepth} ${end.x} ${end.y + halfDepth} ${end.x} ${end.y + halfDepth + r.y}`;
          } else {
            firstLine = `${start.x} ${end.y - halfNode.y - r.y}`;
            firstCurve = `${start.x} ${end.y - halfNode.y} ${start.x} ${end.y - halfNode.y} ${start.x + r.x} ${end.y - halfNode.y}`;
            secondLine = `${end.x + halfDepth - r.x} ${end.y - halfNode.y}`;
            secondCurve = `${end.x + halfDepth} ${end.y - halfNode.y} ${end.x + halfDepth} ${end.y - halfNode.y} ${end.x + halfDepth} ${end.y - halfNode.y - r.y}`;
            thirdLine = `${end.x + halfDepth} ${end.y + r.y} `;
            thirdCurve = `${end.x + halfDepth} ${end.y} ${end.x + halfDepth} ${end.y} ${end.x + halfDepth + r.x} ${end.y}`;
          }

          return `
              M ${start.x} ${start.y}
              L ${firstLine}
              C ${firstCurve}
              L ${secondLine}
              C ${secondCurve}
              L ${thirdLine}
              C ${thirdCurve}
              L ${end.x} ${end.y}
              `;
        }

        const rAbs = Math.min(size.x, size.y) / 2 < rDef ? Math.min(size.x, size.y) / 2 : rDef;
        const r = { x: inverse.x * rAbs, y: inverse.y * rAbs };
        let l;
        let firstLine;
        let firstCurve;
        let secondCurve;
        if (isVertical) {
          l = { x: inverse.x * (size.x - rAbs * 2), y: inverse.y * (size.y / 2 - rAbs) };
          firstLine = `${start.x} ${start.y + l.y}`;
          firstCurve = `${start.x} ${start.y + l.y + r.y} ${start.x} ${start.y + l.y + r.y} ${start.x + r.x} ${start.y + l.y + r.y}`;
          secondCurve = `${end.x}  ${start.y + l.y + r.y} ${end.x}  ${start.y + l.y + r.y} ${end.x} ${end.y - l.y}`;
        } else {
          l = { x: inverse.x * (size.x / 2 - rAbs), y: inverse.y * (size.y - rAbs * 2) };
          firstLine = `${start.x + l.x} ${start.y}`;
          firstCurve = `${start.x + l.x + r.x} ${start.y} ${start.x + l.x + r.x} ${start.y} ${start.x + l.x + r.x} ${start.y + r.y}`;
          secondCurve = `${start.x + l.x + r.x} ${end.y} ${start.x + l.x + r.x} ${end.y} ${end.x - l.x} ${end.y}`;
        }

        return `
            M ${start.x} ${start.y}
            L ${firstLine}
            C ${firstCurve}
            L ${start.x + l.x + r.x} ${start.y + l.y + r.y}
            C ${secondCurve}
            L ${end.x} ${end.y}
            `;
      }

      return '';
    });
}
