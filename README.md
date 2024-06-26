> **Warning** This repository is now archived and will not be updated

> This repository was originally published to foster collaboration and engagement with developers as they customized or developed visualizations, but due to customer feedback and usage data, it is now moved back to closed source. Moving this and other projects back to closed source will support better integration with internal build and test tooling, and free up resources for investment in these and other visualizations.

# sn-org-chart

[![Maintainability](https://api.codeclimate.com/v1/badges/f9da7b608828c8a9478d/maintainability)](https://codeclimate.com/github/qlik-oss/sn-org-chart/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/f9da7b608828c8a9478d/test_coverage)](https://codeclimate.com/github/qlik-oss/sn-org-chart/test_coverage)

Organizational chart for use with Qlik's Analytics Platform.

![Org chart](./assets/preview.png)

## Installing

Install as npm package: `npm install @nebula.js/sn-org-chart`.

You can also load through the script tag directly from [https://unpkg.com](https://unpkg.com/@nebula.js/sn-org-chart).

## Usage

```js

import { embed } from '@nebula.js/stardust';
import org from '@nebula.js/sn-org-chart';

// 'app' is an enigma app model
const nuked = embed(app, {
  types: [{
    name: 'orgchart',
    load: () => Promise.resolve(org);
  }]
});

embed.render({
  element,
  type: 'orgchart',
});
```
