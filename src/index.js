import properties from './object-properties';
import data from './data';
import ext from './ext';
import renderTree from './tree/render';

export default function supernova(env) {
  const { Theme } = env;
  return {
    qae: {
      properties,
      data,
    },
    // This does not work yet.
    selectionToolbar: {
      items: [
        {
          key: 'linked',
          label: 'Linked',
          icon: 'link',
          activated: false,
          action() {
            this.activated = !this.activated;
          },
          enabled() {
            return true;
          },
          active() {
            return this.activated;
          },
        },
      ],
    },
    component: {
      mounted(element) {
        this.element = element;
      },
      render({ layout }) {
        renderTree({
          element: this.element,
          layout,
          model: this.model,
          Theme,
          selectionsAPI: this.selections,
        });
      },
      resize() {},
      willUnmount() {},
      destroy() {},
    },
    ext: ext(env),
  };
}
