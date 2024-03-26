export default function migrateStyle(properties) {
  if (properties.components?.length > 0) return properties;

  const dataTemplateLabel = {
    key: "label",
    label: {
      value: {
        ...properties.style?.fontColor,
      },
    },
  };

  const dataTemplateBackground = {
    key: "backgroundColor",
    backgroundColor: {
      ...properties.style?.backgroundColor,
    },
  };

  const dataTemplateBorder = {
    key: "border",
    border: {
      ...properties.style?.border,
    },
  };

  properties.components = [dataTemplateLabel, dataTemplateBackground, dataTemplateBorder];

  return properties;
}
