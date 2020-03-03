import props from '../object-properties';

const defaultValues = {
  Theme: {
    getCurrent: () => ({
      properties: {
        palettes: { ui: [{ colors: ['none', 'color1', 'color2'] }] },
        dataColors: { primaryColor: 'myPrimaryColor' },
        fontFamily: 'myFont',
      },
    }),
  },
  layout: { style: props.style },
  nodes: {
    x: 0,
    y: 124,
    data: {
      id: '1',
      elemNo: 1,
      childNumber: 1,
      isLocked: false,
    },
    parent: {
      x: 1,
      y: 1,
      xActual: 1,
      data: {
        id: '0',
      },
      children: [
        {
          children: [{}],
        },
      ],
    },
    children: [
      {
        data: {
          id: '2',
          elemNo: 2,
        },
        parent: {
          data: {
            id: '1',
          },
          children: [
            {
              data: {
                id: '2',
              },
            },
          ],
        },
        children: [
          {
            data: {
              id: '3',
              elemNo: 3,
            },
            parent: {
              data: {
                id: '2',
              },
            },
            children: [
              {
                data: {
                  id: 'fake',
                  elemNo: 798,
                },
                parent: {
                  data: {
                    id: '3',
                  },
                },
              },
            ],
          },
        ],
      },
      {
        data: {
          id: '4',
          elemNo: 88,
        },
        parent: {
          data: {
            id: '1',
          },
          children: [
            {
              data: {
                id: '2',
                elemNo: 2,
              },
              children: [
                {
                  children: [{}],
                },
              ],
            },
            {
              data: {
                id: '4',
                elemNo: 88,
              },
            },
          ],
        },
        children: [],
      },
    ],
  },
};

export default defaultValues;
