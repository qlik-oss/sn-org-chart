const encodeUtils = {
  encodeTitle: (input) => {
    const encodingDiv = document.createElement('div');
    const textNode = document.createTextNode(input);
    encodingDiv.appendChild(textNode);
    return encodingDiv.innerHTML;
  },
};

export default encodeUtils;
