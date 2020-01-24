export default (data, cardStyling) => {
  let html = `<div style=${cardStyling.label}>${data.attributes.label || data.id}</div>`;
  if (data.attributes.subLabel) {
    html += `<div style=${cardStyling.subLabel}>${data.attributes.subLabel}</div>`;
  }
  if (data.attributes.details) {
    html += `<div style=${cardStyling.details}>${data.attributes.details}</div>`;
  }
  return `<div class="orgCard">${html}</div>`;
};
