import properties from './object-properties';
import data from './data';
import renderTree from './tree/render';

export default function supernova(env) {
  return {
    qae: {
      properties,
      data,
    },
    component: {
      mounted(element) {
        this.element = element;
      },
      render({ layout }) {
        renderTree({ element: this.element, layout, app: this.app, model: this.model });
      },
      resize() {},
      willUnmount() {},
      destroy() {},
    },
  };
}
