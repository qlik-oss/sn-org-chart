// nebula.config.js
module.exports = {
  serve: {
    snapshots: [
      {
        key: 'basic',
        meta: {
          size: { width: 600, height: 600 },
          language: 'sv-SE',
          theme: 'light',
          appLayout: { qLocaleInfo: {} },
        },
        layout: {
          qInfo: {
            qId: 'hsxfLU',
            qType: 'sn-org-chart',
          },
          qMeta: {
            privileges: ['read', 'update', 'delete', 'exportdata'],
          },
          qSelectionInfo: {},
          qHyperCube: {
            qSize: {
              qcx: 2,
              qcy: 23,
            },
            qDimensionInfo: [
              {
                qFallbackTitle: 'Node',
                qApprMaxGlyphCount: 15,
                qCardinal: 23,
                qSortIndicator: 'A',
                qGroupFallbackTitles: ['Node'],
                qGroupPos: 0,
                qStateCounts: {
                  qLocked: 0,
                  qSelected: 0,
                  qOption: 23,
                  qDeselected: 0,
                  qAlternative: 0,
                  qExcluded: 0,
                  qSelectedExcluded: 0,
                  qLockedExcluded: 0,
                },
                qTags: ['$ascii', '$text'],
                qDimensionType: 'D',
                qGrouping: 'N',
                qNumFormat: {
                  qType: 'U',
                  qnDec: 0,
                  qUseThou: 0,
                },
                qIsAutoFormat: true,
                qGroupFieldDefs: ['Node'],
                qMin: 'NaN',
                qMax: 'NaN',
                qAttrExprInfo: [],
                qAttrDimInfo: [],
                qCardinalities: {
                  qCardinal: 23,
                  qHypercubeCardinal: 0,
                  qAllValuesCardinal: -1,
                },
                autoSort: true,
                cId: 'bdqXAaJ',
                othersLabel: 'Others',
              },
              {
                qFallbackTitle: 'Parent',
                qApprMaxGlyphCount: 15,
                qCardinal: 12,
                qSortIndicator: 'A',
                qGroupFallbackTitles: ['Parent'],
                qGroupPos: 0,
                qStateCounts: {
                  qLocked: 0,
                  qSelected: 0,
                  qOption: 12,
                  qDeselected: 0,
                  qAlternative: 0,
                  qExcluded: 0,
                  qSelectedExcluded: 0,
                  qLockedExcluded: 0,
                },
                qTags: ['$ascii', '$text'],
                qDimensionType: 'D',
                qGrouping: 'N',
                qNumFormat: {
                  qType: 'U',
                  qnDec: 0,
                  qUseThou: 0,
                },
                qIsAutoFormat: true,
                qGroupFieldDefs: ['Parent'],
                qMin: 'NaN',
                qMax: 'NaN',
                qAttrExprInfo: [],
                qAttrDimInfo: [],
                qCardinalities: {
                  qCardinal: 12,
                  qHypercubeCardinal: 0,
                  qAllValuesCardinal: -1,
                },
                autoSort: true,
                cId: 'DDMfN',
                othersLabel: 'Others',
              },
            ],
            qMeasureInfo: [],
            qEffectiveInterColumnSortOrder: [0, 1],
            qGrandTotalRow: [],
            qDataPages: [
              {
                qMatrix: [
                  [
                    {
                      qText: 'Anna',
                      qNum: 'NaN',
                      qElemNumber: 16,
                      qState: 'O',
                    },
                    {
                      qText: 'Economics',
                      qNum: 'NaN',
                      qElemNumber: 8,
                      qState: 'O',
                    },
                  ],
                  [
                    {
                      qText: 'CEO',
                      qNum: 'NaN',
                      qElemNumber: 4,
                      qState: 'O',
                    },
                    {
                      qText: 'x-team',
                      qNum: 'NaN',
                      qElemNumber: 2,
                      qState: 'O',
                    },
                  ],
                  [
                    {
                      qText: 'Christoffer',
                      qNum: 'NaN',
                      qElemNumber: 22,
                      qState: 'O',
                    },
                    {
                      qText: 'Olof',
                      qNum: 'NaN',
                      qElemNumber: 11,
                      qState: 'O',
                    },
                  ],
                  [
                    {
                      qText: 'CMO',
                      qNum: 'NaN',
                      qElemNumber: 3,
                      qState: 'O',
                    },
                    {
                      qText: 'x-team',
                      qNum: 'NaN',
                      qElemNumber: 2,
                      qState: 'O',
                    },
                  ],
                  [
                    {
                      qText: 'CTO',
                      qNum: 'NaN',
                      qElemNumber: 2,
                      qState: 'O',
                    },
                    {
                      qText: 'x-team',
                      qNum: 'NaN',
                      qElemNumber: 2,
                      qState: 'O',
                    },
                  ],
                  [
                    {
                      qText: 'DEV',
                      qNum: 'NaN',
                      qElemNumber: 7,
                      qState: 'O',
                    },
                    {
                      qText: 'R&D',
                      qNum: 'NaN',
                      qElemNumber: 4,
                      qState: 'O',
                    },
                  ],
                  [
                    {
                      qText: 'Economics',
                      qNum: 'NaN',
                      qElemNumber: 14,
                      qState: 'O',
                    },
                    {
                      qText: 'CEO',
                      qNum: 'NaN',
                      qElemNumber: 7,
                      qState: 'O',
                    },
                  ],
                  [
                    {
                      qText: 'Elsa',
                      qNum: 'NaN',
                      qElemNumber: 15,
                      qState: 'O',
                    },
                    {
                      qText: 'Economics',
                      qNum: 'NaN',
                      qElemNumber: 8,
                      qState: 'O',
                    },
                  ],
                  [
                    {
                      qText: 'HR',
                      qNum: 'NaN',
                      qElemNumber: 5,
                      qState: 'O',
                    },
                    {
                      qText: 'x-team',
                      qNum: 'NaN',
                      qElemNumber: 2,
                      qState: 'O',
                    },
                  ],
                  [
                    {
                      qText: 'Human Relations',
                      qNum: 'NaN',
                      qElemNumber: 18,
                      qState: 'O',
                    },
                    {
                      qText: 'HR',
                      qNum: 'NaN',
                      qElemNumber: 9,
                      qState: 'O',
                    },
                  ],
                  [
                    {
                      qText: 'MARKETING',
                      qNum: 'NaN',
                      qElemNumber: 10,
                      qState: 'O',
                    },
                    {
                      qText: 'CMO',
                      qNum: 'NaN',
                      qElemNumber: 5,
                      qState: 'O',
                    },
                  ],
                  [
                    {
                      qText: 'Maui',
                      qNum: 'NaN',
                      qElemNumber: 20,
                      qState: 'O',
                    },
                    {
                      qText: 'Human Relations',
                      qNum: 'NaN',
                      qElemNumber: 10,
                      qState: 'O',
                    },
                  ],
                  [
                    {
                      qText: 'Nala',
                      qNum: 'NaN',
                      qElemNumber: 12,
                      qState: 'O',
                    },
                    {
                      qText: 'MARKETING',
                      qNum: 'NaN',
                      qElemNumber: 6,
                      qState: 'O',
                    },
                  ],
                  [
                    {
                      qText: 'Olof',
                      qNum: 'NaN',
                      qElemNumber: 17,
                      qState: 'O',
                    },
                    {
                      qText: 'Economics',
                      qNum: 'NaN',
                      qElemNumber: 8,
                      qState: 'O',
                    },
                  ],
                  [
                    {
                      qText: 'OPS',
                      qNum: 'NaN',
                      qElemNumber: 9,
                      qState: 'O',
                    },
                    {
                      qText: 'R&D',
                      qNum: 'NaN',
                      qElemNumber: 4,
                      qState: 'O',
                    },
                  ],
                  [
                    {
                      qText: 'R&D',
                      qNum: 'NaN',
                      qElemNumber: 6,
                      qState: 'O',
                    },
                    {
                      qText: 'CTO',
                      qNum: 'NaN',
                      qElemNumber: 3,
                      qState: 'O',
                    },
                  ],
                  [
                    {
                      qText: 'root',
                      qNum: 'NaN',
                      qElemNumber: 0,
                      qState: 'O',
                    },
                    {
                      qText: '-',
                      qNum: 'NaN',
                      qElemNumber: 0,
                      qState: 'O',
                    },
                  ],
                  [
                    {
                      qText: 'Scar',
                      qNum: 'NaN',
                      qElemNumber: 13,
                      qState: 'O',
                    },
                    {
                      qText: 'MARKETING',
                      qNum: 'NaN',
                      qElemNumber: 6,
                      qState: 'O',
                    },
                  ],
                  [
                    {
                      qText: 'Simba',
                      qNum: 'NaN',
                      qElemNumber: 11,
                      qState: 'O',
                    },
                    {
                      qText: 'MARKETING',
                      qNum: 'NaN',
                      qElemNumber: 6,
                      qState: 'O',
                    },
                  ],
                  [
                    {
                      qText: 'Te-ka',
                      qNum: 'NaN',
                      qElemNumber: 21,
                      qState: 'O',
                    },
                    {
                      qText: 'Human Relations',
                      qNum: 'NaN',
                      qElemNumber: 10,
                      qState: 'O',
                    },
                  ],
                  [
                    {
                      qText: 'TEST',
                      qNum: 'NaN',
                      qElemNumber: 8,
                      qState: 'O',
                    },
                    {
                      qText: 'R&D',
                      qNum: 'NaN',
                      qElemNumber: 4,
                      qState: 'O',
                    },
                  ],
                  [
                    {
                      qText: 'Vaina',
                      qNum: 'NaN',
                      qElemNumber: 19,
                      qState: 'O',
                    },
                    {
                      qText: 'Human Relations',
                      qNum: 'NaN',
                      qElemNumber: 10,
                      qState: 'O',
                    },
                  ],
                  [
                    {
                      qText: 'x-team',
                      qNum: 'NaN',
                      qElemNumber: 1,
                      qState: 'O',
                    },
                    {
                      qText: 'root',
                      qNum: 'NaN',
                      qElemNumber: 1,
                      qState: 'O',
                    },
                  ],
                ],
                qTails: [
                  {
                    qUp: 0,
                    qDown: 0,
                  },
                  {
                    qUp: 0,
                    qDown: 0,
                  },
                ],
                qArea: {
                  qLeft: 0,
                  qTop: 0,
                  qWidth: 2,
                  qHeight: 23,
                },
              },
            ],
            qPivotDataPages: [],
            qStackedDataPages: [],
            qMode: 'S',
            qNoOfLeftDims: -1,
            qTreeNodesOnDim: [],
            qColumnOrder: [],
          },
          rowLimit: 30000,
          showTitles: true,
          title: '',
          subtitle: '',
          footnote: '',
          showDetails: false,
          style: {
            backgroundColor: {
              colorType: 'auto',
              color: {
                index: -1,
                color: null,
              },
              colorExpression: '',
            },
            fontColor: {
              colorType: 'auto',
              color: {
                index: -1,
                color: null,
              },
              colorExpression: '',
            },
          },
          visualization: 'sn-org-chart',
          extensionMeta: {
            translationKey: '',
            icon: 'network',
            iconChar: 'puzzle',
            isLibraryItem: true,
            visible: true,
            name: 'Organizational Chart',
            description: 'Chart to visualise organisations',
            template: 'sn-org-chart',
            iconPath:
              'M14.5,9 L13,9 L13,3.3 C13,3.1 12.9,3 12.7,3 L8,3 L8,1.5 C8,0.7 7.3,0 6.5,0 C5.7,0 5,0.7 5,1.5 L5,3 L0.3,3 C0.1,3 0,3.1 0,3.3 L0,9 L1.5,9 C2.3,9 3,9.7 3,10.5 C3,11.3 2.3,12 1.5,12 L0,12 L0,15.7 C0,15.9 0.1,16 0.3,16 L5,16 L5,14.5 C5,13.7 5.7,13 6.5,13 C7.3,13 8,13.7 8,14.5 L8,16 L12.7,16 C12.9,16 13,15.9 13,15.7 L13,12 L14.5,12 C15.3,12 16,11.3 16,10.5 C16,9.7 15.3,9 14.5,9 Z',
            isThirdParty: true,
            preview: 'preview.png',
            author: 'QlikTech International AB',
            supernova: true,
            type: 'visualization',
            previewIconURL: 'http://localhost:8080/extensions/sn-org-chart/preview.png',
          },
        },
      },
    ],
  },
};
