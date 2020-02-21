import { select, zoom, event, zoomIdentity } from 'd3';
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

export function applyTransform(eventTransform, svg, divBox, width, height) {
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

export function setZooming({ objectData, setTransform, transformState, selectionsAndTransform }) {
  const { svg, divBox, width, height, zoomWrapper, allNodes, element } = objectData;
  const { x = 0, y = 0 } = transformState;
  const maxZoom = 6;
  const minZoom = 0.2;
  const zoomFactor = (transformState && 1 / transformState.zoom) || allNodes.zoomFactor;
  const scaleFactor = Math.max(Math.min(maxZoom, zoomFactor), minZoom);

  // sends otherwise captured mouse event to handle context menu correctly in sense
  const bubbleEvent = () => {
    const newEvent = document.createEvent('MouseEvents');
    newEvent.initEvent('mousedown', true, false);
    element.dispatchEvent(newEvent);
  };

  const zoomed = () => {
    setTransform({ zoom: event.transform.k / scaleFactor, x: event.transform.x, y: event.transform.y });
    bubbleEvent();
    applyTransform(
      zoomIdentity.translate(event.transform.x, event.transform.y).scale(event.transform.k / scaleFactor),
      svg,
      divBox,
      width,
      height
    );
  };

  select(zoomWrapper).call(
    zoom()
      .extent([
        [0, 0],
        [width, height],
      ])
      .filter(
        () =>
          !selectionsAndTransform.constraints.active &&
          event.type !== 'dblclick' &&
          !(event.type === 'mousedown' && event.which === 3)
      )
      .scaleExtent([minZoom * scaleFactor, maxZoom * scaleFactor])
      .on('zoom', zoomed)
      .on('end', bubbleEvent)
  );

  setTransform({ zoom: 1 / scaleFactor, x, y });
  applyTransform(zoomIdentity.translate(x, y).scale(1 / scaleFactor), svg, divBox, width, height);
}

export const snapshotZoom = (objectData, rect, viewState) => {
  const { svg, divBox } = objectData;
  const snapZoom =
    rect.width / viewState.size.width > rect.height / viewState.size.height
      ? rect.height / viewState.size.height
      : rect.width / viewState.size.width;
  const newX = viewState.transform.x * snapZoom;
  const newY = viewState.transform.y * snapZoom;
  const newZoom = viewState.transform.zoom * snapZoom;
  const zoomEvent = zoomIdentity.translate(newX, newY).scale(newZoom);
  applyTransform(zoomEvent, svg, divBox, rect.width, rect.height);
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
