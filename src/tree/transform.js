import constants from './size-constants';

const getBBoxOfNodes = nodes => {
  const { cardWidth, cardHeight, buttonHeight, buttonMargin } = constants;
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
    y: bbox.top - buttonHeight - buttonMargin,
    width: bbox.right - bbox.left + cardWidth,
    height: bbox.bottom - bbox.top + cardHeight + (buttonHeight + buttonMargin) * 2,
  };
};

export default function transform(nodes, width, height, svg, divBox, useTransitions) {
  // Zooming and positioning of the tree
  const bBox = getBBoxOfNodes(nodes);
  const scaleToWidhth = bBox.width / width > bBox.height / height;
  const scaleFactor = scaleToWidhth ? bBox.width / width : bBox.height / height;
  const translation = scaleToWidhth
    ? `${-bBox.x}px, ${-bBox.y + (height * scaleFactor - bBox.height) / 2}px`
    : `${-bBox.x + (width * scaleFactor - bBox.width) / 2}px, ${-bBox.y}px`;

  const svgTranslate = scaleToWidhth
    ? `${-bBox.x} ${-bBox.y + (height * scaleFactor - bBox.height) / 2}`
    : `${-bBox.x + (width * scaleFactor - bBox.width) / 2} ${-bBox.y}`;

  const isIE11 = !!window.MSInputMethodContext && !!document.documentMode;
  if (isIE11) {
    // Transition using d3 + svg transform, for IE11
    svg.attr('transform', `scale(${1 / scaleFactor}) translate(${svgTranslate})`);
    divBox.classed('org-disable-transition', true);
    svg.classed('org-disable-transition', true);
  } else {
    // Transition using css, does not work in IE11
    svg.attr('style', `transform: scale(${1 / scaleFactor}) translate(${translation});`);
    divBox.classed('org-disable-transition', !useTransitions);
    svg.classed('org-disable-transition', !useTransitions);
  }

  divBox.attr(
    'style',
    `width:${width}px;height:${height}px;
  transform: scale(${1 / scaleFactor}) translate(${translation});`
  );
}
