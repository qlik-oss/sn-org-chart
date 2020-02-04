import { useStaleLayout, useEffect, useElement, useModel, useRect, useState, usePromise } from '@nebula.js/supernova';
import properties from './object-properties';
import data from './data';
import ext from './ext';
import { paintTree, preRenderTree } from './tree/render';
import treeTransform from './utils/tree-utils';

export default function supernova(env) {
  const { Theme } = env;
  return {
    qae: {
      properties,
      data,
    },

    component: () => {
      const [dataTree, setDataTree] = useState({});
      const [storage, setStorage] = useState({});
      const [activeNode, setActiveNode] = useState('');
      const layout = useStaleLayout();
      const model = useModel();
      const element = useElement();
      const rect = useRect();

      const setActiveCallback = id => {
        console.log('callback');
        setActiveNode(id);
      };

      const callPreRender = () => {
        if (element && dataTree && layout) {
          const renderReturn = preRenderTree({
            element,
            dataTree,
            layout,
            Theme,
          });
          renderReturn.setActiveCallback = setActiveCallback;
          setStorage(renderReturn);
          !activeNode && setActiveNode(renderReturn.allNodes.data.id);
          console.log(renderReturn);
          paintTree(renderReturn, renderReturn.allNodes.data.id);
        }
        // Promise.resolve();
      };

      const callPaint = () => {
        paintTree(storage, activeNode);
      };

      usePromise(() => {
        // Get and transform the data into a tree structure
        if (layout && model) {
          return treeTransform({ layout, model }).then(transformed => {
            setDataTree(transformed);
          });
        }
        return Promise.resolve();
      }, [layout, model]);

      useEffect(callPreRender, [layout, element, dataTree]);

      useEffect(() => {
        // const asdf = callRender();
        // setStorage(callRender());
        // cosnsole.log('effect', asdf);
      }, [rect]);

      useEffect(callPaint, [activeNode]);
    },
    ext: ext(env),
  };
}
