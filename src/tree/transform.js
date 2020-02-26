import { select, zoom, event, zoomIdentity } from 'd3';
import constants from './size-constants';
import { closeTooltip } from './tooltip';

export const getBBoxOfNodes = nodes => {
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

export const getInitialZoomState = (bBox, element) => {
  const { widthMargin, cardHeight, minZoom, maxZoom } = constants;
  const { width, height } = bBox;
  const { clientHeight, clientWidth } = element;
  const calcWidth = width + 2 * widthMargin;
  const calcHeight = height + cardHeight;
  const xZoom = Math.max(Math.min(calcWidth / clientWidth, maxZoom), minZoom);
  const yZoom = Math.max(Math.min(calcHeight / clientHeight, maxZoom), minZoom);
  if (xZoom > yZoom) {
    // Zooming for x direction
    return {
      initialX: -bBox.x + widthMargin,
      initialY: -bBox.y + (clientHeight * xZoom - height) / 2,
      initialZoom: xZoom,
    };
  }
  // Zooming for y direction
  return {
    initialX: -bBox.x + (clientWidth * yZoom - width) / 2,
    initialY: cardHeight / 2,
    initialZoom: yZoom,
  };
};

export const getTranslations = (bBox, height, width) => {
  const scaleToWidth = bBox.width / width > bBox.height / height;
  const scaleFactor = scaleToWidth ? bBox.width / width : bBox.height / height;
  const translations = { scaleFactor };
  if (scaleToWidth) {
    const yTrans = -bBox.y + (height * scaleFactor - bBox.height) / 2;
    translations.divTranslation = `${-bBox.x}px, ${yTrans}px`;
    translations.svgTranslation = `${-bBox.x} ${yTrans}`;
  } else {
    const xTrans = -bBox.x + (width * scaleFactor - bBox.width) / 2;
    translations.divTranslation = `${xTrans}px, ${-bBox.y}px`;
    translations.svgTranslation = `${xTrans} ${-bBox.y}`;
  }

  return translations;
};

export const applyTransform = (eventTransform, svg, divBox, width, height) => {
  const scaleFactor = eventTransform.k;
  const translation = `${eventTransform.x}px, ${eventTransform.y}px`;

  svg.attr('transform', eventTransform);
  divBox.classed('org-disable-transition', true);
  svg.classed('org-disable-transition', true);

  divBox.attr(
    'style',
    `width:${width}px;height:${height}px; transform: translate(${translation}) scale(${scaleFactor})`
  );
};

export function setZooming({ objectData, setTransform, transformState, selectionsAndTransform, initialZoomState }) {
  const { svg, divBox, width, height, zoomWrapper, element, tooltip } = objectData;
  const { x = 0, y = 0 } = transformState;
  const { minZoom, maxZoom } = constants;
  const zoomFactor = (transformState && 1 / transformState.zoom) || initialZoomState.initialZoom;
  const scaleFactor = Math.max(Math.min(maxZoom, zoomFactor), minZoom);
  const touchmode = document.getElementsByTagName('html')[0].classList.contains('touch-on');
  let touchStarted;

  // sends otherwise captured mouse event to handle context menu correctly in sense
  const bubbleMouseEvent = () => {
    const mouseEvent = document.createEvent('MouseEvents');
    mouseEvent.initEvent('mousedown', true, false);
    element.dispatchEvent(mouseEvent);
  };

  const bubbleTouchEvent = () => {
    const touchEvent = new TouchEvent(event.sourceEvent.type, event.sourceEvent);
    element.dispatchEvent(touchEvent);
  };

  const zoomed = () => {
    setTransform({ zoom: event.transform.k / scaleFactor, x: event.transform.x, y: event.transform.y });
    closeTooltip(tooltip);
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
      .on('start', () => {
        if (touchmode && !touchStarted) {
          touchStarted = true;
          bubbleTouchEvent();
        } else if (!touchmode) {
          bubbleMouseEvent();
        }
      })
      .on('zoom', () => {
        zoomed();
        touchmode && bubbleTouchEvent();
      })
      .on('end', () => {
        if (touchmode) {
          touchStarted = false;
          bubbleTouchEvent();
        }
      })
  );

  setTransform({ zoom: 1 / scaleFactor, x, y });
  applyTransform(zoomIdentity.translate(x, y).scale(1 / scaleFactor), svg, divBox, width, height);
}

export const getSnapshotZoom = (rect, viewState) => {
  const { size } = viewState;
  const snapZoom = rect.width / size.w > rect.height / size.h ? rect.height / size.h : rect.width / size.w;
  const newX = viewState.transform.x * snapZoom;
  const newY = viewState.transform.y * snapZoom;
  const newZoom = viewState.transform.zoom * snapZoom;
  return zoomIdentity.translate(newX, newY).scale(newZoom);
};

export default function transform(nodes, width, height, svg, divBox, useTransitions) {
  // Zooming and positioning of the tree
  const bBox = getBBoxOfNodes(nodes);
  const { divTranslation, svgTranslation, scaleFactor } = getTranslations(bBox, height, width);
  const isIE11 = !!window.MSInputMethodContext && !!document.documentMode;
  if (isIE11) {
    // Transition using d3 + svg transform, for IE11
    svg.attr('transform', `scale(${1 / scaleFactor}) translate(${svgTranslation})`);
    divBox.classed('org-disable-transition', true);
    svg.classed('org-disable-transition', true);
  } else {
    // Transition using css, does not work in IE11
    svg.attr('style', `transform: scale(${1 / scaleFactor}) translate(${divTranslation});`);
    divBox.classed('org-disable-transition', !useTransitions);
    svg.classed('org-disable-transition', !useTransitions);
  }

  divBox.attr(
    'style',
    `width:${width}px;height:${height}px;
      transform: scale(${1 / scaleFactor}) translate(${divTranslation});`
  );
}
