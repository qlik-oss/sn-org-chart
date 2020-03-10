import { select, zoom, event } from 'd3';
import Touche from 'touchejs';
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

  // To keep some space at the sides use some extra margin here
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
  const scaleFactor = eventTransform.zoom;
  const translation = `${eventTransform.x}px, ${eventTransform.y}px`;

  svg.attr('transform', `translate(${eventTransform.x} ${eventTransform.y}) scale(${scaleFactor})`);
  divBox.classed('org-disable-transition', true);
  svg.classed('org-disable-transition', true);

  divBox.attr(
    'style',
    `width:${width}px;height:${height}px; transform: translate(${translation}) scale(${scaleFactor})`
  );
};

export function setZooming({
  containerData,
  setTransform,
  transformState,
  wrapperState,
  initialZoomState,
  interactions,
}) {
  const { svg, divBox, width, height, zoomWrapper, tooltip } = containerData;
  const { x = 0, y = 0 } = transformState;
  const { minZoom, maxZoom } = constants;

  // Get zoomfactor either from transformState (snapshot or export) or initialsZoomState
  const zoomFactor = (transformState && 1 / transformState.zoom) || initialZoomState.initialZoom;
  const scaleFactor = Math.max(Math.min(maxZoom, zoomFactor), minZoom);

  // Translate for touch events
  const translate = (e, data, saveState) => {
    if (!wrapperState.constraints.active) {
      closeTooltip(tooltip);
      const { deltaX, deltaY } = data.swipe;
      const newX = wrapperState.transform.x + deltaX;
      const newY = wrapperState.transform.y + deltaY;
      applyTransform({ x: newX, y: newY, zoom: wrapperState.transform.zoom }, svg, divBox, width, height);
      // Only save the state at the end of panning
      if (saveState) {
        setTransform({ x: newX, y: newY, zoom: wrapperState.transform.zoom });
      }
    }
  };

  // Zooming for touch events
  const pinchZoom = (e, data, saveState) => {
    if (!wrapperState.constraints.active) {
      closeTooltip(tooltip);

      // Compare the new zoom (data.scale) with the stored zoom state
      const oldZoom = wrapperState.transform.zoom;
      const newZoom = Math.max(Math.min(oldZoom / (1 / data.scale), maxZoom), minZoom);

      // When newZoom is equal to oldZoom we have reached the borders of zooming. We should not apply any changes anymore (the chart would keep moving around).
      if (newZoom !== oldZoom) {
        const zoomDelta = newZoom / oldZoom;
        const newX = wrapperState.transform.x * zoomDelta + (width - zoomDelta * width) / 2;
        const newY = wrapperState.transform.y * zoomDelta + (height - zoomDelta * height) / 2;
        applyTransform({ x: newX, y: newY, zoom: newZoom }, svg, divBox, width, height);

        // Only save the state at the end of zooming. In case we want to apply the zoom at the position of the touch points be aware that the end event only has one touch point!
        if (saveState) {
          setTransform({ x: newX, y: newY, zoom: newZoom });
        }
      }
    }
  };

  // D3 zooming and panning for desktop
  const desktopPanZoom = () => {
    setTransform({
      zoom: event.transform.k / scaleFactor,
      x: event.transform.x,
      y: event.transform.y,
    });
    closeTooltip(tooltip);
    applyTransform(
      {
        x: event.transform.x,
        y: event.transform.y,
        zoom: event.transform.k / scaleFactor,
      },
      svg,
      divBox,
      width,
      height
    );
  };

  // Touche on IE captures too many events
  if (!interactions.isIE) {
    Touche(zoomWrapper)
      .swipe({
        options: {
          preventDefault: false,
        },
        start: (e, data) => {
          interactions.swiping = true;
          translate(e, data, false);
        },
        update: translate,
        end: (e, data) => {
          translate(e, data, true);
          // Set swiping to false in timeout to make sure the end tap event does not start selections
          setTimeout(() => {
            interactions.swiping = false;
          });
        },
      })
      .pinch({
        start: (e, data) => {
          interactions.swiping = true;
          pinchZoom(e, data);
        },
        update: pinchZoom,
        end: (e, data) => {
          pinchZoom(e, data, true);
          // Set swiping to false in timeout to make sure the end tap event does not start selections
          setTimeout(() => {
            interactions.swiping = false;
          });
        },
      })
      .longtap({
        options: {
          preventDefault: false,
        },
        start: () => {
          interactions.swiping = true;
        },
        end: () => {
          // Set swiping to false in timeout to make sure the end tap event does not start selections
          setTimeout(() => {
            interactions.swiping = false;
          });
        },
      });
  }

  // D3 zooming
  select(zoomWrapper).call(
    zoom()
      .extent([
        [0, 0],
        [width, height],
      ])
      // Filter the events. Only analysis mode | No double click | No touch events
      .filter(
        () =>
          !wrapperState.constraints.active &&
          event.type !== 'dblclick' &&
          !(event.type === 'mousedown' && event.which === 3) &&
          event.type !== 'touchstart'
      )
      .scaleExtent([minZoom * scaleFactor, maxZoom * scaleFactor])
      .on('zoom', desktopPanZoom)
  );

  setTransform({ zoom: 1 / scaleFactor, x, y });
  applyTransform({ x, y, zoom: 1 / zoomFactor }, svg, divBox, width, height);
}

export const getSnapshotZoom = (rect, viewState) => {
  const { size } = viewState;
  const snapZoom = rect.width / size.w > rect.height / size.h ? rect.height / size.h : rect.width / size.w;
  const newX = viewState.transform.x * snapZoom;
  const newY = viewState.transform.y * snapZoom;
  const newZoom = viewState.transform.zoom * snapZoom;
  return { x: newX, y: newY, zoom: newZoom };
};

// This transform is only used in non-free zoom mode. If we do not implement other modes we should remove it.
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
