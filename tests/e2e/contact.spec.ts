import { expect, test, type Page } from "@playwright/test";

/** /api/contact is a Netlify Function. In `astro preview` we stub it at the network layer. */
async function stubContact(page: Page, status: number): Promise<{ bodies: unknown[] }> {
  const captured = { bodies: [] as unknown[] };
  await page.route("**/api/contact", async (route) => {
    captured.bodies.push(route.request().postDataJSON());
    await route.fulfill({ status, contentType: "application/json", body: JSON.stringify({ ok: status < 300 }) });
  });
  return captured;
}

async function fillValid(page: Page): Promise<void> {
  const dialog = page.locator("#contact-dialog");
  await dialog.getByLabel("Full name").fill("Jane Doe");
  await dialog.getByLabel("Email").fill("jane@acme.com");
  await dialog.getByLabel("Company").fill("Acme");
  await dialog.getByLabel("How can we help?").fill("We need tier-3 visibility for lithium.");
}

test("a page CTA opens the dialog with its own heading", async ({ page }) => {
  await page.goto("/company");
  await page.getByRole("button", { name: "Request Executive Briefing" }).first().click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("heading")).toHaveText("Request Executive Briefing");
});

test("validation errors appear and nothing is sent when fields are empty", async ({ page }) => {
  const captured = await stubContact(page, 200);
  await page.goto("/");
  await page.locator("[data-contact]:visible").first().click();
  await page.locator("#contact-dialog").getByRole("button", { name: "Send request" }).click();
  await expect(page.locator('[data-error-for="email"]')).toHaveText("Please enter a valid email");
  await expect(page.getByLabel("Full name")).toHaveAttribute("aria-invalid", "true");
  expect(captured.bodies).toHaveLength(0);
});

test("success is shown only after the relay returns 2xx, without the honeypot", async ({ page }) => {
  const captured = await stubContact(page, 200);
  await page.goto("/product");
  await page.locator("[data-contact]:visible").first().click();
  await fillValid(page);
  await page.getByRole("button", { name: "Send request" }).click();
  await expect(page.getByRole("status")).toContainText("your request has been sent");
  await expect(page.getByRole("status")).not.toContainText(/zapier/i);
  expect(captured.bodies).toHaveLength(1);
  expect(captured.bodies[0]).toMatchObject({ name: "Jane Doe", email: "jane@acme.com", company: "Acme" });
  expect(captured.bodies[0]).not.toHaveProperty("website");
});

test("a failed relay shows an error and keeps the visitor's input (old bug: always 'sent')", async ({ page }) => {
  await stubContact(page, 502);
  await page.goto("/");
  await page.locator("[data-contact]:visible").first().click();
  await fillValid(page);
  await page.getByRole("button", { name: "Send request" }).click();
  await expect(page.getByRole("status")).toContainText("couldn't send your request");
  await expect(page.getByLabel("Email")).toHaveValue("jane@acme.com");
});

test("reopening the dialog clears stale validation errors (R4)", async ({ page }) => {
  await page.goto("/company");
  await page.locator("[data-contact]:visible").first().click();
  await page.getByRole("button", { name: "Send request" }).click();
  await expect(page.locator('[data-error-for="email"]')).toBeVisible();
  await page.keyboard.press("Escape");
  await page.locator("[data-contact]:visible").nth(1).click();
  await expect(page.locator('[data-error-for="email"]')).toBeHidden();
  await expect(page.getByLabel("Email")).not.toHaveAttribute("aria-invalid", "true");
});

test("a text selection dragged out onto the backdrop does not close the dialog (R10)", async ({ page, isMobile }) => {
  test.skip(isMobile, "pointer drag checked on desktop");
  await page.goto("/");
  await page.locator("[data-contact]:visible").first().click();
  const name = page.getByLabel("Full name");
  await name.fill("Jane Doe");
  const box = await name.boundingBox();
  await page.mouse.move((box?.x ?? 0) + 10, (box?.y ?? 0) + 10);
  await page.mouse.down();
  await page.mouse.move(5, 5, { steps: 5 });
  await page.mouse.up();
  await expect(page.getByRole("dialog")).toBeVisible();
  // A genuine backdrop click still closes it.
  await page.mouse.click(5, 5);
  await expect(page.getByRole("dialog")).toBeHidden();
});

test("after submitting, focus moves to the result message, not <body> (R12)", async ({ page }) => {
  await stubContact(page, 200);
  await page.goto("/");
  await page.locator("[data-contact]:visible").first().click();
  await fillValid(page);
  await page.getByRole("button", { name: "Send request" }).click();
  await expect(page.getByRole("status")).toBeFocused();
});

test("error messages meet 4.5:1 contrast (R13)", async ({ page }) => {
  await page.goto("/");
  await page.locator("[data-contact]:visible").first().click();
  await page.getByRole("button", { name: "Send request" }).click();
  const color = await page.locator('[data-error-for="email"]').evaluate((el) => getComputedStyle(el).color);
  const [r, g, b] = (color.match(/[\d.]+/g) ?? []).map(Number);
  const { contrastRatio, luminance } = await import("./contrast");
  expect(contrastRatio(luminance(r, g, b), 1)).toBeGreaterThanOrEqual(4.5);
});

test("Escape closes the dialog and returns focus to the trigger", async ({ page, isMobile }) => {
  test.skip(isMobile, "keyboard flow checked on desktop");
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "Get Started" }).first();
  await trigger.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toBeHidden();
  await expect(trigger).toBeFocused();
});
