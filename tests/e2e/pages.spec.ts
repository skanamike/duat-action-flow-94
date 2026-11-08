import { expect, test } from "@playwright/test";
import { IGNORED_ERROR_SOURCES, ROUTES } from "./routes";
import { worstContrastAgainstWhite } from "./contrast";

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

test("Netlify redirects: retired pages and trailing slashes 301 to canonical URLs (R6)", async ({ request }) => {
  const cases: Array<[string, string]> = [
    ["/pantheon", "/company"],
    ["/companyv1", "/company"],
    ["/company/", "/company"],
    ["/company/team/", "/company/team"],
    ["/product/", "/product"],
  ];
  for (const [from, to] of cases) {
    const res = await request.get(from, { maxRedirects: 0 });
    expect(res.status(), from).toBe(301);
    expect(res.headers()["location"], from).toBe(to);
  }
});

test("pages run under the real Content-Security-Policy with no violations", async ({ page }) => {
  const violations: string[] = [];
  page.on("console", (m) => {
    if (/Content Security Policy|Refused to (execute|load|apply)/i.test(m.text())) violations.push(m.text());
  });
  const res = await page.goto("/");
  expect(res?.headers()["content-security-policy"]).toContain("default-src 'self'");
  // Exercise the site's own scripts: the menu (mobile) or the dialog (desktop).
  await page.locator("[data-contact]:visible").first().click();
  await expect(page.getByRole("dialog")).toBeVisible();
  expect(violations).toEqual([]);
});

test("unknown routes get the 404 page with noindex", async ({ page }) => {
  const response = await page.goto("/definitely-not-a-page");
  expect(response?.status()).toBe(404);
  await expect(page.locator("h1")).toHaveText("Page not found");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex");
});

test("/product: every 'Schedule Executive Briefing' button meets 4.5:1 against its real background (AC4)", async ({ page }) => {
  await page.goto("/product");
  const buttons = page.getByRole("button", { name: "Schedule Executive Briefing" });
  await expect(buttons).toHaveCount(2);
  for (const button of await buttons.all()) {
    await button.scrollIntoViewIfNeeded();
    await expect(button).toBeVisible();
    expect(await button.evaluate((el) => getComputedStyle(el).color)).toBe("rgb(255, 255, 255)");
    const ratio = await worstContrastAgainstWhite(button);
    expect(ratio, "worst-case contrast of white text vs rendered background").toBeGreaterThanOrEqual(4.5);
  }
});

test("Google Analytics exposes window.gtag so conversion events can fire (R1)", async ({ page }) => {
  await page.goto("/");
  expect(await page.evaluate(() => typeof (window as unknown as { gtag?: unknown }).gtag)).toBe("function");
});

test("JSON-LD is valid and cannot break out of its script tag (R22)", async ({ page }) => {
  await page.goto("/");
  const raw = await page.locator('script[type="application/ld+json"]').textContent();
  expect(raw).not.toContain("<");
  expect(JSON.parse(raw ?? "{}")).toMatchObject({ "@type": "Organization", name: "DUAT" });
});

test("footer year is current", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("footer")).toContainText(String(new Date().getFullYear()));
});
