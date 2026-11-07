import { createHash } from "node:crypto";
import { expect, test, type Page } from "@playwright/test";
import { IGNORED_ERROR_SOURCES } from "./routes";

/**
 * Smoke tests for the `contour` hero variant. No production page uses it yet (TASK-003c), so it is rendered on a
 * test-only fixture page that exists only in builds made with E2E_FIXTURES=1 (see playwright.config.ts).
 */
const FIXTURE = "/e2e-fixtures/hero-contour";
const ROOT = '[data-hero-bg="contour"]';
const SIZES = [
  { name: "1440x900", width: 1440, height: 900 },
  { name: "390x844", width: 390, height: 844 },
] as const;
/** Share of canvas pixels that must carry contour lines or the sweep (lines are 1px hairlines on navy). */
const MIN_LINE_SHARE = 0.003;
const LINE_DELTA = 12;

async function openFixture(page: Page): Promise<void> {
  await page.goto(FIXTURE);
  await expect(page.locator(ROOT)).toHaveAttribute("data-ready", "");
}

const hash = async (page: Page): Promise<string> =>
  createHash("sha1")
    .update(await page.evaluate((sel) => (document.querySelector(`${sel} canvas`) as HTMLCanvasElement).toDataURL(), ROOT))
    .digest("hex");

for (const size of SIZES) {
  test.describe(`contour hero ${size.name}`, () => {
    test.use({ viewport: { width: size.width, height: size.height } });

    test("renders contour lines (not blank) with no page errors", async ({ page }) => {
      const errors: string[] = [];
      page.on("pageerror", (e) => errors.push(e.message));
      page.on("console", (m) => {
        if (m.type() === "error" && !IGNORED_ERROR_SOURCES.test(m.text() + (m.location().url ?? ""))) errors.push(m.text());
      });
      await page.emulateMedia({ reducedMotion: "reduce" });
      await openFixture(page);
      await expect(page.locator("h1")).toHaveText("Contour fixture");
      const share = await page.evaluate(
        ({ sel, delta }) => {
          const c = document.querySelector(`${sel} canvas`) as HTMLCanvasElement;
          const data = (c.getContext("2d") as CanvasRenderingContext2D).getImageData(0, 0, c.width, c.height).data;
          let lit = 0;
          for (let i = 0; i < data.length; i += 4) if (data[i + 1] - data[i] > delta) lit++;
          return lit / (data.length / 4);
        },
        { sel: ROOT, delta: LINE_DELTA },
      );
      expect(share, "share of pixels carrying contour lines").toBeGreaterThan(MIN_LINE_SHARE);
      expect(errors).toEqual([]);
    });

    test("two fresh loads with reduced motion render the identical canvas", async ({ page }) => {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await openFixture(page);
      const first = await hash(page);
      await page.goto("about:blank");
      await openFixture(page);
      expect(await hash(page)).toBe(first);
    });
  });
}

test("the fixture is excluded from search engines and from the sitemap", async ({ page, request }) => {
  await page.goto(FIXTURE);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex");
  const sitemap = await (await request.get("/sitemap-0.xml")).text();
  expect(sitemap).not.toContain("e2e-fixtures");
});
