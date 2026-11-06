import { CONTACT_ENDPOINT } from "@/config/site";
import {
  buildLeadPayload,
  createHttpLeadAdapter,
  hasErrors,
  isSpam,
  normalizeLead,
  validateLead,
  type LeadErrors,
  type LeadField,
} from "@/lib/leadCapture";

const FIELDS: readonly LeadField[] = ["name", "email", "company", "message"];
const SUCCESS_MESSAGE = "Thanks, your request has been sent. We'll be in touch within 1 business day.";

/** Wire the contact dialog: open on any [data-contact] click, validate, submit and report truthfully. */
export function initContactModal(root: Document = document): void {
  const dialog = root.getElementById("contact-dialog") as HTMLDialogElement | null;
  const form = root.getElementById("contact-form") as HTMLFormElement | null;
  if (!dialog || !form) return;

  const title = dialog.querySelector<HTMLElement>("#contact-title");
  const description = dialog.querySelector<HTMLElement>("#contact-description");
  const status = dialog.querySelector<HTMLElement>("[data-contact-status]");
  const submit = dialog.querySelector<HTMLButtonElement>("[data-contact-submit]");
  const adapter = createHttpLeadAdapter(CONTACT_ENDPOINT);
  let opener: HTMLElement | null = null;

  const setStatus = (kind: "success" | "error" | "hidden", text = ""): void => {
    if (!status) return;
    status.textContent = kind === "hidden" ? "" : text;
    status.classList.toggle("p-3", kind !== "hidden");
    status.classList.toggle("bg-emerald-50", kind === "success");
    status.classList.toggle("text-emerald-800", kind === "success");
    status.classList.toggle("bg-red-50", kind === "error");
    status.classList.toggle("text-red-800", kind === "error");
  };

  const showErrors = (errors: LeadErrors): void => {
    for (const field of FIELDS) {
      const input = form.elements.namedItem(field) as HTMLInputElement | HTMLTextAreaElement | null;
      const message = form.querySelector<HTMLElement>(`[data-error-for="${field}"]`);
      const error = errors[field];
      input?.setAttribute("aria-invalid", String(Boolean(error)));
      if (message) {
        message.textContent = error ?? "";
        message.classList.toggle("hidden", !error);
      }
    }
    const firstInvalid = FIELDS.find((f) => errors[f]);
    if (firstInvalid) (form.elements.namedItem(firstInvalid) as HTMLElement | null)?.focus();
  };

  const clearErrors = (): void => {
    for (const field of FIELDS) {
      (form.elements.namedItem(field) as HTMLElement | null)?.removeAttribute("aria-invalid");
      const message = form.querySelector<HTMLElement>(`[data-error-for="${field}"]`);
      if (message) {
        message.textContent = "";
        message.classList.add("hidden");
      }
    }
  };

  const open = (trigger: HTMLElement): void => {
    opener = trigger;
    if (title) title.textContent = trigger.dataset.contactTitle || title.dataset.default || "";
    if (description) description.textContent = trigger.dataset.contactDescription || description.dataset.default || "";
    setStatus("hidden");
    clearErrors(); // R4: no stale errors from a previous attempt
    dialog.showModal();
  };

  root.addEventListener("click", (event) => {
    const trigger = (event.target as Element | null)?.closest<HTMLElement>("[data-contact]");
    if (!trigger) return;
    event.preventDefault();
    open(trigger);
  });

  dialog.querySelector("[data-contact-close]")?.addEventListener("click", () => dialog.close());

  // R10: close on backdrop only when the press *started* on the backdrop too,
  // so a text selection dragged out of an input doesn't dismiss the form.
  let pressStartedOnBackdrop = false;
  dialog.addEventListener("pointerdown", (event) => {
    pressStartedOnBackdrop = event.target === dialog;
  });
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog && pressStartedOnBackdrop) dialog.close();
    pressStartedOnBackdrop = false;
  });

  // R12: return focus to the opener, or to the menu toggle if the opener was hidden (e.g. inside the closed mobile menu).
  dialog.addEventListener("close", () => {
    const target = opener && opener.offsetParent !== null ? opener : root.querySelector<HTMLElement>("[data-menu-toggle]");
    target?.focus();
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const lead = normalizeLead({
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      company: String(data.get("company") ?? ""),
      message: String(data.get("message") ?? ""),
      website: String(data.get("website") ?? ""),
    });

    if (isSpam(lead)) return;

    const errors = validateLead(lead);
    showErrors(errors);
    if (hasErrors(errors)) return;

    if (submit) {
      submit.disabled = true;
      submit.textContent = "Sending...";
    }
    setStatus("hidden");

    const result = await adapter.submit(buildLeadPayload(lead, window.location.href));

    if (submit) {
      submit.disabled = false;
      submit.textContent = "Send request";
    }

    if (result.ok) {
      form.reset();
      setStatus("success", SUCCESS_MESSAGE);
      window.gtag?.("event", "generate_lead", { method: "contact_form" });
    } else {
      setStatus("error", result.error);
    }
    // R12: the submit button was disabled (dropping focus to <body>); put focus on the outcome instead.
    status?.focus();
  });
}

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}
