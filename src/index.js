import {
  useStaleLayout,
  useEffect,
  useElement,
  useModel,
  useRect,
  useState,
  usePromise,
  useTheme,
} from '@nebula.js/supernova';
import properties from './object-properties';
import data from './data';
import ext from './extension/ext';
import { paintTree, preRenderTree } from './tree/render';
import treeTransform from './utils/tree-utils';

export default function supernova(env) {
  return {
    qae: {
      properties,
      data,
    },
    component: () => {
      const [dataTree, setDataTree] = useState({});
      const [storage, setStorage] = useState({});
      const [activeNode, setActiveNode] = useState(undefined);
      const layout = useStaleLayout();
      const model = useModel();
      const element = useElement();
      const rect = useRect();
      const Theme = useTheme();

      const setActiveCallback = id => {
        // console.log('callback');
        setActiveNode(id);
      };

      const callPreRender = () => {
        if (element && dataTree && layout) {
          const nodeData = preRenderTree({
            element,
            dataTree,
            layout,
            Theme,
          });
          if (nodeData) {
            nodeData.setActiveCallback = setActiveCallback;
            setStorage(nodeData);
            console.log('call', activeNode);
            if (activeNode) {
              paintTree(nodeData, activeNode);
            } else {
              setActiveNode(nodeData.allNodes.data.id);
              paintTree(nodeData, nodeData.allNodes.data.id);
            }
          }
        }
        // Promise.resolve();
      };

      const callPaint = () => {
        paintTree(storage, activeNode);
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

      useEffect(callPaint, [activeNode]);
      // Should avoid dependency on layout -> store that on dataTree instead?
      // Should move element dependency to preRender function
      useEffect(callPreRender, [layout, element, dataTree]);
      // Should be bundled with dataTree dependency once layout and element has been moved?
      useEffect(callPreRender, [rect[0].width, rect[0].height]);
    },
    ext: ext(env),
  };
}
