import serve from "@nebula.js/cli-serve";
import { chromium, expect, test } from "@playwright/test";
import fs from "fs";
import path from "path";
import createNebulaRoutes from "../utils/routes";
import themes from "./themes";

const paths = {
  artifacts: path.join(__dirname, "__artifacts__"),
  fixtures: path.join(__dirname, "__fixtures__"),
};

const styles = [
  { fixture: "theming_global", styles: [[".njs-viz", "background", "#272822"]] },
  { fixture: "theming_scoped", styles: [[".njs-viz", "background", "#272822"]] },
];

test.describe("Rendering", () => {
  let s;
  let route;
  let page;

  test.beforeAll(async () => {
    s = await serve({
      entry: path.resolve(__dirname, "../../"),
      type: "sn-org-chart",
      open: false,
      build: false,
      themes,
      flags: {
        SENSECLIENT_IM_5036_VIZBUNDLE_STYLING: true,
      },
      fixturePath: "test/rendering/__fixtures__",
    });

    route = createNebulaRoutes(s.url);

    const browser = await chromium.launch();
    const context = await browser.newContext();

    page = await context.newPage();
  });

  test.afterAll(async () => {
    await s.close();
  });

  test.describe("rendering", () => {
    fs.readdirSync(paths.fixtures).forEach((file) => {
      const name = file.replace(".fix.js", "");
      const fixturePath = `./${file}`;

      test(name, async () => {
        const renderUrl = await route.renderFixture(fixturePath);

        await page.goto(renderUrl, { waitUntil: "networkidle" });

        const element = await page.waitForSelector('.njs-viz[data-render-count="1"]', {
          visible: true,
          timeout: 10000,
        });

        styles.forEach(async (style) => {
          if (style.fixture === name) {
            await page.evaluate((matrix) => {
              matrix.forEach((config) => {
                const [selector, property, value] = config;
                // eslint-disable-next-line no-undef
                const selected = document.querySelector(selector);
                if (selected) {
                  selected.style[property] = value;
                }
              });
            }, style.styles);
          }
        });

        const screenshot = await page.screenshot({ clip: await element.boundingBox() });

        expect(screenshot).toMatchSnapshot(`${name}.png`);
      });
    });
  });
});
