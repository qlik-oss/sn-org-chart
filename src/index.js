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
import stylingUtils from './utils/styling';
import treeTransform from './utils/tree-utils';

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
      // const [objectSize, setObjectSize] = useState(null);
      const layout = useStaleLayout();
      const model = useModel();
      const element = useElement();
      const rect = useRect()[0];
      const Theme = useTheme();

      const setActiveCallback = id => {
        setActiveNode(id);
      };

      const callPreRender = () => {
        if (element && dataTree) {
          const preRender = preRenderTree(element, dataTree);
          if (preRender) {
            const newActiveNode = preRender.allNodes.data.id;
            setObjectData(preRender);
            !activeNode && setActiveNode(newActiveNode);
            paintTree({
              objectData: preRender,
              activeNode: activeNode || newActiveNode,
              styling,
              setActiveCallback,
            });
          }
        }
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
            setStyling(stylingUtils.cardStyling({ Theme, layout }));
          });
        }
        return Promise.resolve();
      }, [layout, model]);

      // This one can split up. Only need to get new height/width when rect is changed
      useEffect(callPreRender, [element, dataTree, rect.width, rect.height]);
      useEffect(() => {
        if (objectData && activeNode && styling) {
          paintTree({ objectData, activeNode, styling, setActiveCallback });
        }
      }, [activeNode]);
    },
    ext: ext(env),
  };
}
