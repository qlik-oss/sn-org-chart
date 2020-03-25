import { useEffect, useState, useSelections, useAction } from '@nebula.js/supernova';
import autoRegister from './locale/translations';
import { singleSelectionIcon } from './utils/svg-icons';

export default function selectionHandler(translator) {
  const [singleSelect, setSingleSelect] = useState(false);
  const selectionsAPI = useSelections();
  const [selectionObj] = useState({
    api: selectionsAPI,
    setState: state => {
      selectionObj.state = state;
    },
    state: [],
    singleSelect: false,
  });

  useEffect(() => {
    autoRegister(translator);
  }, [translator]);

  const resetSelections = () => {
    selectionObj.state = [];
  };
  const resetSelectionsAndSingleSelect = () => {
    selectionObj.state = [];
    setSingleSelect(false);
  };

  useEffect(() => {
    if (!selectionObj.api) {
      return () => {};
    }
    selectionObj.api = selectionsAPI;
    selectionObj.api.on('deactivated', resetSelections);
    selectionObj.api.on('canceled', resetSelectionsAndSingleSelect);
    selectionObj.api.on('confirmed', resetSelectionsAndSingleSelect);
    selectionObj.api.on('cleared', resetSelections);
    // Return function called on unmount
    return () => {
      selectionObj.api.removeListener('deactivated', resetSelections);
      selectionObj.api.removeListener('canceled', resetSelectionsAndSingleSelect);
      selectionObj.api.removeListener('confirmed', resetSelectionsAndSingleSelect);
      selectionObj.api.removeListener('cleared', resetSelections);
    };
  }, [selectionsAPI]);

  useEffect(() => {
    selectionObj.singleSelect = singleSelect;
  }, [singleSelect]);

  useAction(
    () => ({
      action() {
        setSingleSelect(!singleSelect);
      },
      icon: {
        shapes: [
          {
            type: 'path',
            attrs: {
              d: singleSelectionIcon,
            },
          },
        ],
      },
      active: singleSelect,
      label: translator.get('Object.OrgChart.SingleSelect'),
    }),
    [singleSelect]
  );

  useEffect(() => {
    const addKeyPress = event => {
      if (event.key === 'Shift') {
        setSingleSelect(true);
      }
    };

    const removeKeyPress = event => {
      if (event.key === 'Shift') {
        setSingleSelect(false);
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
