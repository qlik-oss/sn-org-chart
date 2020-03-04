import {
  useStaleLayout,
  useEffect,
  useElement,
  useModel,
  useState,
  usePromise,
  useTheme,
  useRect,
  useOptions,
  useConstraints,
  useTranslator,
} from '@nebula.js/supernova';
import properties from './object-properties';
import data from './data';
import ext from './extension/ext';
import snapshot from './snapshot';
import selectionHandler from './selections-handler';
import { paintTree, preRenderTree } from './tree/render';
import stylingUtils from './utils/styling';
import treeTransform from './utils/tree-utils';
import viewStateUtil from './utils/viewstate-utils';
import { getSnapshotZoom, applyTransform } from './tree/transform';
import autoRegister from './locale/translations';
import './styles/tooltip.less';
import './styles/paths.less';
import './styles/warnings.less';
import './styles/nodes.less';

export default function supernova(env) {
  return {
    qae: {
      properties,
      data,
    },
    component: () => {
      const layout = useStaleLayout();
      const model = useModel();
      const element = useElement();
      const Theme = useTheme();
      const options = useOptions();
      const rect = useRect();
      const constraints = useConstraints();
      const translator = useTranslator();
      const [preRenderData, setPreRenderData] = useState(null);
      const [styling, setStyling] = useState(null);
      const [expandedState, setExpandedState] = useState(null);
      const [transform, setTransform] = useState(null);
      const [initialZoom, setInitialZoom] = useState(null);
      const [storageState] = useState({
        transform: {},
        constraints,
      });
      const selectionObj = selectionHandler(translator);

      useEffect(() => {
        autoRegister(translator);
      }, [translator.language()]);

      useEffect(() => {
        storageState.transform = transform;
      }, [transform]);

      useEffect(() => {
        storageState.constraints = constraints;
      }, [constraints]);

      const setExpandedCallback = newExpandedState => {
        newExpandedState.useTransitions = true;
        setExpandedState(newExpandedState);
      };

      // Get and transform the data into a tree structure, get styling, reset active selections
      const [dataTree] = usePromise(() => {
        if (!layout) {
          return Promise.resolve();
        }
        const viewState = viewStateUtil.getViewState(options, layout);
        viewState && viewState.expandedState && setExpandedState(viewState.expandedState);
        viewState && viewState.transform && setTransform(viewState.transform);

        return treeTransform({ layout, model, translator }).then(transformed => {
          setStyling(stylingUtils.cardStyling({ Theme, layout }));
          selectionObj.setState([]);
          // Resolving the promise to indicate readiness for printing
          return transformed;
        });
      }, [layout, model, translator.language(), Theme.name()]);

      // Create d3 elements, calculate initial zoom and sets expandedState
      useEffect(() => {
        if (element && dataTree) {
          const viewState = viewStateUtil.getViewState(options, layout);
          const preRender = preRenderTree({
            element,
            dataTree,
            expandedState,
            viewState,
            storageState,
            selectionObj,
            setInitialZoom,
            setTransform,
            setExpandedState,
          });
          if (preRender) {
            setPreRenderData(preRender);
          }
        }
      }, [element, dataTree, constraints]);

      // Updates snapshot when resizing
      useEffect(() => {
        if (preRenderData && layout && layout.snapshotData) {
          const snapshotZoom = getSnapshotZoom(rect, layout.snapshotData.viewState);
          applyTransform(snapshotZoom, preRenderData.svg, preRenderData.divBox, rect.width, rect.height);
        }
      }, [rect, preRenderData]);

      // Call paintTree, currenly repaints all current nodes
      useEffect(() => {
        if (preRenderData && expandedState && styling) {
          paintTree({
            preRenderData,
            expandedState,
            styling,
            setExpandedCallback,
            storageState,
            selectionObj,
            useTransitions: expandedState.useTransitions,
            element,
          });
        }
      }, [expandedState, preRenderData, selectionObj.state]);

      snapshot(expandedState, preRenderData, layout, transform, initialZoom);
    },
    ext: ext(env),
  };
}
