export default function migrateStyle(properties) {
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

    if (!properties.components || properties.components.length == 0) {
        Object.assign(dataTemplateLabel.label.value, properties.style?.fontColor);
        Object.assign(dataTemplateBackground.backgroundColor, properties.style?.backgroundColor);
        Object.assign(dataTemplateBorder.border, properties.style?.border);
        const labelComponent = { key: "label", ... dataTemplateLabel, };
        const bgColorComponent = { key: "backgroundColor", ... dataTemplateBackground, };
        const borderComponent = { key: "border", ... dataTemplateBorder, };
        if (!properties.components) properties.components = [];
        properties.components.push(labelComponent, bgColorComponent, borderComponent);
    }
    return properties;
}