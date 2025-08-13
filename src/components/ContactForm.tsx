import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

const ZAPIER_WEBHOOK_URL = "https://hooks.zapier.com/hooks/catch/24194548/u6f847r/";

const schema = z.object({
  name: z.string().min(2, "Please enter your full name"),
  email: z.string().email("Please enter a valid email"),
  company: z.string().min(1, "Please enter your company"),
  message: z.string().min(10, "Please provide a bit more detail (10+ chars)"),
  // Honeypot field (should remain empty)
  website: z.string().max(0).optional(),
});

type FormValues = z.infer<typeof schema>;

export default function ContactForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      message: "",
      website: "", // honeypot
    },
  });

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (values: FormValues) => {
    // Block bots that fill the honeypot
    if (values.website) return;

    setIsLoading(true);

    try {
      await fetch(ZAPIER_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        mode: "no-cors",
        body: JSON.stringify({
          ...values,
          website: undefined, // don't send honeypot
          timestamp: new Date().toISOString(),
          origin: window.location.href,
        }),
      });

      toast({
        title: "Request sent",
        description:
          "Thanks! We sent your request. Please check your inbox and Zapier task history.",
      });

      form.reset();
    } catch (error) {
      console.error("Error triggering webhook:", error);
      toast({
        title: "Error",
        description:
          "Failed to send your request. Please try again or email us directly.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full name</FormLabel>
              <FormControl>
                <Input placeholder="Jane Doe" autoComplete="name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="jane@company.com" autoComplete="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="company"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company</FormLabel>
              <FormControl>
                <Input placeholder="Acme Inc." autoComplete="organization" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>How can we help?</FormLabel>
              <FormControl>
                <Textarea placeholder="Tell us about your goals or questions..." rows={5} {...field} />
              </FormControl>
              <FormDescription>We typically respond within 1 business day.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Honeypot field - keep hidden */}
        <input type="text" tabIndex={-1} autoComplete="off" className="hidden" {...form.register("website")} />

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button type="submit" variant="gradient" disabled={isLoading}>
            {isLoading ? "Sending..." : "Send request"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
