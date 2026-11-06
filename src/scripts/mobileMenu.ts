/** Mobile navigation toggle. Progressive enhancement over a plain list of links. */
export function initMobileMenu(root: Document = document): void {
  const toggle = root.querySelector<HTMLButtonElement>("[data-menu-toggle]");
  const menu = root.querySelector<HTMLElement>("[data-mobile-menu]");
  if (!toggle || !menu) return;

  const iconOpen = toggle.querySelector<SVGElement>("[data-icon-open]");
  const iconClose = toggle.querySelector<SVGElement>("[data-icon-close]");

  const setOpen = (open: boolean): void => {
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    menu.classList.toggle("hidden", !open);
    iconOpen?.classList.toggle("hidden", open);
    iconClose?.classList.toggle("hidden", !open);
  };

  toggle.addEventListener("click", () => setOpen(toggle.getAttribute("aria-expanded") !== "true"));

  root.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
      setOpen(false);
      toggle.focus();
    }
  });

  // Close the menu when a contact button inside it opens the dialog.
  menu.addEventListener("click", (event) => {
    if ((event.target as Element | null)?.closest("[data-contact]")) setOpen(false);
  });
}
