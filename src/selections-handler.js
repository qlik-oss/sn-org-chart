import { useEffect, useState, useSelections, useAction } from '@nebula.js/supernova';
import autoRegister from './locale/translations';

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
                'M7.7,3 C7.86568542,3 8,3.13431458 8,3.3 L8,5.7 C8,5.86568542 7.86568542,6 7.7,6 L6,6 L6,9 L7.492,9 L7.49291992,8.3 C7.49291992,8.13431458 7.6272345,8 7.79291992,8 L12.1929199,8 C12.3586053,8 12.4929199,8.13431458 12.4929199,8.3 L12.4929199,10.7 C12.4929199,10.8656854 12.3586053,11 12.1929199,11 L7.79291992,11 C7.6272345,11 7.49291992,10.8656854 7.49291992,10.7 L7.492,10 L6,10 L6,13.7 C6,13.8420161 6.0986801,13.9609842 6.23121275,13.9920768 L6.3,14 L9.5,14 L9.5,13.3 C9.5,13.1343146 9.63431458,13 9.8,13 L14.2,13 C14.3656854,13 14.5,13.1343146 14.5,13.3 L14.5,15.7 C14.5,15.8656854 14.3656854,16 14.2,16 L9.8,16 C9.63431458,16 9.5,15.8656854 9.5,15.7 L9.5,15 L6.3,15 C5.62690296,15 5.07328475,14.4884503 5.00671175,13.8329174 L5,13.7 L5,6 L3.3,6 C3.13431458,6 3,5.86568542 3,5.7 L3,3.3 C3,3.13431458 3.13431458,3 3.3,3 L7.7,3 Z M0.5,13 C0.776142375,13 1,13.2238576 1,13.5 L1,14.4 C1,14.7313708 1.26862915,15 1.6,15 L2.5,15 C2.77614237,15 3,15.2238576 3,15.5 C3,15.7761424 2.77614237,16 2.5,16 L1,16 C0.44771525,16 0,15.5522847 0,15 L0,13.5 C0,13.2238576 0.223857625,13 0.5,13 Z M0.5,6 C0.776142375,6 1,6.22385763 1,6.5 L1,9.5 C1,9.77614237 0.776142375,10 0.5,10 C0.223857625,10 0,9.77614237 0,9.5 L0,6.5 C0,6.22385763 0.223857625,6 0.5,6 Z M15.5,6 C15.7761424,6 16,6.22385763 16,6.5 L16,9.5 C16,9.77614237 15.7761424,10 15.5,10 C15.2238576,10 15,9.77614237 15,9.5 L15,6.5 C15,6.22385763 15.2238576,6 15.5,6 Z M15,0 C15.5522847,0 16,0.44771525 16,1 L16,2.5 C16,2.77614237 15.7761424,3 15.5,3 C15.2238576,3 15,2.77614237 15,2.5 L15,1.6 C15,1.26862915 14.7313708,1 14.4,1 L13.5,1 C13.2238576,1 13,0.776142375 13,0.5 C13,0.223857625 13.2238576,0 13.5,0 L15,0 Z M2.5,2.22044605e-16 C2.77614237,2.22044605e-16 3,0.223857625 3,0.5 C3,0.776142375 2.77614237,1 2.5,1 L1.6,1 C1.26862915,1 1,1.26862915 1,1.6 L1,2.5 C1,2.77614237 0.776142375,3 0.5,3 C0.223857625,3 0,2.77614237 0,2.5 L0,1 C0,0.44771525 0.44771525,2.22044605e-16 1,2.22044605e-16 L2.5,2.22044605e-16 Z M9.5,0 C9.77614237,0 10,0.223857625 10,0.5 C10,0.776142375 9.77614237,1 9.5,1 L6.5,1 C6.22385763,1 6,0.776142375 6,0.5 C6,0.223857625 6.22385763,0 6.5,0 L9.5,0 Z',
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
