import properties from './object-properties';
import data from './data';
import ext from './ext';
import renderTree from './tree/render';

export default function supernova(env) {
  return {
    qae: {
      properties,
      data,
    },
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
        this.selections.on('deactivated', () => {
          // reset nodes
        });
        this.selections.on('cleared', () => {
          // reset nodes
        });
        this.selections.on('canceled', () => {
          // reset nodes
        });
      },
      render({ layout }) {
        renderTree({ element: this.element, layout, app: this.app, model: this.model, selectionsAPI: this.selections });
      },
      resize() {},
      willUnmount() {},
      destroy() {},
    },
    ext: ext(env),
  };
}
