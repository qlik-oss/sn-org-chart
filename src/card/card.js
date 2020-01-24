export default (data, cardStyling) => {
  if (!data.attributes) {
    return null;
  }
  let html = `<div style=${cardStyling.label}>${data.attributes.label}</div>`;
  if (data.attributes.subLabel) {
    html += `<div style=${cardStyling.subLabel}>${data.attributes.subLabel}</div>`;
  }
  if (data.attributes.details) {
    html += `<div style=${cardStyling.details}>${data.attributes.details}</div>`;
  }
  return `<div class="orgCard">${html}</div>`;
};
