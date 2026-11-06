import { expect, test } from "@playwright/test";
import { IGNORED_ERROR_SOURCES, ROUTES } from "./routes";

for (const route of ROUTES) {
  test.describe(`page ${route.path}`, () => {
    test("renders real HTML with unique SEO metadata and one h1", async ({ page, request }) => {
      // Content must be in the server HTML itself, not injected by JS (ADR-001).
      const raw = await (await request.get(route.path)).text();
      expect(raw).toContain("<h1");
      expect(raw).not.toContain('<div id="root"></div>');

      const errors: string[] = [];
      page.on("pageerror", (e) => errors.push(e.message));
      page.on("console", (m) => {
        if (m.type() === "error" && !IGNORED_ERROR_SOURCES.test(m.text() + (m.location().url ?? ""))) errors.push(m.text());
      });

      const response = await page.goto(route.path);
      expect(response?.status()).toBe(200);

      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator("h1")).toContainText(route.h1);
      await expect(page).toHaveTitle(/DUAT/);

      const description = await page.locator('meta[name="description"]').getAttribute("content");
      expect(description?.length ?? 0).toBeGreaterThan(50);
      const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
      expect(canonical).toBe(`https://duatflow.com${route.path === "/" ? "/" : route.path}`);
      await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", /og-default\.jpg$/);

      expect(errors, `console/page errors on ${route.path}`).toEqual([]);
    });

    test("has no horizontal scroll and every image has an alt attribute", async ({ page }) => {
      await page.goto(route.path);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow, "horizontal overflow in px").toBeLessThanOrEqual(0);
      const missingAlt = await page.locator("img:not([alt])").count();
      expect(missingAlt).toBe(0);
    });

    test("all internal links resolve", async ({ page, request }) => {
      await page.goto(route.path);
      const hrefs = await page.$$eval('a[href^="/"]', (as) =>
        [...new Set(as.map((a) => (a as HTMLAnchorElement).getAttribute("href") ?? ""))].filter((h) => !h.startsWith("/#")),
      );
      for (const href of hrefs) {
        const res = await request.get(href);
        expect(res.status(), `link ${href} on ${route.path}`).toBe(200);
      }
    });
  });
}

test("unknown routes get the 404 page with noindex", async ({ page }) => {
  const response = await page.goto("/definitely-not-a-page");
  expect(response?.status()).toBe(404);
  await expect(page.locator("h1")).toHaveText("Page not found");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex");
});

test("/product: 'Schedule Executive Briefing' is visible (was white-on-white)", async ({ page }) => {
  await page.goto("/product");
  const button = page.getByRole("button", { name: "Schedule Executive Briefing" }).first();
  await expect(button).toBeVisible();
  const { color, background } = await button.evaluate((el) => {
    const s = getComputedStyle(el);
    return { color: s.color, background: s.backgroundColor };
  });
  expect(color).toBe("rgb(255, 255, 255)");
  // Background must be (mostly) transparent so white text sits on the dark hero, not on white.
  // Handles rgba(r, g, b, a) as well as Tailwind 4's oklab(L a b / alpha); opaque colours have no alpha.
  const alpha = Number(background.match(/(?:,|\/)\s*([\d.]+)\)$/)?.[1] ?? 1);
  expect(alpha).toBeLessThan(0.5);
});

test("footer year is current", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("footer")).toContainText(String(new Date().getFullYear()));
});
