export default data => {
  return `<div class="orgCard ${data.selected ? 'selected' : ''}">${data.name}</div>`;
};
