import { fontResolver as createFontResolver } from 'qlik-chart-modules';
import labelStylingDefinition from './styling-utils';
import DEFAULTS from "../../style-defaults";
import propertyResolver from "../../utils/property-resolver";


const colorOptions = [
  { value: 'auto', translation: 'Common.Auto' },
  { value: 'colorPicker', translation: 'properties.colorMode.primary' },
  { value: 'byExpression', translation: 'properties.colorMode.byExpression' },
];


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

  const bordersActive = (data) =>
    propertyResolver.getValue(data, 'style.border.top') || propertyResolver.getValue(data, 'style.border.fullBorder');

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
      /*
      cardSection: {
        translation: 'properties.card.label',
        component: 'panel-section',
        items: {
          contrastColor: {
            component: 'checkbox',
            type: 'boolean',
            ref: 'label.value.useContrastColor',
            translation: 'properties.dataPoints.valuelabel.contrast',
            defaultValue: true,
          },
        },
      },
      */
      fontColor: {
        component: 'panel-section',
        type: 'items',
        translation: 'Object.OrgChart.FontColor',
        items: {
          fontColorWrapperItem: {
            component: 'inline-wrapper',
            items: {
              useColorExpression: {
                ref: 'style.fontColor.colorType',
                width: 9,
                //type: 'string',
                //translation: 'Object.OrgChart.FontColor',
                component: 'dropdown',
                defaultValue: DEFAULTS.FONT_COLOR_TYPE,
                options: colorOptions,
                //placeholder: 'properties.colorMode.primary',
              },
              colorPicker: {
                component: 'color-picker',
                //type: 'object',
                ref: 'style.fontColor.color',
                width: 3,
                //translation: 'properties.color',
                dualOutput: true,
                defaultValue: DEFAULTS.FONT_COLOR_DARK,
                show: (data) => propertyResolver.getValue(data, 'style.fontColor.colorType') === 'colorPicker',
              },
            },
          },
          colorExpression: {
            component: 'input-field-expression',
            type: 'string',
            ref: 'style.fontColor.colorExpression',
            //translation: 'Common.Expression',
            expression: 'optional',
            defaultValue: '',
            show: (data) => propertyResolver.getValue(data, 'style.fontColor.colorType') === 'byExpression',
          },
        },
      },
      backgroundColor: {
        component: 'panel-section',
        //type: 'items',
        translation: 'Object.OrgChart.ColorLabelExpression',
        items: {
          fontColorWrapperItem: {
            component: 'inline-wrapper',
            items: {
              useColorExpression: {
                ref: 'style.backgroundColor.colorType',
                width: 9,
                //type: 'string',
                //translation: 'Object.OrgChart.BackgroundColor',
                component: 'dropdown',
                defaultValue: DEFAULTS.BACKGROUND_COLOR_TYPE,
                options: colorOptions,
              },
              colorPicker: {
                component: 'color-picker',
                type: 'object',
                ref: 'style.backgroundColor.color',
                width: 3,
                //translation: 'properties.color',
                dualOutput: true,
                defaultValue: DEFAULTS.BACKGROUND_COLOR,
                show: (data) =>
                  propertyResolver.getValue(data, 'style.backgroundColor.colorType') === 'colorPicker',
              },
            },
          },
          colorExpression: {
            component: 'input-field-expression',
            //type: 'string',
            ref: 'style.backgroundColor.colorExpression',
            //translation: 'Common.Expression',
            expression: 'optional',
            defaultValue: '',
            show: (data) =>
              propertyResolver.getValue(data, 'style.backgroundColor.colorType') === 'byExpression',
          },
        },
      },
      border: {
        component: 'panel-section',
        translation: 'Object.OrgChart.CardAppearance',
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
            ref: 'style.border.top',
            translation: 'Object.OrgChart.TopBar',
            defaultValue: DEFAULTS.BORDER_TOP,
          },
          fullBorder: {
            //type: 'boolean',
            component: 'checkbox',
            ref: 'style.border.fullBorder',
            translation: 'properties.border',
            defaultValue: DEFAULTS.BORDER_FULL,
          },
          fontColorWrapperItem: {
            component: 'inline-wrapper',
            items: {
              colorType: {
                component: 'dropdown',
                type: 'string',
                ref: 'style.border.colorType',
                width: 9,
                translation: 'properties.border.color',
                defaultValue: DEFAULTS.BORDER_COLOR_TYPE,
                options: colorOptions,
                show: (data) => bordersActive(data),
              },
              colorPicker: {
                component: 'color-picker',
                type: 'object',
                ref: 'style.border.color',
                width: 3,
                translation: 'properties.color',
                dualOutput: true,
                defaultValue: DEFAULTS.BORDER_COLOR,
                show: (data) =>
                  bordersActive(data) &&
                  propertyResolver.getValue(data, 'style.border.colorType') === 'colorPicker',
              },
            },
          },
          colorExpression: {
            component: 'input-field-expression',
            type: 'string',
            ref: 'style.border.colorExpression',
            translation: 'Common.Expression',
            expression: 'optional',
            defaultValue: '',
            show: (data) =>
              bordersActive(data) &&
              propertyResolver.getValue(data, 'style.border.colorType') === 'byExpression',
          },
        },
      },
    },
  };
}

export default createStylingDefinition;
