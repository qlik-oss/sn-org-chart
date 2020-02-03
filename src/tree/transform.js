import { select, zoom, event, zoomIdentity } from 'd3';

const getBBoxOfNodes = (nodes, nodeSize) => {
  const bbox = {
    left: Infinity,
    top: Infinity,
    right: -Infinity,
    bottom: -Infinity,
  };
  nodes.forEach(node => {
    bbox.left = Math.min(node.xActual, bbox.left);
    bbox.top = Math.min(node.yActual, bbox.top);
    bbox.right = Math.max(node.xActual, bbox.right);
    bbox.bottom = Math.max(node.yActual, bbox.bottom);
  });
  return {
    x: bbox.left,
    y: bbox.top,
    width: bbox.right - bbox.left + nodeSize.width,
    height: bbox.bottom - bbox.top + nodeSize.height,
  };
};

export function applyTransform(eventTransform, svg, divBox, width, height) {
  console.log(eventTransform);
  const scaleFactor = eventTransform.k;
  const translation = `${eventTransform.x}px, ${eventTransform.y}px`;

  svg.attr('transform', eventTransform);
  divBox.classed('org-disable-transition', true);
  svg.classed('org-disable-transition', true);

  divBox.attr(
    'style',
    `width:${width}px;height:${height}px; transform: translate(${translation}) scale(${scaleFactor})`
  );
}

export default function transform(element, freeTransform, nodes, nodeSize, width, height, svg, divBox) {
  const bBox = getBBoxOfNodes(nodes, nodeSize);
  const scaleToWidhth = bBox.width / width > bBox.height / height;
  const scaleFactor = scaleToWidhth ? bBox.width / width : bBox.height / height;
  const translation = scaleToWidhth
    ? `${-bBox.x}px, ${-bBox.y + (height * scaleFactor - bBox.height) / 2}px`
    : `${-bBox.x + (width * scaleFactor - bBox.width) / 2}px, ${-bBox.y}px`;

  const svgTranslate = scaleToWidhth
    ? `${-bBox.x} ${-bBox.y + (height * scaleFactor - bBox.height) / 2}`
    : `${-bBox.x + (width * scaleFactor - bBox.width) / 2} ${-bBox.y}`;
  if (freeTransform) {
    select(element).call(
      zoom()
        .extent([
          [0, 0],
          [width, height],
        ])
        .scaleExtent([0.5, 8])
        .on('zoom', zoomed)
    );

    applyTransform(zoomIdentity.translate(50, 50).scale(1), svg, divBox, width, height);

    function zoomed() {
      applyTransform(event.transform, svg, divBox, width, height);
    }
  } else {
    // Zooming and positioning of the tree

    const isIE11 = !!window.MSInputMethodContext && !!document.documentMode;
    if (isIE11) {
      // Transition using d3 + svg transform, for IE11
      svg.attr('transform', `scale(${1 / scaleFactor}) translate(${svgTranslate})`);
      divBox.classed('org-disable-transition', true);
      svg.classed('org-disable-transition', true);
    } else {
      // Transition using css, does not work in IE11
      svg.attr('style', `transform: scale(${1 / scaleFactor}) translate(${translation});`);
      divBox.classed('org-disable-transition', false);
      svg.classed('org-disable-transition', false);
    }

    divBox.attr(
      'style',
      `width:${width}px;height:${height}px;
      transform: scale(${1 / scaleFactor}) translate(${translation});`
    );
  }
}
