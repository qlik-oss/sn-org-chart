export default data => {
  return `<div class="orgCard" style="${data.bgColor ? 'background-color: ' + data.bgColor : ''}">${data.label ||
    data.id}<br/>${data.subLabel || ''}</div>`;
};
