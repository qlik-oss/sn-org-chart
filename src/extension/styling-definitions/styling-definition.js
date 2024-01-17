import { fontResolver as createFontResolver } from 'qlik-chart-modules';
import labelStylingDefinition from './styling-utils';

function createStylingDefinition(theme, flags, translator) {
  const fontResolver = createFontResolver({
    theme,
    translator,
    flags,
    config: {
      id: 'orgChart',
      paths: ['axis.title', 'axis.label.name', 'label.value', 'legend.title', 'legend.label'],
    },
  });

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
      axisTitleSection: {
        translation: 'properties.axis.title',
        component: 'panel-section',
        items: {
          axisTitleItems: {
            component: 'items',
            ref: 'components',
            key: 'axis',
            items: labelStylingDefinition('axis.title', fontResolver, theme),
          },
        },
      },
      axisLabelSection: {
        translation: 'properties.axis.label',
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
        translation: 'properties.value.label',
        component: 'panel-section',
        items: {
          labelItems: {
            component: 'items',
            ref: 'components',
            key: 'label',
            items: {
              ...labelStylingDefinition('label.value', fontResolver, theme),
              contrastColor: {
                component: 'checkbox',
                type: 'boolean',
                ref: 'label.value.useContrastColor',
                translation: 'properties.dataPoints.valuelabel.contrast',
                defaultValue: true,
              },
            },
          },
        },
      },
      legendTitleSection: {
        translation: 'properties.legend.title',
        component: 'panel-section',
        items: {
          legendTitleSection: {
            component: 'items',
            ref: 'components',
            key: 'legend',
            items: labelStylingDefinition('legend.title', fontResolver, theme),
          },
        },
      },
      legendLabelSection: {
        translation: 'properties.legend.label',
        component: 'panel-section',
        items: {
          legendLabelSection: {
            component: 'items',
            ref: 'components',
            key: 'legend',
            items: labelStylingDefinition('legend.label', fontResolver, theme),
          },
        },
      },
    },
  };
}

export default createStylingDefinition;
