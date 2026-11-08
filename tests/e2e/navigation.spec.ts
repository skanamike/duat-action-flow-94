import { expect, test } from "@playwright/test";

const LABELS = ["Product", "Technology", "Company", "Team", "Why Duat"];

test.describe("desktop navigation", () => {
  test.skip(({ isMobile }) => isMobile, "desktop only");

  test("shows every page link and marks the current page", async ({ page }) => {
    await page.goto("/technology");
    const nav = page.getByRole("navigation", { name: "Main" });
    for (const label of LABELS) await expect(nav.getByRole("link", { name: label, exact: true }).first()).toBeVisible();
    await expect(nav.locator('a[aria-current="page"]').first()).toHaveText("Technology");
  });
});

test.describe("mobile navigation", () => {
  test.skip(({ isMobile }) => !isMobile, "mobile only");

  test("menu button opens a real menu (not the contact form) and navigates", async ({ page }) => {
    await page.goto("/");
    const toggle = page.getByRole("button", { name: "Open menu" });
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await toggle.click();

    const menu = page.locator("#mobile-menu");
    await expect(menu).toBeVisible();
    await expect(page.getByRole("button", { name: "Close menu" })).toHaveAttribute("aria-expanded", "true");
    await expect(page.locator("#contact-dialog")).not.toBeVisible();

    for (const label of LABELS) await expect(menu.getByRole("link", { name: label, exact: true })).toBeVisible();

    await menu.getByRole("link", { name: "Team", exact: true }).click();
    await expect(page).toHaveURL(/\/company\/team$/);
    await expect(page.locator("h1")).toContainText("The Duat Team");
  });

  test("menu scrolls to its last item on a landscape phone (R11)", async ({ page }) => {
    await page.setViewportSize({ width: 740, height: 360 });
    await page.goto("/");
    await page.getByRole("button", { name: "Open menu" }).click();
    const last = page.locator("#mobile-menu").getByRole("button", { name: "Get Started" });
    await last.scrollIntoViewIfNeeded();
    const box = await last.boundingBox();
    expect((box?.y ?? 999) + (box?.height ?? 0)).toBeLessThanOrEqual(360);
  });

  test("closing a dialog opened from the menu returns focus to the menu button (R12)", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Open menu" }).click();
    await page.locator("#mobile-menu").getByRole("button", { name: "Get Started" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.locator("[data-menu-toggle]")).toBeFocused();
  });

  test("Escape closes the menu and returns focus to the toggle", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Open menu" }).click();
    await page.keyboard.press("Escape");
    await expect(page.locator("#mobile-menu")).toBeHidden();
    await expect(page.getByRole("button", { name: "Open menu" })).toBeFocused();
  });
});
