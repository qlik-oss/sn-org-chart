export default (data, cardStyling) => {
  let html = `<div class="org-text" style=${cardStyling.label}>${data.attributes.label || data.id}</div>`;
  if (data.attributes.subLabel) {
    html += `<div class="org-text" style=${cardStyling.subLabel}>${data.attributes.subLabel}</div>`;
  }
  if (data.attributes.details) {
    html += `<div class="org-text" style=${cardStyling.details}>${data.attributes.details}</div>`;
  }
  return `<div class="org-card">${html}</div>`;
};
