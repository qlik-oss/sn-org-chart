import {
  useStaleLayout,
  useEffect,
  useElement,
  useModel,
  useRect,
  useState,
  usePromise,
  useTheme,
  useSelections,
  useAction,
} from '@nebula.js/supernova';
import properties from './object-properties';
import data from './data';
import ext from './extension/ext';
import { paintTree, preRenderTree } from './tree/render';
import stylingUtils from './utils/styling';
import treeTransform from './utils/tree-utils';
import { selectionState } from './utils/selections';

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
      const [activeNode, setActiveNode] = useState(null);
      const [linked, setLinked] = useState(false);
      // const [objectSize, setObjectSize] = useState(null);
      const layout = useStaleLayout();
      const model = useModel();
      const element = useElement();
      const rect = useRect()[0];
      const Theme = useTheme();
      const selectionsAPI = useSelections();

      useAction(
        () => ({
          action() {
            setLinked(!linked);
          },
          icon: {
            d:
              'M7.5,1 L7.5,5 L4.999,5 L4.999,7.395 L6,7.395 L6,6 L12,6 L12,10 L6,10 L6,8.395 L4.999,8.395 L5,12.4 C5,12.4414214 5.02518398,12.4769607 5.06107549,12.4921415 L5.1,12.5 L9,12.499 L9,11 L15,11 L15,15 L9,15 L9,13.5 L5.1,13.5 C4.53298766,13.5 4.06617613,13.0709893 4.00645465,12.5198571 L4,12.4 L3.999,5 L1.5,5 L1.5,1 L7.5,1 Z M14,12 L10,12 L10,14 L14,14 L14,12 Z M11,7 L7,7 L7,9 L11,9 L11,7 Z M6.5,2 L2.5,2 L2.5,4 L6.5,4 L6.5,2 Z',
          },
        }),
        [linked]
      );

      useEffect(() => {
        const addKeyPress = event => {
          if (event.key === 'Shift' && selectionsAPI.isActive()) {
            setLinked(true);
          }
        };

        const removeKeyPress = event => {
          if (event.key === 'Shift' && selectionsAPI.isActive()) {
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

      const setActiveCallback = id => {
        setActiveNode(id);
      };

      /*
       * Basic steps to aim for - function [dependency]
       * - createElements [element]
       * - resolveData [layout, model] > dataStruct, styling
       * - generateTree [dataStruct] -> allNodes, positioning
       * - render [allNodes, positioning, styling, rect]
       */

      useEffect(() => {
        selectionState.linked = linked;
      }, [linked]);

      usePromise(() => {
        // Get and transform the data into a tree structure
        if (layout && model) {
          return treeTransform({ layout, model }).then(transformed => {
            setDataTree(transformed);
            setStyling(stylingUtils.cardStyling({ Theme, layout }));
          });
        }
        return Promise.resolve();
      }, [layout, model]);

      // This one can split up. Only need to get new height/width when rect is changed
      useEffect(() => {
        if (element && dataTree) {
          const preRender = preRenderTree(element, dataTree);
          if (preRender) {
            setObjectData(preRender);
            !activeNode && setActiveNode(preRender.allNodes.data.id);
          }
        }
      }, [element, dataTree, rect]);

      useEffect(() => {
        if (objectData && activeNode && styling) {
          paintTree({ objectData, activeNode, styling, setActiveCallback, selectionsAPI, linked });
        }
      }, [activeNode, objectData, selectionsAPI.selectionState]);
    },
    ext: ext(env),
  };
}
