import { fontResolver as createFontResolver } from 'qlik-chart-modules';
import labelStylingDefinition from './styling-utils';
import DEFAULTS from "../../style-defaults";
import propertyResolver from "../../utils/property-resolver";
import { color } from 'd3';


const colorOptions = [
  { value: 'auto', translation: 'Common.Auto' },
  { value: 'colorPicker', translation: 'properties.colorMode.primary' },
  { value: 'byExpression', translation: 'properties.colorMode.byExpression' },
];

const emptyTemplate = {
  colorType: undefined,
  color: undefined,
  colorExpression: undefined,
};  
const dataTemplate = {
  label: {
    value: emptyTemplate,
  },
  card: {
    backgroundColor: emptyTemplate,
    border: {
      top: undefined,
      fullBorder: undefined,
      ...emptyTemplate,
    },
  },
};

function createStylingDefinition(theme, flags, translator) {
  const fontResolver = createFontResolver({
    theme,
    translator,
    flags,
    config: {
      id: 'orgChart',
      paths: ['axis.label.name', 'label.value'],
    },
  });

  const bordersActive = (data) => {
    return (propertyResolver.getValue(data, 'card.border.top') ?? DEFAULTS.BORDER_TOP) ||
      (propertyResolver.getValue(data, 'card.border.fullBorder') ?? DEFAULTS.BORDER_FULL);
  };

  return {
    component: 'styling-panel',
    show: true,
    chartType: 'orgchart',
    translation: 'LayerStyleEditor.component.styling',
    chartTitle: 'Object.OrgChart',
    subtitle: 'LayerStyleEditor.component.styling',
    useGeneral: true,
    useBackground: true,
    items: {
      axisLabelSection: {
        //translation: 'properties.axis.label',
        label: 'Title',
        component: 'panel-section',
        items: {
          axisLabelItems: {
            component: 'items',
            ref: 'components',
            key: 'axis',
            items: labelStylingDefinition('axis.label.name', fontResolver, theme),
          },
        },
      },
      labelSection: {
        //translation: 'properties.value.label',
        label: 'Body',
        component: 'panel-section',
        items: {
          labelItems: {
            component: 'items',
            ref: 'components',
            key: 'label',
            items: labelStylingDefinition('label.value', fontResolver, theme),
          },
        },
      },
      fontColorSection: {
        component: 'panel-section',
        type: 'items',
        translation: 'Object.OrgChart.FontColor',
        items: {
          fontColorItems: {
            component: 'items',
            ref: 'components',
            key: 'label',
            items: {
              fontColorWrapperItem: {
                component: 'inline-wrapper',
                items: {
                  useColorExpression: {
                    ref: 'label.value.colorType',
                    width: 9,
                    //type: 'string',
                    //translation: 'Object.OrgChart.FontColor',
                    component: 'dropdown',
                    defaultValue: DEFAULTS.FONT_COLOR_TYPE,
                    options: colorOptions,
                    show:(data, args) => {
                      const colorTypeStyle = args?.layout?.style?.fontColor?.colorType;
                      const colorTypeComponent = data?.label?.value?.colorType;
                      if (colorTypeStyle && !colorTypeComponent) {
                        data.label = { ...dataTemplate.label, ...data.label };
                        data.label.value =  args?.layout?.style?.fontColor;
                        console.log('dataTemplate in fontocolor after merge', dataTemplate);
                      }
                      return true;
                    },
                  },
                  colorPicker: {
                    component: 'color-picker',
                    //type: 'object',
                    ref: 'label.value.color',
                    width: 3,
                    //translation: 'properties.color',
                    dualOutput: true,
                    defaultValue: (data) => {
                      //console.log('fontColor data 2 IN', data);
                      return {
                        index: -1, 
                        color: theme.getStyle('object.orgChart', 'label.value', 'color') ?? DEFAULTS.FONT_COLOR_DARK,
                      };
                    },  
                    show:(data, args) => {
                      return (propertyResolver.getValue(data, 'label.value.colorType') ?? DEFAULTS.FONT_COLOR_TYPE) === 'colorPicker';
                    }
                  },
                },
              },
              colorExpression: {
                component: 'input-field-expression',
                type: 'string',
                ref: 'label.value.colorExpression',
                //translation: 'Common.Expression',
                expression: 'optional',
                defaultValue: '',
                show:(data, args) => {
                  return (propertyResolver.getValue(data, 'label.value.colorType') ?? DEFAULTS.FONT_COLOR_TYPE) === 'byExpression';
                }
              },
            },
          },
        },
      },
      backgroundColorSection: {
        component: 'panel-section',
        //type: 'items',
        translation: 'Object.OrgChart.ColorLabelExpression',
        items: {
          backgroundColorItems: {
            component: 'items',
            ref: 'components',
            key: 'card',
            items: {
              fontColorWrapperItem: {
                component: 'inline-wrapper',
                items: {
                  useColorExpression: {
                    ref: 'card.backgroundColor.colorType',
                    width: 9,
                    //type: 'string',
                    //translation: 'Object.OrgChart.BackgroundColor',
                    component: 'dropdown',
                    defaultValue: DEFAULTS.BACKGROUND_COLOR_TYPE,
                    options: colorOptions,
                    show:(data, args) => {
                      const colorTypeStyle = args?.layout?.style?.backgroundColor?.colorType;
                      const colorTypeComponent = data?.card?.backgroundColor?.colorType;
                      if (colorTypeStyle && !colorTypeComponent) {
                        console.log('En condicion backgroundColor 1');
                        data.card = { ...dataTemplate.card, ...data.card };
                        data.card.backgroundColor = args?.layout?.style?.backgroundColor;
                      }
                      return true;
                    },
                  },
                  colorPicker: {
                    component: 'color-picker',
                    type: 'object',
                    ref: 'card.backgroundColor.color',
                    width: 3,
                    //translation: 'properties.color',
                    dualOutput: true,
                    defaultValue: DEFAULTS.BACKGROUND_COLOR,
                    show:(data, args) => {
                      return (propertyResolver.getValue(data, 'card.backgroundColor.colorType') ?? DEFAULTS.BACKGROUND_COLOR_TYPE) === 'colorPicker';
                    },  
                  },
                },
              },
              colorExpression: {
                component: 'input-field-expression',
                //type: 'string',
                ref: 'card.backgroundColor.colorExpression',
                //translation: 'Common.Expression',
                expression: 'optional',
                defaultValue: '',
                show:(data, args) => {
                  return (propertyResolver.getValue(data, 'card.backgroundColor.colorType') ?? DEFAULTS.BACKGROUND_COLOR_TYPE) === 'byExpression';
                },
              },
            },
          },
        },
      },
      cardBorderSection: {
        component: 'panel-section',
        translation: 'Object.OrgChart.CardAppearance',
        items: {
          cardBorderItems: {
            component: 'items',
            ref: 'components',
            key: 'card',
            items: {
              /*
              appearanceHeader: {
                component: 'text',
                translation: 'Object.OrgChart.CardAppearance',
                style: 'pp-nm-hcd__list-header',
              },
              */
              topBar: {
                //type: 'boolean',
                component: 'checkbox',
                ref: 'card.border.top',
                translation: 'Object.OrgChart.TopBar',
                defaultValue: DEFAULTS.BORDER_TOP,
                show:(data, args) => {
                  console.log('top data IN', data);
                  const topStyle = args?.layout?.style?.border?.top;
                  const topComponent = data?.card?.border?.top;
                  if (topStyle && !topComponent) {
                    data.card = { ...dataTemplate.card, ...data.card };
                    data.card.border= args?.layout?.style?.border;
                  }
                  console.log('top data OUT', data);
                  return true;
                },
              },
              fullBorder: {
                //type: 'boolean',
                component: 'checkbox',
                ref: 'card.border.fullBorder',
                translation: 'properties.border',
                defaultValue: DEFAULTS.BORDER_FULL,
                show:(data, args) => {
                  console.log('fullBorder data IN', data);
                  const fullBorderStyle = args?.layout?.style?.border?.fullBorder;
                  const fullBorderComponent = data?.card?.border?.fullBorder;
                  if (fullBorderStyle && !fullBorderComponent) {
                    data.card = { ...dataTemplate.card, ...data.card };
                    data.card.border= args?.layout?.style?.border;
                  }
                  console.log('fullBorder data OUT', data);
                  return true;
                },
              },
              fontColorWrapperItem: {
                component: 'inline-wrapper',
                items: {
                  colorType: {
                    component: 'dropdown',
                    type: 'string',
                    ref: 'card.border.colorType',
                    width: 9,
                    translation: 'properties.border.color',
                    defaultValue: DEFAULTS.BORDER_COLOR_TYPE,
                    options: colorOptions,
                    show:(data, args) => {
                      console.log('border coloType data IN', data);
                      const colorTypeStyle = args?.layout?.style?.border?.colorType;
                      const colorTypeComponent = data?.card?.border?.colorType;
                      if (colorTypeStyle && !colorTypeComponent) {
                        data.card = { ...dataTemplate.card, ...data.card };
                        data.card.border= args?.layout?.style?.border;
                      }
                      console.log('border coloType data OUT', data);
                      return bordersActive(data);
                    },
                  },
                  colorPicker: {
                    component: 'color-picker',
                    type: 'object',
                    ref: 'card.border.color',
                    width: 3,
                    translation: 'properties.color',
                    dualOutput: true,
                    defaultValue: DEFAULTS.BORDER_COLOR,
                    show:(data, args) => {
                      return bordersActive(data) &&
                        (propertyResolver.getValue(data, 'card.border.colorType') ?? DEFAULTS.BORDER_COLOR_TYPE) === 'colorPicker';
                    },  
                  },
                },
              },
              colorExpression: {
                component: 'input-field-expression',
                type: 'string',
                ref: 'card.border.colorExpression',
                translation: 'Common.Expression',
                expression: 'optional',
                defaultValue: '',
                show:(data, args) => {
                  return bordersActive(data) &&
                    (propertyResolver.getValue(data, 'card.border.colorType') ?? DEFAULTS.BORDER_COLOR_TYPE) === 'byExpression';
                },
             },
            },
          },
        },
      },
    },
  };
}

export default createStylingDefinition;
