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
  useTranslator,
} from '@nebula.js/supernova';
import properties from './object-properties';
import data from './data';
import ext from './extension/ext';
import { paintTree, preRenderTree } from './tree/render';
import stylingUtils from './utils/styling';
import treeTransform from './utils/tree-utils';
import viewStateUtil from './utils/viewstate-utils';
import { setZooming } from './tree/transform';
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
      const [dataTree, setDataTree] = useState(null);
      const [objectData, setObjectData] = useState(null);
      const [styling, setStyling] = useState(null);
      const [expandedState, setExpandedState] = useState(null);
      const [linked, setLinked] = useState(false);
      const [selectionState, setSelectionState] = useState([]);
      const [transform, setTransform] = useState(null);
      const layout = useStaleLayout();
      const model = useModel();
      const element = useElement();
      const Theme = useTheme();
      const options = useOptions();
      const [opts] = useState(options);
      const selectionsAPI = useSelections();
      const constraints = useConstraints();
      const [selectionsAndTransform] = useState({
        api: selectionsAPI,
        setState: setSelectionState,
        linked: false,
        transform: {},
        constraints,
      });

      const translator = useTranslator();

      const resetSelections = () => {
        setSelectionState([]);
      };
      useEffect(() => {
        if (!selectionsAndTransform.api) {
          return () => {};
        }
        selectionsAndTransform.api = selectionsAPI;
        selectionsAndTransform.api.on('canceled', resetSelections);
        selectionsAndTransform.api.on('cleared', resetSelections);
        // Return function called on unmount
        return () => {
          selectionsAndTransform.api.removeListener('deactivated', resetSelections);
          selectionsAndTransform.api.removeListener('canceled', resetSelections);
          selectionsAndTransform.api.removeListener('cleared', resetSelections);
        };
      }, [selectionsAPI]);

      useEffect(() => {
        selectionsAndTransform.transform = transform;
      }, [transform]);

      useEffect(() => {
        selectionsAndTransform.constraints = constraints;
      }, [constraints]);

      useAction(
        () => ({
          action() {
            selectionsAndTransform.linked = !linked;
            setLinked(!linked);
          },
          icon: {
            shapes: [
              {
                type: 'path',
                attrs: {
                  d:
                    'M8,3 L8,6 L6,6 L6,9 L7.492,9 L7.49291992,8 L12.4929199,8 L12.4929199,11 L7.49291992,11 L7.492,10 L6,10 L6,13.7 C6,13.8420161 6.0986801,13.9609842 6.23121275,13.9920768 L6.3,14 L9.5,14 L9.5,13 L14.5,13 L14.5,16 L9.5,16 L9.5,15 L6.3,15 C5.62690296,15 5.07328475,14.4884503 5.00671175,13.8329174 L5,13.7 L5,6 L3,6 L3,3 L8,3 Z M0.5,13 C0.776142375,13 1,13.2238576 1,13.5 L1,14.4 C1,14.7313708 1.26862915,15 1.6,15 L2.5,15 C2.77614237,15 3,15.2238576 3,15.5 C3,15.7761424 2.77614237,16 2.5,16 L1,16 C0.44771525,16 0,15.5522847 0,15 L0,13.5 C0,13.2238576 0.223857625,13 0.5,13 Z M0.5,6 C0.776142375,6 1,6.22385763 1,6.5 L1,9.5 C1,9.77614237 0.776142375,10 0.5,10 C0.223857625,10 0,9.77614237 0,9.5 L0,6.5 C0,6.22385763 0.223857625,6 0.5,6 Z M15.5,6 C15.7761424,6 16,6.22385763 16,6.5 L16,9.5 C16,9.77614237 15.7761424,10 15.5,10 C15.2238576,10 15,9.77614237 15,9.5 L15,6.5 C15,6.22385763 15.2238576,6 15.5,6 Z M2.5,0 C2.77614237,0 3,0.223857625 3,0.5 C3,0.776142375 2.77614237,1 2.5,1 L1.6,1 C1.26862915,1 1,1.26862915 1,1.6 L1,2.5 C1,2.77614237 0.776142375,3 0.5,3 C0.223857625,3 0,2.77614237 0,2.5 L0,1 C0,0.44771525 0.44771525,0 1,0 L2.5,0 Z M15,-4.4408921e-16 C15.5522847,-4.4408921e-16 16,0.44771525 16,1 L16,2.5 C16,2.77614237 15.7761424,3 15.5,3 C15.2238576,3 15,2.77614237 15,2.5 L15,1.6 C15,1.26862915 14.7313708,1 14.4,1 L13.5,1 C13.2238576,1 13,0.776142375 13,0.5 C13,0.223857625 13.2238576,-4.4408921e-16 13.5,-4.4408921e-16 L15,-4.4408921e-16 Z M9.5,-2.22044605e-16 C9.77614237,-2.22044605e-16 10,0.223857625 10,0.5 C10,0.776142375 9.77614237,1 9.5,1 L6.5,1 C6.22385763,1 6,0.776142375 6,0.5 C6,0.223857625 6.22385763,-2.22044605e-16 6.5,-2.22044605e-16 L9.5,-2.22044605e-16 Z',
                },
              },
            ],
          },
          active: linked,
        }),
        [linked]
      );

      useEffect(() => {
        const addKeyPress = event => {
          if (event.key === 'Shift') {
            selectionsAndTransform.linked = true;
            setLinked(true);
          }
        };

        const removeKeyPress = event => {
          if (event.key === 'Shift') {
            selectionsAndTransform.linked = false;
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
        const viewState = viewStateUtil.getViewState(opts, layout);
        viewState && viewState.expandedState && setExpandedState(viewState.expandedState);
        viewState && viewState.transform && setTransform(viewState.transform);

        autoRegister(translator);
        return treeTransform({ layout, model, translator }).then(transformed => {
          setDataTree(transformed);
          setStyling(stylingUtils.cardStyling({ Theme, layout }));
          setSelectionState([]);
          // Resolving the promise to indicate readiness for printing
          return Promise.resolve();
        });
      }, [layout, model, translator]);

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
            selectionsAndTransform,
            selectionState,
            useTransitions: expandedState.useTransitions,
            element,
            setExpandedState,
          });
        }
      }, [expandedState, objectData, selectionState]);

      useEffect(() => {
        if (objectData && layout.navigationMode === 'free') {
          const viewState = viewStateUtil.getViewState(opts, layout);
          setZooming({
            objectData,
            setTransform,
            transformState: (viewState && viewState.transform) || {},
            selectionsAndTransform,
          });
        }
      }, [objectData]);

      const createViewState = () => {
        const vs = {
          expandedState,
          transform,
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
