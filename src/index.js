import {
  useStaleLayout,
  useEffect,
  useElement,
  useModel,
  useState,
  usePromise,
  useTheme,
  useSelections,
  useAction,
  onTakeSnapshot,
  useOptions,
  useImperativeHandle,
  useConstraints,
} from '@nebula.js/supernova';
import properties from './object-properties';
import data from './data';
import ext from './extension/ext';
import { paintTree, preRenderTree } from './tree/render';
import stylingUtils from './utils/styling';
import treeTransform from './utils/tree-utils';
import viewStateUtil from './utils/viewstate-utils';
import { setZooming } from './tree/transform';
import './styles/treeCss.less';
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
      const [dataTree, setDataTree] = useState(null);
      const [objectData, setObjectData] = useState(null);
      const [styling, setStyling] = useState(null);
      const [expandedState, setExpandedState] = useState(null);
      const [linked, setLinked] = useState(false);
      const [selectionState, setSelectionState] = useState([]);
      const [zoomState, setZoomState] = useState(null);
      const layout = useStaleLayout();
      const model = useModel();
      const element = useElement();
      const Theme = useTheme();
      const options = useOptions();
      const [opts] = useState(options);
      const selectionsAPI = useSelections();
      const constraints = useConstraints();
      const [selections] = useState({ api: selectionsAPI, setState: setSelectionState, linked: false, zoom: {} });

      const resetSelections = () => {
        setSelectionState([]);
      };
      useEffect(() => {
        if (!selections.api) {
          return () => {};
        }
        selections.api = selectionsAPI;
        selections.api.on('canceled', resetSelections);
        selections.api.on('cleared', resetSelections);
        // Return function called on unmount
        return () => {
          selections.api.removeListener('deactivated', resetSelections);
          selections.api.removeListener('canceled', resetSelections);
          selections.api.removeListener('cleared', resetSelections);
        };
      }, [selectionsAPI]);

      useEffect(() => {
        selections.zoom = zoomState;
      }, [zoomState]);

      useAction(
        () => ({
          action() {
            selections.linked = !linked;
            setLinked(!linked);
          },
          icon: {
            d:
              'M9.5,15 C9.77614237,15 10,15.2238576 10,15.5 C10,15.7761424 9.77614237,16 9.5,16 L6.5,16 C6.22385763,16 6,15.7761424 6,15.5 C6,15.2238576 6.22385763,15 6.5,15 L9.5,15 Z M15.5,13 C15.7761424,13 16,13.2238576 16,13.5 L16,15 C16,15.5522847 15.5522847,16 15,16 L13.5,16 C13.2238576,16 13,15.7761424 13,15.5 C13,15.2238576 13.2238576,15 13.5,15 L14.4,15 C14.7313708,15 15,14.7313708 15,14.4 L15,13.5 C15,13.2238576 15.2238576,13 15.5,13 Z M0.5,13 C0.776142375,13 1,13.2238576 1,13.5 L1,14.4 C1,14.7313708 1.26862915,15 1.6,15 L2.5,15 C2.77614237,15 3,15.2238576 3,15.5 C3,15.7761424 2.77614237,16 2.5,16 L1,16 C0.44771525,16 1.28867715e-16,15.5522847 6.123234e-17,15 L1.5308085e-16,13.5 C1.19263162e-16,13.2238576 0.223857625,13 0.5,13 Z M7.5,2.5 L7.5,5.5 L5.5,5.5 L5.5,7.5 L7,7.5 L7,6.5 L12,6.5 L12,9.5 L7,9.5 L7,8.5 L5.5,8.5 L5.5,11.2 C5.5,11.3420161 5.5986801,11.4609842 5.73121275,11.4920768 L5.8,11.5 L9,11.5 L9,10.5 L14,10.5 L14,13.5 L9,13.5 L9,12.5 L5.8,12.5 C5.12690296,12.5 4.57328475,11.9884503 4.50671175,11.3329174 L4.5,11.2 L4.5,5.5 L2.5,5.5 L2.5,2.5 L7.5,2.5 Z M0.5,6 C0.776142375,6 1,6.22385763 1,6.5 L1,9.5 C1,9.77614237 0.776142375,10 0.5,10 C0.223857625,10 0,9.77614237 0,9.5 L0,6.5 C0,6.22385763 0.223857625,6 0.5,6 Z M15.5,6 C15.7761424,6 16,6.22385763 16,6.5 L16,9.5 C16,9.77614237 15.7761424,10 15.5,10 C15.2238576,10 15,9.77614237 15,9.5 L15,6.5 C15,6.22385763 15.2238576,6 15.5,6 Z M2.5,2.48689958e-14 C2.77614237,2.48689958e-14 3,0.223857625 3,0.5 C3,0.776142375 2.77614237,1 2.5,1 L1.6,1 C1.26862915,1 1,1.26862915 1,1.6 L1,2.5 C1,2.77614237 0.776142375,3 0.5,3 C0.223857625,3 0,2.77614237 0,2.5 L0,1 C0,0.44771525 0.44771525,2.48689958e-14 1,2.48689958e-14 L2.5,2.48689958e-14 Z M15,2.48689958e-14 C15.5522847,2.48689958e-14 16,0.44771525 16,1 L16,2.5 C16,2.77614237 15.7761424,3 15.5,3 C15.2238576,3 15,2.77614237 15,2.5 L15,1.6 C15,1.26862915 14.7313708,1 14.4,1 L13.5,1 C13.2238576,1 13,0.776142375 13,0.5 C13,0.223857625 13.2238576,2.48689958e-14 13.5,2.48689958e-14 L15,2.48689958e-14 Z M9.5,2.51445413e-14 C9.77614237,2.51614501e-14 10,0.223857625 10,0.5 C10,0.776142375 9.77614237,1 9.5,1 L6.5,1 C6.22385763,1 6,0.776142375 6,0.5 C6,0.223857625 6.22385763,2.45765414e-14 6.5,2.45934502e-14 L9.5,2.51445413e-14 Z',
          },
          active: linked,
        }),
        [linked]
      );

      useEffect(() => {
        const addKeyPress = event => {
          if (event.key === 'Shift') {
            selections.linked = true;
            setLinked(true);
          }
        };

        const removeKeyPress = event => {
          if (event.key === 'Shift') {
            selections.linked = false;
            setLinked(false);
          }
        };
        document.addEventListener('keydown', addKeyPress);
        document.addEventListener('keyup', removeKeyPress);

        return () => {
          document.removeEventListener('keydown', addKeyPress);
          document.removeEventListener('keyup', removeKeyPress);
        };
      }, []);

      const setStateCallback = newState => {
        newState.useTransitions = true;
        setExpandedState(newState);
      };

      /*
       * Basic steps to aim for - function [dependency]
       * - createElements [element]
       * - resolveData [layout, model] > dataStruct, styling
       * - generateTree [dataStruct] -> allNodes, positioning
       * - render [allNodes, positioning, styling, rect]
       */

      usePromise(() => {
        // Get and transform the data into a tree structure
        if (!layout) {
          return Promise.resolve();
        }
        return treeTransform({ layout, model }).then(transformed => {
          const viewState = viewStateUtil.getViewState(opts, layout);
          const expState = viewState && viewState.expandedState ? viewState.expandedState : null;
          setDataTree(transformed);
          setStyling(stylingUtils.cardStyling({ Theme, layout }));
          setSelectionState([]);
          setExpandedState(expState);
          // Resolving the promise to indicate readiness for printing
          return Promise.resolve();
        });
      }, [layout, model]);

      // This one can split up. Only need to get new height/width when rect is changed
      useEffect(() => {
        if (element && dataTree) {
          const preRender = preRenderTree(element, dataTree);
          if (preRender) {
            setObjectData(preRender);
            !expandedState &&
              setExpandedState({
                topId: preRender.allNodes.data.id,
                isExpanded: true,
                expandedChildren: [],
                useTransitions: false,
              });
          }
        }
      }, [element, dataTree]);

      useEffect(() => {
        if (objectData && expandedState && styling) {
          paintTree({
            objectData,
            expandedState,
            styling,
            setStateCallback,
            selections,
            selectionState,
            constraints,
            useTransitions: expandedState.useTransitions,
          });
        }
      }, [expandedState, objectData, selectionState, constraints]);

      useEffect(() => {
        if (objectData && layout.navigationMode === 'free') {
          setZooming(objectData, setZoomState, !constraints.active);
        }
      }, [objectData, constraints]);

      const createViewState = () => {
        const vs = {
          expandedState,
        };
        vs.expandedState.useTransitions = false;
        return vs;
      };

      onTakeSnapshot(snapshotLayout => {
        snapshotLayout.viewState = createViewState();
      });

      useImperativeHandle(() => ({
        getViewState() {
          return createViewState();
        },
      }));
    },
    ext: ext(env),
  };
}
