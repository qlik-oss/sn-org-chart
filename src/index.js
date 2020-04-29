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
import { paintTree, createContainer } from './tree/render';
import stylingUtils from './utils/styling';
import treeTransform from './utils/tree-utils';
import viewStateUtil from './utils/viewstate-utils';
import { getSnapshotZoom, applyTransform } from './tree/transform';
import autoRegister from './locale/translations';
import './styles/tooltip.less';
import './styles/paths.less';
import './styles/warnings.less';
import './styles/nodes.less';
import './styles/home-button.less';

export default function supernova(env) {
  return {
    qae: {
      properties,
      data: data(env),
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
      const [containerData, setContainerData] = useState(null);
      const [styling, setStyling] = useState(null);
      const [expandedState, setExpandedState] = useState(null);
      const [transform, setTransform] = useState(null);
      const [initialZoom, setInitialZoom] = useState(null);
      const [wrapperState] = useState({
        transform: {},
        constraints,
        expandedState,
      });
      const selectionObj = selectionHandler(translator);

      useEffect(() => {
        autoRegister(translator);
      }, [translator.language()]);

      useEffect(() => {
        wrapperState.constraints = constraints;
      }, [constraints]);

      useEffect(() => {
        wrapperState.transform = transform;
      }, [transform]);

      useEffect(() => {
        wrapperState.expandedState = expandedState;
      }, [expandedState]);

      const setExpandedCallback = (newExpandedState) => {
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

        return treeTransform({ layout, model, translator }).then((transformed) => {
          setStyling(stylingUtils.cardStyling({ Theme, layout }));
          selectionObj.setState([]);
          // Resolving the promise to indicate readiness for printing
          return transformed;
        });
      }, [layout, model, translator.language(), Theme.name()]);

      // Create d3 elements, calculate initial zoom and sets expandedState
      const fullReload = () => {
        if (element && dataTree) {
          const viewState = viewStateUtil.getViewState(options, layout);
          createContainer({
            element,
            dataTree,
            viewState,
            wrapperState,
            selectionObj,
            setInitialZoom,
            setTransform,
            setExpandedState,
            setContainerData,
            layout,
          });
        }
      };

      // Call paintTree, currenly repaints all current nodes
      const rePaint = () => {
        if (containerData && expandedState && styling) {
          paintTree({
            containerData,
            styling,
            setExpandedCallback,
            wrapperState,
            selectionObj,
            useTransitions: expandedState.useTransitions,
            element,
          });
        }
      };

      useEffect(() => {
        rePaint();
      }, [containerData, selectionObj.state]);

      useEffect(() => {
        fullReload();
      }, [element, dataTree, constraints]);

      useEffect(() => {
        if (layout.resizeOnExpand) {
          fullReload();
        } else {
          rePaint();
        }
      }, [expandedState]);

      // Updates snapshot when resizing
      useEffect(() => {
        if (containerData && layout && layout.snapshotData) {
          const snapshotZoom = getSnapshotZoom(rect, layout.snapshotData.viewState);
          applyTransform(snapshotZoom, containerData.svg, containerData.divBox, rect.width, rect.height);
        }
      }, [rect, containerData]);

      snapshot(expandedState, containerData, layout, transform, initialZoom);
    },
    ext: ext(),
  };
}
