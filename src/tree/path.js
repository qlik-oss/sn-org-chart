export default function path(node, o, isVertical) {
  // Create the lines (links) between the nodes
  node
    .append('path')
    .attr('class', 'link')
    .attr('id', (d) => d.data.id)
    .attr('d', (d) => {
      if (d.parent) {
        // starting at self, ending at parent
        const start = { x: o.x(d) + o.pathOffsetSelf.x, y: o.y(d) + o.pathOffsetSelf.y };
        const end = { x: o.x(d.parent) + o.pathOffsetParent.x, y: o.y(d.parent) + o.pathOffsetParent.y };
        const size = { x: Math.abs(end.x - start.x), y: Math.abs(end.y - start.y) };
        // factors inverseíng direction of lines and curves
        const inverse = { x: end.x - start.x < 0 ? -1 : 1, y: end.y - start.y < 0 ? -1 : 1 };
        // radius of elbow
        const rDef = 30;
        const rAbs = Math.min(size.x, size.y) / 2 < rDef ? Math.min(size.x, size.y) / 2 : rDef;
        const r = { x: inverse.x * rAbs, y: inverse.y * rAbs };
        let l;
        let firstLine;
        let firstCurve;
        let secondCurve;

        if (isVertical) {
          l = { x: inverse.x * (size.x - rAbs * 2), y: inverse.y * (size.y / 2 - rAbs) };
          firstLine = `${start.x} ${start.y + l.y}`;
          firstCurve = `${start.x} ${start.y + l.y + r.y} ${start.x} ${start.y + l.y + r.y} ${start.x + r.x} ${start.y
            + l.y
            + r.y}`;
          secondCurve = `${end.x}  ${start.y + l.y + r.y} ${end.x}  ${start.y + l.y + r.y} ${end.x} ${end.y - l.y}`;
        } else {
          l = { x: inverse.x * (size.x / 2 - rAbs), y: inverse.y * (size.y - rAbs * 2) };
          firstLine = `${start.x + l.x} ${start.y}`;
          firstCurve = `${start.x + l.x + r.x} ${start.y} ${start.x + l.x + r.x} ${start.y} ${start.x
            + l.x
            + r.x} ${start.y + r.y}`;
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
