import { cloneElement, isValidElement, type ReactElement } from "react";

interface ContactTriggerProps {
  /** The button/link that should open the contact dialog. */
  trigger: ReactElement<Record<string, unknown>>;
  title?: string;
  description?: string;
}

/**
 * Server-rendered marker (ADR-003). Adds `data-contact*` attributes to the
 * trigger so the global <ContactModal> opens with the right heading. Ships no
 * client JavaScript of its own.
 */
export default function ContactTrigger({ trigger, title, description }: ContactTriggerProps): ReactElement {
  if (!isValidElement(trigger)) throw new Error("ContactTrigger requires a single React element as `trigger`");
  return cloneElement(trigger, {
    "data-contact": "",
    ...(title ? { "data-contact-title": title } : {}),
    ...(description ? { "data-contact-description": description } : {}),
    ...(trigger.type === "button" || trigger.props.type ? {} : { type: "button" }),
  });
}
