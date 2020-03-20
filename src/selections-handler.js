import { useEffect, useState, useSelections, useAction } from '@nebula.js/supernova';
import autoRegister from './locale/translations';
import { chainedSelectionIcon } from './utils/svg-icons';

export default function selectionHandler(translator) {
  const [linked, setLinked] = useState(false);
  const selectionsAPI = useSelections();
  const [selectionObj] = useState({
    api: selectionsAPI,
    setState: state => {
      selectionObj.state = state;
    },
    state: [],
    linked: false,
  });

  useEffect(() => {
    autoRegister(translator);
  }, [translator]);

  const resetSelections = () => {
    selectionObj.state = [];
  };
  const resetSelectionsAndLinked = () => {
    selectionObj.state = [];
    setLinked(false);
  };

  useEffect(() => {
    if (!selectionObj.api) {
      return () => {};
    }
    selectionObj.api = selectionsAPI;
    selectionObj.api.on('deactivated', resetSelections);
    selectionObj.api.on('canceled', resetSelectionsAndLinked);
    selectionObj.api.on('confirmed', resetSelectionsAndLinked);
    selectionObj.api.on('cleared', resetSelections);
    // Return function called on unmount
    return () => {
      selectionObj.api.removeListener('deactivated', resetSelections);
      selectionObj.api.removeListener('canceled', resetSelectionsAndLinked);
      selectionObj.api.removeListener('confirmed', resetSelectionsAndLinked);
      selectionObj.api.removeListener('cleared', resetSelections);
    };
  }, [selectionsAPI]);

  useEffect(() => {
    selectionObj.linked = linked;
  }, [linked]);

  useAction(
    () => ({
      action() {
        setLinked(!linked);
      },
      icon: {
        shapes: [
          {
            type: 'path',
            attrs: {
              d:
                chainedSelectionIcon,
            },
          },
        ],
      },
      active: linked,
      label: translator.get('Object.OrgChart.IncludeDescendants'),
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

  return selectionObj;
}
