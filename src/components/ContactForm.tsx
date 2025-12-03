import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "@/components/ui/use-toast";

// Endpoint for server-side email sending (Netlify Functions)
const getApiEndpoint = () => {
  const isDevelopment = import.meta.env.DEV;
  const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
  const endpoint = "/.netlify/functions/send-contact";
  
  if (isDevelopment && baseUrl) {
    // In development with custom API base URL
    return `${baseUrl}${endpoint}`;
  }
  
  // Production or default
  return endpoint;
};

const SEND_CONTACT_ENDPOINT = getApiEndpoint();

const schema = z.object({
  name: z.string().min(2, "Please enter your full name"),
  email: z.string().email("Please enter a valid email"),
  company: z.string().min(1, "Please enter your company"),
  message: z.string().min(10, "Please provide a bit more detail (10+ chars)"),
  // Honeypot field (should remain empty)
  website: z.string().max(0).optional(),
});

type FormValues = z.infer<typeof schema>;

interface ContactFormProps {
  onSuccess?: () => void;
}

export default function ContactForm({ onSuccess }: ContactFormProps) {
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
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const onSubmit = async (values: FormValues) => {
    // Block bots that fill the honeypot
    if (values.website) return;

    setIsLoading(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const resp = await fetch(SEND_CONTACT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          website: undefined, // don't send honeypot
          timestamp: new Date().toISOString(),
          origin: window.location.href,
        }),
      });

      if (!resp.ok) {
        // Define interface for expected error response structure
        interface ErrorResponse {
          message?: string;
          error?: string;
          details?: string;
          [key: string]: unknown;
        }

        let errorDetails: ErrorResponse = {};
        let localErrorMessage = "Failed to send contact message";
        
        try {
          const parsedResponse: ErrorResponse = await resp.json();
          errorDetails = parsedResponse;
          
          // Type-safe access to message property - check multiple possible fields
          if (errorDetails.message) {
            localErrorMessage = errorDetails.message;
          } else if (errorDetails.error) {
            localErrorMessage = errorDetails.error;
          } else if (errorDetails.details) {
            localErrorMessage = errorDetails.details;
          } else {
            localErrorMessage = `HTTP ${resp.status}: ${resp.statusText}`;
          }
        } catch (e) {
          console.warn("Could not parse error response as JSON:", e);
          localErrorMessage = `HTTP ${resp.status}: ${resp.statusText}`;
        }

        // Log detailed error for debugging
        console.error("API Error Response:", {
          status: resp.status,
          statusText: resp.statusText,
          url: SEND_CONTACT_ENDPOINT,
          details: errorDetails,
          requestPayload: values
        });

        throw new Error(localErrorMessage);
      }

      setSubmitStatus('success');
      toast({
        title: "Request sent",
        description:
          "Thanks! We received your request. We'll respond within 1 business day.",
      });

      // Call onSuccess callback after a brief delay to allow screen readers to perceive the success message
      setTimeout(() => {
        form.reset();
        setSubmitStatus('idle');
        onSuccess?.();
      }, 1500);
    } catch (error) {
      console.error("Contact form submission error:", {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        endpoint: SEND_CONTACT_ENDPOINT,
        payload: values,
        timestamp: new Date().toISOString()
      });
      
      setSubmitStatus('error');
      
      // Provide more specific error messages based on error type
      let userMessage = 'Something went wrong. Please try again or email us at info@duatflow.com.';
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        userMessage = 'Network error. Please check your connection and try again.';
      } else if (error instanceof Error && error.message.includes('404')) {
        userMessage = 'Service temporarily unavailable. Please try again later.';
      } else if (error instanceof Error && error.message.includes('500')) {
        userMessage = 'Server error. Please try again later or contact us directly.';
      } else if (error instanceof Error && error.message.includes('timeout')) {
        userMessage = 'Request timed out. Please try again.';
      }
      
      setErrorMessage(userMessage);
      toast({
        title: "Submission failed",
        description: userMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {submitStatus === 'success' && (
          <Alert className="bg-green-50 border-green-200 text-green-900">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertTitle>Request sent</AlertTitle>
            <AlertDescription>
              Thanks — we received your request. We'll respond within 1 business day.
            </AlertDescription>
          </Alert>
        )}

        {submitStatus === 'error' && (
          <Alert className="bg-red-50 border-red-200 text-red-900" role="alert" aria-live="assertive">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertTitle>Submission failed</AlertTitle>
            <AlertDescription>
              {errorMessage}
            </AlertDescription>
          </Alert>
        )}

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
          <Button type="submit" variant="gradient" disabled={isLoading || submitStatus === 'success'} aria-busy={isLoading}>
            {isLoading ? (
              <>
                <span className="inline-block w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Sending…
              </>
            ) : submitStatus === 'success' ? (
              <>Thanks!</>
            ) : (
              "Send request"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
