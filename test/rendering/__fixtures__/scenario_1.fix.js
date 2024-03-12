export default () => ({
  type: "sn-org-chart",
  genericObjects: [
    {
      getLayout: {
        qInfo: {
          qId: "ATDyUX",
          qType: "sn-org-chart",
        },
        qMeta: {
          privileges: ["read", "update", "delete", "exportdata"],
        },
        qSelectionInfo: {},
        qHyperCube: {
          qSize: {
            qcx: 2,
            qcy: 14,
          },
          qDimensionInfo: [
            {
              qFallbackTitle: "Country",
              qApprMaxGlyphCount: 7,
              qCardinal: 6,
              qSortIndicator: "A",
              qGroupFallbackTitles: ["Country"],
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
              qTags: ["$ascii", "$text", "$geoname", "$relates_CarsDataSet.Country_GeoInfo"],
              qDimensionType: "D",
              qGrouping: "N",
              qNumFormat: {
                qType: "R",
                qnDec: 14,
                qUseThou: 1,
                qFmt: "##############",
                qDec: ",",
              },
              qIsAutoFormat: true,
              qGroupFieldDefs: ["Country"],
              qMin: "NaN",
              qMax: "NaN",
              qAttrExprInfo: [],
              qAttrDimInfo: [],
              qCardinalities: {
                qCardinal: 6,
                qHypercubeCardinal: 0,
                qAllValuesCardinal: -1,
              },
              qLibraryId: "ZPkzL",
              title: "Country",
              coloring: {
                changeHash: "0.7120835032460346",
                baseColor: {
                  color: "#f93f17",
                  index: 10,
                },
                colorMapRef: "ZPkzL",
              },
              autoSort: true,
              cId: "asPdY",
              othersLabel: "Others",
            },
            {
              qFallbackTitle: "Cylinders",
              qApprMaxGlyphCount: 1,
              qCardinal: 5,
              qSortIndicator: "A",
              qGroupFallbackTitles: ["Cylinders"],
              qGroupPos: 0,
              qStateCounts: {
                qLocked: 0,
                qSelected: 0,
                qOption: 5,
                qDeselected: 0,
                qAlternative: 0,
                qExcluded: 0,
                qSelectedExcluded: 0,
                qLockedExcluded: 0,
              },
              qTags: ["$numeric", "$integer"],
              qDimensionType: "N",
              qGrouping: "N",
              qNumFormat: {
                qType: "R",
                qnDec: 14,
                qUseThou: 1,
                qFmt: "##############",
                qDec: ",",
              },
              qIsAutoFormat: true,
              qGroupFieldDefs: ["Cylinders"],
              qMin: 3,
              qMax: 8,
              qContinuousAxes: true,
              qAttrExprInfo: [],
              qAttrDimInfo: [],
              qCardinalities: {
                qCardinal: 5,
                qHypercubeCardinal: 0,
                qAllValuesCardinal: -1,
              },
              qLibraryId: "GWhjMP",
              title: "Cylinders",
              coloring: {
                changeHash: "0.3028308414152121",
                baseColor: {
                  color: "#46c646",
                  index: 2,
                },
                colorMapRef: "GWhjMP",
              },
              autoSort: true,
              cId: "uJjJmbT",
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
                    qText: "France",
                    qNum: "NaN",
                    qElemNumber: 4,
                    qState: "O",
                  },
                  {
                    qText: "4",
                    qNum: 4,
                    qElemNumber: 0,
                    qState: "O",
                  },
                ],
                [
                  {
                    qText: "France",
                    qNum: "NaN",
                    qElemNumber: 4,
                    qState: "O",
                  },
                  {
                    qText: "6",
                    qNum: 6,
                    qElemNumber: 2,
                    qState: "O",
                  },
                ],
                [
                  {
                    qText: "Germany",
                    qNum: "NaN",
                    qElemNumber: 0,
                    qState: "O",
                  },
                  {
                    qText: "4",
                    qNum: 4,
                    qElemNumber: 0,
                    qState: "O",
                  },
                ],
                [
                  {
                    qText: "Germany",
                    qNum: "NaN",
                    qElemNumber: 0,
                    qState: "O",
                  },
                  {
                    qText: "5",
                    qNum: 5,
                    qElemNumber: 3,
                    qState: "O",
                  },
                ],
                [
                  {
                    qText: "Germany",
                    qNum: "NaN",
                    qElemNumber: 0,
                    qState: "O",
                  },
                  {
                    qText: "8",
                    qNum: 8,
                    qElemNumber: 1,
                    qState: "O",
                  },
                ],
                [
                  {
                    qText: "Italy",
                    qNum: "NaN",
                    qElemNumber: 5,
                    qState: "O",
                  },
                  {
                    qText: "4",
                    qNum: 4,
                    qElemNumber: 0,
                    qState: "O",
                  },
                ],
                [
                  {
                    qText: "Japan",
                    qNum: "NaN",
                    qElemNumber: 1,
                    qState: "O",
                  },
                  {
                    qText: "3",
                    qNum: 3,
                    qElemNumber: 4,
                    qState: "O",
                  },
                ],
                [
                  {
                    qText: "Japan",
                    qNum: "NaN",
                    qElemNumber: 1,
                    qState: "O",
                  },
                  {
                    qText: "4",
                    qNum: 4,
                    qElemNumber: 0,
                    qState: "O",
                  },
                ],
                [
                  {
                    qText: "Japan",
                    qNum: "NaN",
                    qElemNumber: 1,
                    qState: "O",
                  },
                  {
                    qText: "6",
                    qNum: 6,
                    qElemNumber: 2,
                    qState: "O",
                  },
                ],
                [
                  {
                    qText: "Sweden",
                    qNum: "NaN",
                    qElemNumber: 3,
                    qState: "O",
                  },
                  {
                    qText: "4",
                    qNum: 4,
                    qElemNumber: 0,
                    qState: "O",
                  },
                ],
                [
                  {
                    qText: "Sweden",
                    qNum: "NaN",
                    qElemNumber: 3,
                    qState: "O",
                  },
                  {
                    qText: "6",
                    qNum: 6,
                    qElemNumber: 2,
                    qState: "O",
                  },
                ],
                [
                  {
                    qText: "USA",
                    qNum: "NaN",
                    qElemNumber: 2,
                    qState: "O",
                  },
                  {
                    qText: "4",
                    qNum: 4,
                    qElemNumber: 0,
                    qState: "O",
                  },
                ],
                [
                  {
                    qText: "USA",
                    qNum: "NaN",
                    qElemNumber: 2,
                    qState: "O",
                  },
                  {
                    qText: "6",
                    qNum: 6,
                    qElemNumber: 2,
                    qState: "O",
                  },
                ],
                [
                  {
                    qText: "USA",
                    qNum: "NaN",
                    qElemNumber: 2,
                    qState: "O",
                  },
                  {
                    qText: "8",
                    qNum: 8,
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
                qHeight: 14,
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
        rowLimit: 30000,
        showTitles: true,
        title: "",
        subtitle: "",
        footnote: "",
        disableNavMenu: false,
        showDetails: false,
        navigationMode: "free",
        resizeOnExpand: false,
        style: {
          backgroundColor: {
            colorType: "colorPicker",
            color: {
              index: 8,
              color: "#8a85c6",
            },
            colorExpression: "",
          },
          fontColor: {
            colorType: "auto",
            color: {
              index: -1,
              color: "#484848",
            },
            colorExpression: "",
          },
          border: {
            top: true,
            fullBorder: true,
            colorType: "colorPicker",
            color: {
              index: -1,
              color: "#737373",
            },
            colorExpression: "",
          },
        },
        components: [
          {
            key: "label",
            label: {
              value: {
                colorType: "colorPicker",
                color: {
                  index: -1,
                  color: "#f043bd",
                },
              },
            },
          },
          {
            key: "backgroundColor",
            backgroundColor: {
              colorType: "colorPicker",
              color: {
                index: 8,
                color: "#8a85c6",
                alpha: 1,
              },
              colorExpression: "",
            },
          },
          {
            key: "border",
            border: {
              top: true,
              fullBorder: true,
              colorType: "auto",
              color: {
                index: -1,
                color: "#737373",
              },
              colorExpression: "",
            },
          },
          {
            key: "general",
          },
          {
            key: "axis",
          },
          {
            key: "image",
          },
        ],
        visualization: "sn-org-chart",
        version: "0.15.0",
        extensionMeta: {
          translationKey: "",
          icon: "org-chart",
          iconChar: "puzzle",
          isLibraryItem: true,
          visible: true,
          name: "Org chart",
          description:
            "Displays the relations of an organization or similarly structured data. Starts at the top and allows for navigation through the hierarchy.",
          template: "sn-org-chart",
          iconPath:
            "M14.5,9 L13,9 L13,3.3 C13,3.1 12.9,3 12.7,3 L8,3 L8,1.5 C8,0.7 7.3,0 6.5,0 C5.7,0 5,0.7 5,1.5 L5,3 L0.3,3 C0.1,3 0,3.1 0,3.3 L0,9 L1.5,9 C2.3,9 3,9.7 3,10.5 C3,11.3 2.3,12 1.5,12 L0,12 L0,15.7 C0,15.9 0.1,16 0.3,16 L5,16 L5,14.5 C5,13.7 5.7,13 6.5,13 C7.3,13 8,13.7 8,14.5 L8,16 L12.7,16 C12.9,16 13,15.9 13,15.7 L13,12 L14.5,12 C15.3,12 16,11.3 16,10.5 C16,9.7 15.3,9 14.5,9 Z",
          isThirdParty: true,
          preview: "preview.png",
          author: "QlikTech International AB",
          supernova: true,
          type: "visualization",
          version: "0.15.0",
          bundle: {
            id: "qlik-visualization-bundle",
            name: "Qlik Visualization bundle",
            description:
              "This is a set of supported objects that expands the visualization capabilities of Qlik Sense. These can be used in addition to the objects found under 'Charts'. For support conditions and limitations, see the documentation.",
          },
          installer: "QlikExtensionBundler",
          folder: "_visualization-bundle",
          previewIconURL: "http://localhost:8080/resources/_visualization-bundle/sn-org-chart/preview.png",
        },
      },
      getHyperCubeData: [
        {
          qMatrix: [
            [
              {
                qText: "France",
                qNum: "NaN",
                qElemNumber: 4,
                qState: "O",
              },
              {
                qText: "4",
                qNum: 4,
                qElemNumber: 0,
                qState: "O",
              },
            ],
            [
              {
                qText: "France",
                qNum: "NaN",
                qElemNumber: 4,
                qState: "O",
              },
              {
                qText: "6",
                qNum: 6,
                qElemNumber: 2,
                qState: "O",
              },
            ],
            [
              {
                qText: "Germany",
                qNum: "NaN",
                qElemNumber: 0,
                qState: "O",
              },
              {
                qText: "4",
                qNum: 4,
                qElemNumber: 0,
                qState: "O",
              },
            ],
            [
              {
                qText: "Germany",
                qNum: "NaN",
                qElemNumber: 0,
                qState: "O",
              },
              {
                qText: "5",
                qNum: 5,
                qElemNumber: 3,
                qState: "O",
              },
            ],
            [
              {
                qText: "Germany",
                qNum: "NaN",
                qElemNumber: 0,
                qState: "O",
              },
              {
                qText: "8",
                qNum: 8,
                qElemNumber: 1,
                qState: "O",
              },
            ],
            [
              {
                qText: "Italy",
                qNum: "NaN",
                qElemNumber: 5,
                qState: "O",
              },
              {
                qText: "4",
                qNum: 4,
                qElemNumber: 0,
                qState: "O",
              },
            ],
            [
              {
                qText: "Japan",
                qNum: "NaN",
                qElemNumber: 1,
                qState: "O",
              },
              {
                qText: "3",
                qNum: 3,
                qElemNumber: 4,
                qState: "O",
              },
            ],
            [
              {
                qText: "Japan",
                qNum: "NaN",
                qElemNumber: 1,
                qState: "O",
              },
              {
                qText: "4",
                qNum: 4,
                qElemNumber: 0,
                qState: "O",
              },
            ],
            [
              {
                qText: "Japan",
                qNum: "NaN",
                qElemNumber: 1,
                qState: "O",
              },
              {
                qText: "6",
                qNum: 6,
                qElemNumber: 2,
                qState: "O",
              },
            ],
            [
              {
                qText: "Sweden",
                qNum: "NaN",
                qElemNumber: 3,
                qState: "O",
              },
              {
                qText: "4",
                qNum: 4,
                qElemNumber: 0,
                qState: "O",
              },
            ],
            [
              {
                qText: "Sweden",
                qNum: "NaN",
                qElemNumber: 3,
                qState: "O",
              },
              {
                qText: "6",
                qNum: 6,
                qElemNumber: 2,
                qState: "O",
              },
            ],
            [
              {
                qText: "USA",
                qNum: "NaN",
                qElemNumber: 2,
                qState: "O",
              },
              {
                qText: "4",
                qNum: 4,
                qElemNumber: 0,
                qState: "O",
              },
            ],
            [
              {
                qText: "USA",
                qNum: "NaN",
                qElemNumber: 2,
                qState: "O",
              },
              {
                qText: "6",
                qNum: 6,
                qElemNumber: 2,
                qState: "O",
              },
            ],
            [
              {
                qText: "USA",
                qNum: "NaN",
                qElemNumber: 2,
                qState: "O",
              },
              {
                qText: "8",
                qNum: 8,
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
            qHeight: 14,
          },
        },
      ],
    },
  ],
});
