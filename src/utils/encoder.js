const encodeUtils = {
  encodeTitle: (input) => {
    const encodingDiv = document.createElement('div');
    const textNode = document.createTextNode(input);
    encodingDiv.appendChild(textNode);
    return encodingDiv.innerHTML;
  },
  encodeCssColor: (input) => {
    const immune = ['#', ' ', '(', ')'];
    let encoded = '';
    for (let i = 0; i < input.length; i++) {
      const ch = input.charAt(i);
      const cc = input.charCodeAt(i);
      if (!ch.match(/[a-zA-Z0-9]/) && immune.indexOf(ch) < 0) {
        const hex = cc.toString(16);
        const pad = '000000'.substr(hex.length);
        encoded += `\\${pad}${hex}`;
      } else {
        encoded += ch;
      }
    }
    return encoded;
  }
};

export default encodeUtils;
