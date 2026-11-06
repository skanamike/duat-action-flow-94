import { expect, test, type Page } from "@playwright/test";
import { ROUTES } from "./routes";

const NETLIFY_FIELDS = ["form-name", "name", "email", "company", "message", "origin"];

interface CapturedSubmission {
  contentType: string;
  fields: Record<string, string>;
  keys: string[];
}

/**
 * Netlify Forms only exists on Netlify, so the AJAX POST to "/" is stubbed at the network
 * layer. Only POSTs to the site root are intercepted; every other request (incl. the GET of
 * "/") goes to the real server. An unstubbed POST gets the static server's 404.
 */
async function stubNetlifyForm(page: Page, status: number): Promise<{ submissions: CapturedSubmission[] }> {
  const captured = { submissions: [] as CapturedSubmission[] };
  await page.route(
    (url) => url.pathname === "/",
    async (route) => {
      const request = route.request();
      if (request.method() !== "POST") {
        await route.continue();
        return;
      }
      const params = new URLSearchParams(request.postData() ?? "");
      captured.submissions.push({
        contentType: (await request.headerValue("content-type")) ?? "",
        fields: Object.fromEntries(params),
        keys: [...params.keys()],
      });
      await route.fulfill({ status, contentType: "text/html", body: "<!doctype html><title>Form</title>" });
    },
  );
  return captured;
}

/** Attributes of every tag named `tag` inside `html` (raw markup, as Netlify's deploy parser sees it). */
function tagAttributes(html: string, tag: string): Record<string, string>[] {
  return [...html.matchAll(new RegExp(`<${tag}\\b([^>]*)>`, "g"))].map((m) =>
    Object.fromEntries([...m[1].matchAll(/([\w-]+)(?:="([^"]*)")?/g)].map((a) => [a[1], a[2] ?? ""])),
  );
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

const UNKNOWN_PATH = "/this-page-does-not-exist";

test("every page's raw HTML, incl. the 404 page, carries the Netlify form markup (AC1)", async ({ request }) => {
  const pages = [...ROUTES.map(({ path }) => ({ path, status: 200 })), { path: UNKNOWN_PATH, status: 404 }];
  for (const { path, status } of pages) {
    const response = await request.get(path);
    expect(response.status(), path).toBe(status);
    const html = await response.text();
    const formMatch = html.match(/<form\b[^>]*\bid="contact-form"[^>]*>[\s\S]*?<\/form>/);
    expect(formMatch, `${path}: contact form`).not.toBeNull();
    const formHtml = formMatch?.[0] ?? "";

    expect(tagAttributes(formHtml, "form")[0], path).toMatchObject({
      name: "contact",
      method: "POST",
      "data-netlify": "true",
      "netlify-honeypot": "website",
    });
    const controls = [...tagAttributes(formHtml, "input"), ...tagAttributes(formHtml, "textarea")];
    expect(controls, `${path}: hidden form-name`).toContainEqual(
      expect.objectContaining({ type: "hidden", name: "form-name", value: "contact" }),
    );
    expect(controls, `${path}: hidden origin`).toContainEqual(expect.objectContaining({ type: "hidden", name: "origin" }));
    const names = controls.map((c) => c.name);
    for (const field of ["name", "email", "company", "message", "origin", "website"]) {
      expect(names, `${path}: field ${field}`).toContain(field);
    }
  }
});

test("validation errors appear and nothing is sent when fields are empty", async ({ page }) => {
  const captured = await stubNetlifyForm(page, 200);
  await page.goto("/");
  await page.locator("[data-contact]:visible").first().click();
  await page.locator("#contact-dialog").getByRole("button", { name: "Send request" }).click();
  await expect(page.locator('[data-error-for="email"]')).toHaveText("Please enter a valid email");
  await expect(page.getByLabel("Full name")).toHaveAttribute("aria-invalid", "true");
  expect(captured.submissions).toHaveLength(0);
});

test("a valid request POSTs URL-encoded Netlify form data and shows success on 2xx (AC2)", async ({ page }) => {
  const captured = await stubNetlifyForm(page, 200);
  await page.goto("/product?utm_source=test#roadmap");
  await page.locator("[data-contact]:visible").first().click();
  await fillValid(page);
  await page.getByRole("button", { name: "Send request" }).click();
  await expect(page.getByRole("status")).toContainText("your request has been sent");
  expect(captured.submissions).toHaveLength(1);
  const [submission] = captured.submissions;
  expect(submission.contentType).toBe("application/x-www-form-urlencoded");
  expect(submission.keys.sort()).toEqual([...NETLIFY_FIELDS].sort());
  expect(submission.fields).toEqual({
    "form-name": "contact",
    name: "Jane Doe",
    email: "jane@acme.com",
    company: "Acme",
    message: "We need tier-3 visibility for lithium.",
    origin: "/product",
  });
  expect(submission.fields).not.toHaveProperty("website");
});

test("a filled honeypot sends nothing; the same form without it sends once (AC3)", async ({ page }) => {
  const captured = await stubNetlifyForm(page, 200);
  await page.goto("/");
  await page.locator("[data-contact]:visible").first().click();
  await fillValid(page);
  const honeypot = page.locator("#contact-website");
  await honeypot.evaluate((el) => ((el as HTMLInputElement).value = "http://spam.example"));
  await page.getByRole("button", { name: "Send request" }).click();

  // The bot submission is dropped silently: nothing sent, no outcome shown, form untouched.
  // A sent-and-succeeded submission would also reset the form, so the value check matters.
  expect(captured.submissions).toHaveLength(0);
  // Located by its hook, not by role: the idle (empty) status region is display:none (`empty:hidden`).
  await expect(page.locator("[data-contact-status]")).toBeEmpty();
  await expect(page.getByLabel("Full name")).toHaveValue("Jane Doe");

  // The same form without the honeypot is sent exactly once, with this message.
  await honeypot.evaluate((el) => ((el as HTMLInputElement).value = ""));
  await page.getByLabel("How can we help?").fill("clean submission");
  await page.getByRole("button", { name: "Send request" }).click();
  await expect(page.getByRole("status")).toContainText("your request has been sent");
  expect(captured.submissions).toHaveLength(1);
  expect(captured.submissions[0].fields.message).toBe("clean submission");
  expect(captured.submissions[0].fields).not.toHaveProperty("website");
});

test("a non-2xx response shows an error and keeps the visitor's input (old bug: always 'sent')", async ({ page }) => {
  await stubNetlifyForm(page, 502);
  await page.goto("/");
  await page.locator("[data-contact]:visible").first().click();
  await fillValid(page);
  await page.getByRole("button", { name: "Send request" }).click();
  await expect(page.getByRole("status")).toContainText("couldn't send your request");
  await expect(page.getByLabel("Email")).toHaveValue("jane@acme.com");
});

test("without a stub, the server's 404 (form not detected) shows an error, never success", async ({ page }) => {
  await page.goto("/technology");
  await page.locator("[data-contact]:visible").first().click();
  await fillValid(page);
  await page.getByRole("button", { name: "Send request" }).click();
  await expect(page.getByRole("status")).toContainText("couldn't send your request");
});

test("a network failure shows an error", async ({ page }) => {
  await page.route(
    (url) => url.pathname === "/",
    (route) => (route.request().method() === "POST" ? route.abort("failed") : route.continue()),
  );
  await page.goto("/");
  await page.locator("[data-contact]:visible").first().click();
  await fillValid(page);
  await page.getByRole("button", { name: "Send request" }).click();
  await expect(page.getByRole("status")).toContainText("couldn't send your request");
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
  await stubNetlifyForm(page, 200);
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
