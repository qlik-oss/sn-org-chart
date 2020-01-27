export default (data, cardStyling) => {
  let labelClass = 'org-text';
  if (data.attributes.subLabel || data.attributes.details) {
    labelClass += ' org-card-seperator';
  } else {
    labelClass += ' org-card-header-only';
  }
  let html = `<div class="org-text org-text-header ${labelClass}" style=${cardStyling.label}>${data.attributes.label ||
    data.id}</div>`;
  if (data.attributes.subLabel) {
    html += `<div class="org-text org-text-subtext" style=${cardStyling.subLabel}>${data.attributes.subLabel}</div>`;
  }
  if (data.attributes.details) {
    html += `<div class="org-text org-text-subtext" style=${cardStyling.details}>${data.attributes.details}</div>`;
  }
  return `<div class="org-card">${html}</div>`;
};
