import properties from './object-properties';
import data from './data';
import ext from './ext';
import { renderTree, reRenderTree } from './tree/render';

export default function supernova(env) {
  const { Theme } = env;
  const callback = args => {
    args.storage.activeNode = args.activeNode;
    reRenderTree(args);
  };

  return {
    qae: {
      properties,
      data,
    },
    component: {
      mounted(element) {
        this.element = element;
        this.storage = {};
      },
      render({ layout }) {
        renderTree({
          element: this.element,
          layout,
          model: this.model,
          Theme,
          storage: this.storage,
          callback,
        });
      },
      resize() {},
      willUnmount() {},
      destroy() {},
    },
    ext: ext(env),
  };
}
