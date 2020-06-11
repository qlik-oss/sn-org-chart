const fs = require('fs');

const fileName = './assets/sn-org-chart.qext';
const content = fs.readFileSync(fileName, 'utf-8');
const parsedContent = JSON.parse(content);
parsedContent.version = process.env.npm_package_version;
fs.writeFileSync(fileName, JSON.stringify(parsedContent, null, 2));
