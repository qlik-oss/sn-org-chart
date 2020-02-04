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
import renderTree from './tree/render';
import treeTransform from './utils/tree-utils';

export default function supernova(env) {
  return {
    qae: {
      properties,
      data,
    },
    component: () => {
      //  const [focusNodes, setFocusNodes] = useState([]);
      const [dataTree, setDataTree] = useState({});
      //   const [storage, setStorage] = useState({});
      const layout = useStaleLayout();
      const model = useModel();
      const element = useElement();
      const rect = useRect();
      const Theme = useTheme();
      const [linked, setLinked] = useState(false);
      const selectionsAPI = useSelections();
      useAction(
        () => ({
          action() {
            setLinked(!linked);
          },
          icon: {
            d: 'svg path',
          },
        }),
        [linked]
      );

      useEffect(() => {
        const addKeyPress = event => {
          if (event.key === 'Shift') {
            setLinked(true);
          }
        };

        const removeKeyPress = event => {
          if (event.key === 'Shift') {
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

      const callRender = () => {
        if (element && dataTree && layout) {
          /* return */ renderTree({
            element,
            dataTree,
            layout,
            Theme,
            selectionsAPI,
            linked,
          });
        }
        // return Promise.resolve();
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
        if (layout && model) {
          return treeTransform({ layout, model }).then(transformed => {
            setDataTree(transformed);
          });
        }
        return Promise.resolve();
      }, [layout, model]);

      // Should avoid dependency on layout -> store that on dataTree instead?
      // Should move element dependency to preRender function
      useEffect(callRender, [layout, element, dataTree]);
      // Should be bundled with dataTree dependency once layout and element has been moved?
      useEffect(callRender, [rect]);
    },
    ext: ext(env),
  };
}
