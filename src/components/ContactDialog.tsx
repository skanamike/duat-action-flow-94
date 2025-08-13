import { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ContactForm from "@/components/ContactForm";

interface ContactDialogProps {
  trigger: ReactNode;
  title?: string;
  description?: string;
}

export default function ContactDialog({
  trigger,
  title = "Request more info",
  description = "Share a few details and we’ll get back to you shortly.",
}: ContactDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <ContactForm />
      </DialogContent>
    </Dialog>
  );
}
