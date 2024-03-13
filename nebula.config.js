// nebula.config.js
module.exports = {
  build: {},
  serve: {
    open: false,
    flags: {
      SENSECLIENT_IM_5036_VIZBUNDLE_STYLING: true,
    },
    snapshots: [
      {
        key: "basic",
        meta: {
          size: { width: 600, height: 600 },
          language: "sv-SE",
          theme: "light",
          appLayout: { qLocaleInfo: {} },
        },
        layout: {
          qInfo: {
            qId: "1583311157530",
            qType: "sn-org-chart",
          },
          qMeta: {
            privileges: ["read", "update", "delete", "exportdata"],
          },
          qSelectionInfo: {},
          visualization: "sn-org-chart",
          showTitles: true,
          qHyperCube: {
            qSize: {
              qcx: 2,
              qcy: 16,
            },
            qDimensionInfo: [
              {
                qFallbackTitle: "Employee",
                qApprMaxGlyphCount: 4,
                qCardinal: 16,
                qSortIndicator: "A",
                qGroupFallbackTitles: ["Employee"],
                qGroupPos: 0,
                qStateCounts: {
                  qLocked: 0,
                  qSelected: 0,
                  qOption: 16,
                  qDeselected: 0,
                  qAlternative: 0,
                  qExcluded: 0,
                  qSelectedExcluded: 0,
                  qLockedExcluded: 0,
                },
                qTags: ["$ascii", "$text"],
                qDimensionType: "D",
                qGrouping: "N",
                qNumFormat: {
                  qType: "U",
                  qnDec: 0,
                  qUseThou: 0,
                },
                qIsAutoFormat: true,
                qGroupFieldDefs: ["Employee"],
                qMin: "NaN",
                qMax: "NaN",
                qAttrExprInfo: [],
                qAttrDimInfo: [],
                qCardinalities: {
                  qCardinal: 16,
                  qHypercubeCardinal: 0,
                  qAllValuesCardinal: -1,
                },
                cId: "th69np",
              },
              {
                qFallbackTitle: "Boss",
                qApprMaxGlyphCount: 3,
                qCardinal: 6,
                qSortIndicator: "A",
                qGroupFallbackTitles: ["Boss"],
                qGroupPos: 0,
                qStateCounts: {
                  qLocked: 0,
                  qSelected: 0,
                  qOption: 6,
                  qDeselected: 0,
                  qAlternative: 0,
                  qExcluded: 0,
                  qSelectedExcluded: 0,
                  qLockedExcluded: 0,
                },
                qTags: ["$ascii", "$text"],
                qDimensionType: "D",
                qGrouping: "N",
                qNumFormat: {
                  qType: "U",
                  qnDec: 0,
                  qUseThou: 0,
                },
                qIsAutoFormat: true,
                qGroupFieldDefs: ["Boss"],
                qMin: "NaN",
                qMax: "NaN",
                qAttrExprInfo: [],
                qAttrDimInfo: [],
                qCardinalities: {
                  qCardinal: 6,
                  qHypercubeCardinal: 0,
                  qAllValuesCardinal: -1,
                },
                cId: "hpu7ln",
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
                      qText: "CEO",
                      qNum: "NaN",
                      qElemNumber: 2,
                      qState: "O",
                    },
                    {
                      qText: "CO",
                      qNum: "NaN",
                      qElemNumber: 1,
                      qState: "O",
                    },
                  ],
                  [
                    {
                      qText: "CMO",
                      qNum: "NaN",
                      qElemNumber: 3,
                      qState: "O",
                    },
                    {
                      qText: "CO",
                      qNum: "NaN",
                      qElemNumber: 1,
                      qState: "O",
                    },
                  ],
                  [
                    {
                      qText: "CO",
                      qNum: "NaN",
                      qElemNumber: 0,
                      qState: "O",
                    },
                    {
                      qText: "-",
                      qNum: "NaN",
                      qElemNumber: 0,
                      qState: "O",
                    },
                  ],
                  [
                    {
                      qText: "CTO",
                      qNum: "NaN",
                      qElemNumber: 1,
                      qState: "O",
                    },
                    {
                      qText: "CO",
                      qNum: "NaN",
                      qElemNumber: 1,
                      qState: "O",
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
                  qHeight: 16,
                },
              },
            ],
            qPivotDataPages: [],
            qStackedDataPages: [],
            qMode: "S",
            qNoOfLeftDims: -1,
            qTreeNodesOnDim: [],
            qColumnOrder: [],
            qExpansionState: [],
          },
          title: "",
          subtitle: "",
          footnote: "",
          navigationMode: "free",
          style: {
            fontColor: {
              colorType: "auto",
              color: {
                index: -1,
                color: "#484848",
              },
              colorExpression: "",
            },
            backgroundColor: {
              colorType: "auto",
              color: {
                index: -1,
                color: "#e6e6e6",
              },
              colorExpression: "",
            },
          },
          snapshotData: {
            viewState: {
              expandedState: {
                topId: "CO",
                isExpanded: true,
                expandedChildren: [],
                useTransitions: false,
              },
              transform: {
                zoom: 2.222560975609756,
                x: 0,
                y: 0,
              },
              size: {
                w: 2254,
                h: 729,
              },
              initialZoom: {
                initialX: 431.07270233196164,
                initialY: 32,
                initialZoom: 0.4499314128943759,
              },
            },
            dataMatrix: [
              [
                {
                  qText: "CEO",
                  qNum: "NaN",
                  qElemNumber: 2,
                  qState: "O",
                },
                {
                  qText: "CO",
                  qNum: "NaN",
                  qElemNumber: 1,
                  qState: "O",
                },
              ],
              [
                {
                  qText: "CMO",
                  qNum: "NaN",
                  qElemNumber: 3,
                  qState: "O",
                },
                {
                  qText: "CO",
                  qNum: "NaN",
                  qElemNumber: 1,
                  qState: "O",
                },
              ],
              [
                {
                  qText: "CO",
                  qNum: "NaN",
                  qElemNumber: 0,
                  qState: "O",
                },
                {
                  qText: "-",
                  qNum: "NaN",
                  qElemNumber: 0,
                  qState: "O",
                },
              ],
              [
                {
                  qText: "CTO",
                  qNum: "NaN",
                  qElemNumber: 1,
                  qState: "O",
                },
                {
                  qText: "CO",
                  qNum: "NaN",
                  qElemNumber: 1,
                  qState: "O",
                },
              ],
            ],
          },
        },
        visualization: "sn-org-chart",
        extensionMeta: {
          translationKey: "",
          icon: "network",
          iconChar: "puzzle",
          isLibraryItem: true,
          visible: true,
          name: "Organizational Chart",
          description: "Chart to visualise organisations",
          template: "sn-org-chart",
          iconPath:
            "M14.5,9 L13,9 L13,3.3 C13,3.1 12.9,3 12.7,3 L8,3 L8,1.5 C8,0.7 7.3,0 6.5,0 C5.7,0 5,0.7 5,1.5 L5,3 L0.3,3 C0.1,3 0,3.1 0,3.3 L0,9 L1.5,9 C2.3,9 3,9.7 3,10.5 C3,11.3 2.3,12 1.5,12 L0,12 L0,15.7 C0,15.9 0.1,16 0.3,16 L5,16 L5,14.5 C5,13.7 5.7,13 6.5,13 C7.3,13 8,13.7 8,14.5 L8,16 L12.7,16 C12.9,16 13,15.9 13,15.7 L13,12 L14.5,12 C15.3,12 16,11.3 16,10.5 C16,9.7 15.3,9 14.5,9 Z",
          isThirdParty: true,
          preview: "preview.png",
          author: "QlikTech International AB",
          supernova: true,
          type: "visualization",
          previewIconURL: "http://localhost:8080/extensions/sn-org-chart/preview.png",
        },
      },
    ],
  },
};
