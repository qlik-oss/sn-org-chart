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

const imageLocationOptions = [
  { value: 'card', translation: 'Card only' },
  { value: 'tooltip', translation: 'Tooltip only' },
  { value: 'both', translation: 'Card and tooltip' },
];

const imageAlignmentOptions = [
  { value: 'left', translation: 'Left' },
  { value: 'right', translation: 'Right' },
  { value: 'top', translation: 'Top' },
  { value: 'bottom', translation: 'Bottom' },
];

/*
const transformColorProperty = (property) => {
  return {
    colorType: property?.colorType,
    color: property?.color,
    colorExpression: property?.colorExpression?.qStringExpression?.qExpr,
  };
}

const transformBorderProperty = (property) => {
  return {
    ... transformColorProperty(property),
    top: property?.top,
    fullBorder: property?.fullBorder,
  };
}

*/


const dataTemplateLabel = {
  label: {
    value: {
      colorType: undefined,
      color: undefined,
      colorExpression: undefined,
    },
  },
};  
const dataTemplateBackground = {
  backgroundColor: {
    colorType: undefined,
    color: undefined,
    colorExpression: undefined,
  },
};
const dataTemplateBorder = {
  border: {
    top: undefined,
    fullBorder: undefined,
    colorType: undefined,
    color: undefined,
    colorExpression: undefined,
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
    return (propertyResolver.getValue(data, 'border.top') ?? DEFAULTS.BORDER_TOP) ||
      (propertyResolver.getValue(data, 'border.fullBorder') ?? DEFAULTS.BORDER_FULL);
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
                    show:(data, handler) => {
                      const clonedProperties = structuredClone(handler.properties);
                      const colorTypeStyle = clonedProperties?.style?.fontColor?.colorType;
                      const colorTypeComponent = data?.label?.value?.colorType;
                      if (colorTypeStyle && !colorTypeComponent) {
                        data.label = { ...dataTemplateLabel.label, ...data.label };
                        data.label.value = clonedProperties?.style?.fontColor;
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
                    defaultValue: () => {
                      return {
                        index: -1, 
                        color: theme.getStyle('object.orgChart', 'label.value', 'color') ?? DEFAULTS.FONT_COLOR_DARK,
                      };
                    },  
                    show:(data) => {
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
                show:(data) => {
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
            key: 'backgroundColor',
            items: {
              fontColorWrapperItem: {
                component: 'inline-wrapper',
                items: {
                  useColorExpression: {
                    ref: 'backgroundColor.colorType',
                    width: 9,
                    //type: 'string',
                    //translation: 'Object.OrgChart.BackgroundColor',
                    component: 'dropdown',
                    defaultValue: DEFAULTS.BACKGROUND_COLOR_TYPE,
                    options: colorOptions,
                    show:(data, handler) => {
                      const clonedProperties = structuredClone(handler.properties);
                      const colorTypeStyle = clonedProperties?.style?.backgroundColor?.colorType;
                      const colorTypeComponent = data?.backgroundColor?.colorType;
                      if (colorTypeStyle && !colorTypeComponent) {
                        data.backgroundColor = { ...dataTemplateBackground.backgroundColor, ...data.backgroundColor};
                        data.backgroundColor = clonedProperties?.style?.backgroundColor;
                      }
                      return true;
                    },
                  },
                  colorPicker: {
                    component: 'color-picker',
                    type: 'object',
                    ref: 'backgroundColor.color',
                    width: 3,
                    //translation: 'properties.color',
                    dualOutput: true,
                    defaultValue: DEFAULTS.BACKGROUND_COLOR,
                    show:(data) => {
                      return (propertyResolver.getValue(data, 'backgroundColor.colorType') ?? DEFAULTS.BACKGROUND_COLOR_TYPE) === 'colorPicker';
                    },  
                  },
                },
              },
              colorExpression: {
                component: 'input-field-expression',
                type: 'string',
                ref: 'backgroundColor.colorExpression',
                //translation: 'Common.Expression',
                expression: 'optional',
                defaultValue: '',
                show:(data) => {
                  return (propertyResolver.getValue(data, 'backgroundColor.colorType') ?? DEFAULTS.BACKGROUND_COLOR_TYPE) === 'byExpression';
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
            key: 'border',
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
                ref: 'border.top',
                translation: 'Object.OrgChart.TopBar',
                defaultValue: DEFAULTS.BORDER_TOP,
                show:(data, handler) => {
                  const clonedProperties = structuredClone(handler.properties);
                  const topStyle = clonedProperties?.style?.border?.colorType;
                  const topComponent = data?.border?.top || data?.border?.fullBorder || data?.border?.colorType;
                  if (topStyle && !topComponent) {
                    data.border = { ...dataTemplateBorder.border, ...data.border };
                    data.border = clonedProperties?.style?.border;
                  }
                  return true;
                },
              },
              fullBorder: {
                //type: 'boolean',
                component: 'checkbox',
                ref: 'border.fullBorder',
                translation: 'properties.border',
                defaultValue: DEFAULTS.BORDER_FULL,
              },
              fontColorWrapperItem: {
                component: 'inline-wrapper',
                items: {
                  colorType: {
                    component: 'dropdown',
                    type: 'string',
                    ref: 'border.colorType',
                    width: 9,
                    translation: 'properties.border.color',
                    defaultValue: DEFAULTS.BORDER_COLOR_TYPE,
                    options: colorOptions,
                    show:(data) => {
                      return bordersActive(data);
                    },
                  },
                  colorPicker: {
                    component: 'color-picker',
                    type: 'object',
                    ref: 'border.color',
                    width: 3,
                    translation: 'properties.color',
                    dualOutput: true,
                    defaultValue: DEFAULTS.BORDER_COLOR,
                    show:(data) => {
                      return bordersActive(data) &&
                        (propertyResolver.getValue(data, 'border.colorType') ?? DEFAULTS.BORDER_COLOR_TYPE) === 'colorPicker';
                    },  
                  },
                },
              },
              colorExpression: {
                component: 'input-field-expression',
                type: 'string',
                ref: 'border.colorExpression',
                translation: 'Common.Expression',
                expression: 'optional',
                defaultValue: '',
                show:(data) => {
                  return bordersActive(data) &&
                    (propertyResolver.getValue(data, 'border.colorType') ?? DEFAULTS.BORDER_COLOR_TYPE) === 'byExpression';
                },
             },
            },
          },
        },
      },
      imageSection: {
        component: 'panel-section',
        //translation: 'Object.OrgChart.ImageOptions',
        label: 'Image options',
        items: {
          imageItems: {
            component: 'items',
            ref: 'components',
            key: 'image',
            items: {
              topBar: {
                component: 'dropdown',
                ref: 'image.location',
                translation: 'Location',
                options: imageLocationOptions,
                defaultValue: DEFAULTS.IMAGE_LOCATION,
              },
              fullBorder: {
                component: 'dropdown',
                ref: 'image.alignment',
                translation: 'Alignment',
                options: imageAlignmentOptions,
                defaultValue: DEFAULTS.IMAGE_ALIGNMENT,
              },
            },
          },
        },
      },
    },
  };
}

export default createStylingDefinition;
