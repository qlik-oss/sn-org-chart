export default () => ({
  type: "sn-org-chart",
  genericObjects: [
    {
      getLayout: {
        qInfo: {
          qId: "PSymT",
          qType: "sn-org-chart",
        },
        qMeta: {
          privileges: ["read", "update", "delete"],
        },
        qSelectionInfo: {},
        qHyperCube: {
          qSize: {
            qcx: 2,
            qcy: 7,
          },
          qDimensionInfo: [
            {
              qFallbackTitle: "EmployeeId",
              qApprMaxGlyphCount: 4,
              qCardinal: 7,
              qSortIndicator: "A",
              qGroupFallbackTitles: ["EmployeeId"],
              qGroupPos: 0,
              qStateCounts: {
                qLocked: 0,
                qSelected: 0,
                qOption: 7,
                qDeselected: 0,
                qAlternative: 0,
                qExcluded: 0,
                qSelectedExcluded: 0,
                qLockedExcluded: 0,
              },
              qTags: ["$key", "$ascii", "$text"],
              qDimensionType: "D",
              qGrouping: "N",
              qNumFormat: {
                qType: "U",
                qnDec: 0,
                qUseThou: 0,
              },
              qIsAutoFormat: true,
              qGroupFieldDefs: ["EmployeeId"],
              qMin: "NaN",
              qMax: "NaN",
              qAttrExprInfo: [
                {
                  qMin: "NaN",
                  qMax: "NaN",
                  qFallbackTitle: "Name",
                  qNumFormat: {
                    qType: "U",
                    qnDec: 0,
                    qUseThou: 0,
                  },
                  qIsAutoFormat: true,
                  id: "labelExpression",
                },
                {
                  qMin: "NaN",
                  qMax: "NaN",
                  qFallbackTitle: "Title",
                  qNumFormat: {
                    qType: "U",
                    qnDec: 0,
                    qUseThou: 0,
                  },
                  qIsAutoFormat: true,
                  id: "subLabelExpression",
                },
              ],
              qAttrDimInfo: [],
              qCardinalities: {
                qCardinal: 7,
                qHypercubeCardinal: 7,
                qAllValuesCardinal: -1,
              },
              autoSort: true,
              cId: "NymqMjf",
              othersLabel: "Others",
            },
            {
              qFallbackTitle: "ManagerId",
              qApprMaxGlyphCount: 4,
              qCardinal: 3,
              qSortIndicator: "A",
              qGroupFallbackTitles: ["ManagerId"],
              qGroupPos: 0,
              qStateCounts: {
                qLocked: 0,
                qSelected: 0,
                qOption: 3,
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
              qGroupFieldDefs: ["ManagerId"],
              qMin: "NaN",
              qMax: "NaN",
              qAttrExprInfo: [],
              qAttrDimInfo: [],
              qCardinalities: {
                qCardinal: 3,
                qHypercubeCardinal: 3,
                qAllValuesCardinal: -1,
              },
              autoSort: true,
              cId: "Jjbdqhp",
              othersLabel: "Others",
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
                    qText: "A101",
                    qNum: "NaN",
                    qElemNumber: 0,
                    qState: "O",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "Mary Bell",
                          qNum: "NaN",
                        },
                        {
                          qText: "CEO",
                          qNum: "NaN",
                        },
                      ],
                    },
                  },
                  {
                    qNum: "NaN",
                    qElemNumber: 0,
                    qState: "O",
                  },
                ],
                [
                  {
                    qText: "A102",
                    qNum: "NaN",
                    qElemNumber: 1,
                    qState: "O",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "John Bialik",
                          qNum: "NaN",
                        },
                        {
                          qText: "Executive secretary",
                          qNum: "NaN",
                        },
                      ],
                    },
                  },
                  {
                    qText: "A101",
                    qNum: "NaN",
                    qElemNumber: 1,
                    qState: "O",
                  },
                ],
                [
                  {
                    qText: "I101",
                    qNum: "NaN",
                    qElemNumber: 3,
                    qState: "O",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "Wendy Sanderson",
                          qNum: "NaN",
                        },
                        {
                          qText: "CIO",
                          qNum: "NaN",
                        },
                      ],
                    },
                  },
                  {
                    qText: "A101",
                    qNum: "NaN",
                    qElemNumber: 1,
                    qState: "O",
                  },
                ],
                [
                  {
                    qText: "O101",
                    qNum: "NaN",
                    qElemNumber: 2,
                    qState: "O",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "Lee Mayer",
                          qNum: "NaN",
                        },
                        {
                          qText: "COO",
                          qNum: "NaN",
                        },
                      ],
                    },
                  },
                  {
                    qText: "A101",
                    qNum: "NaN",
                    qElemNumber: 1,
                    qState: "O",
                  },
                ],
                [
                  {
                    qText: "T101",
                    qNum: "NaN",
                    qElemNumber: 4,
                    qState: "O",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "Asim Nawrat",
                          qNum: "NaN",
                        },
                        {
                          qText: "CTO",
                          qNum: "NaN",
                        },
                      ],
                    },
                  },
                  {
                    qText: "A101",
                    qNum: "NaN",
                    qElemNumber: 1,
                    qState: "O",
                  },
                ],
                [
                  {
                    qText: "T102",
                    qNum: "NaN",
                    qElemNumber: 5,
                    qState: "O",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "Emily Diaz",
                          qNum: "NaN",
                        },
                        {
                          qText: "VP Products",
                          qNum: "NaN",
                        },
                      ],
                    },
                  },
                  {
                    qText: "T101",
                    qNum: "NaN",
                    qElemNumber: 2,
                    qState: "O",
                  },
                ],
                [
                  {
                    qText: "T103",
                    qNum: "NaN",
                    qElemNumber: 6,
                    qState: "O",
                    qAttrExps: {
                      qValues: [
                        {
                          qText: "Christine Nemic",
                          qNum: "NaN",
                        },
                        {
                          qText: "VP R & D",
                          qNum: "NaN",
                        },
                      ],
                    },
                  },
                  {
                    qText: "T101",
                    qNum: "NaN",
                    qElemNumber: 2,
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
                qHeight: 7,
              },
            },
          ],
          qPivotDataPages: [],
          qStackedDataPages: [],
          qMode: "S",
          qNoOfLeftDims: -1,
          qTreeNodesOnDim: [],
          qColumnOrder: [],
        },
        script: "",
        rowLimit: 30000,
        showTitles: true,
        title: "",
        subtitle: "",
        footnote: "",
        disableNavMenu: false,
        showDetails: true,
        showDetailsExpression: false,
        navigationMode: "free",
        resizeOnExpand: false,
        style: {
          backgroundColor: {
            colorType: "byExpression",
            color: {
              index: -1,
              color: "#ffffff",
            },
            colorExpression: "yellow",
          },
          fontColor: {
            colorType: "colorPicker",
            color: {
              index: -1,
              color: "#cb10a9",
            },
            colorExpression: "",
          },
          border: {
            top: false,
            fullBorder: true,
            colorType: "colorPicker",
            color: {
              index: -1,
              color: "#fe26e6",
            },
            colorExpression: "",
          },
        },
        visualization: "sn-org-chart",
        version: "1.1.1",
        extensionMeta: {
          translationKey: "",
          icon: "org-chart",
          iconChar: "puzzle",
          isLibraryItem: true,
          visible: true,
          name: "Org chart",
          description: "Org chart supernova",
          template: "sn-org-chart",
          iconPath:
            "M14.5,9 L13,9 L13,3.3 C13,3.1 12.9,3 12.7,3 L8,3 L8,1.5 C8,0.7 7.3,0 6.5,0 C5.7,0 5,0.7 5,1.5 L5,3 L0.3,3 C0.1,3 0,3.1 0,3.3 L0,9 L1.5,9 C2.3,9 3,9.7 3,10.5 C3,11.3 2.3,12 1.5,12 L0,12 L0,15.7 C0,15.9 0.1,16 0.3,16 L5,16 L5,14.5 C5,13.7 5.7,13 6.5,13 C7.3,13 8,13.7 8,14.5 L8,16 L12.7,16 C12.9,16 13,15.9 13,15.7 L13,12 L14.5,12 C15.3,12 16,11.3 16,10.5 C16,9.7 15.3,9 14.5,9 Z",
          isThirdParty: true,
          version: "1.1.1",
          author: "QlikTech International AB",
          preview: "assets/preview.png",
          type: "visualization",
          supernova: true,
          bundle: {
            id: "qlik-visualization-bundle",
            name: "Qlik Visualization bundle",
            description:
              "This is a set of supported objects that expands the visualization capabilities of Qlik Sense. These can be used in addition to the objects found under 'Charts'. For support conditions and limitations, see the documentation.",
          },
          installer: "QlikExtensionBundler",
          folder: "_visualization-bundle",
          previewIconURL: "https://localhost:9999/resources/_visualization-bundle/sn-org-chart/assets/preview.png",
        },
        components: [
          {
            key: "label",
            label: {
              value: {
                fontSize: "16px",
                colorType: "colorPicker",
                color: {
                  index: -1,
                  color: "#b425bd",
                  alpha: 1,
                },
                fontFamily: "EB Garamond, serif",
              },
            },
          },
          {
            key: "backgroundColor",
            backgroundColor: {
              color: {
                index: -1,
                color: "#8bebe0",
                alpha: 1,
              },
            },
          },
          {
            key: "border",
          },
          {
            key: "general",
          },
          {
            key: "axis",
            axis: {
              label: {
                name: {
                  fontSize: "18px",
                  fontFamily: "EB Garamond, serif",
                },
              },
            },
          },
        ],
      },
    },
  ],
});
