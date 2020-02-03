import { useStaleLayout, useEffect, useElement, useModel, useRect, useState, usePromise } from '@nebula.js/supernova';
import properties from './object-properties';
import data from './data';
import ext from './extension/ext';
import renderTree from './tree/render';
import treeTransform from './utils/tree-utils';

export default function supernova(env) {
  const { Theme } = env;
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

      const callRender = () => {
        if (element && dataTree && layout) {
          return renderTree({
            element,
            dataTree,
            layout,
            Theme,
          });
        }
        return Promise.resolve();
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

      usePromise(callRender, [layout, element, dataTree]);

      useEffect(callRender, [rect]);
    },
    ext: ext(env),
  };
}
