import { useState } from "react";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactFormSchema, type ContactFormData, type CalculationResult } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Icons } from "@/components/icons";
import { Send, Briefcase, Building, MessageSquare, Phone, User } from "lucide-react";

interface ContactFormProps {
  calculationData?: CalculationResult;
  onSubmissionComplete?: () => void;
}

// Icons are now imported from components/icons.tsx

export function ContactForm({ calculationData, onSubmissionComplete }: ContactFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      companyName: "",
      phoneNumber: "",
      message: "",
    },
  });

  async function onSubmit(data: ContactFormData) {
    setIsSubmitting(true);

    try {
      // Include calculation data if provided
      const formData = {
        ...data,
        calculationData: calculationData || undefined,
      };

      const response = await apiRequest("POST", "/api/contact", formData);
      const result = await response.json();

      if (response.ok && result.success) {
        setSubmitted(true);
        toast({
          title: "Thank you for your interest!",
          description: "We've received your information and will contact you soon.",
        });

        // Reset the form
        form.reset();

        // Call the callback if provided
        if (onSubmissionComplete) {
          onSubmissionComplete();
        }
      } else {
        toast({
          title: "Submission failed",
          description: result.message || "Something went wrong. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Form submission error:", error);
      toast({
        title: "Submission failed",
        description: "Something went wrong. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="p-8 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-emerald-100 shadow-sm text-center">
        <div className="mx-auto w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
          <Icons.send className="h-7 w-7 text-emerald-600" />
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">Thank You!</h3>
        <p className="text-slate-600 max-w-md mx-auto">
          Your information has been received. Our team will reach out to you shortly to discuss how Wayfinder can help optimize your fleet operations.
        </p>
        <Button 
          variant="outline" 
          className="mt-6" 
          onClick={() => setSubmitted(false)}
        >
          Send Another Message
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="flex flex-col space-y-1.5 p-6">
        <h3 className="text-2xl font-semibold leading-none tracking-tight">Contact Us</h3>
        <p className="text-sm text-muted-foreground">
          Ready to start saving fuel? Let us know how to reach you, and our team will be in touch to discuss your customized solution.
        </p>
      </div>
      <div className="p-6 pt-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <User className="h-4 w-4" /> Name
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Your name" {...field} />
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
                  <FormLabel className="flex items-center gap-2">
                    <Icons.send className="h-4 w-4" /> Email
                  </FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="your.email@company.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Building className="h-4 w-4" /> Company
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Your company name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Phone className="h-4 w-4" /> Phone (optional)
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Your phone number" {...field} />
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
                  <FormLabel className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" /> Additional Information (optional)
                  </FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Tell us about your specific needs or questions"
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Any specific details about your fleet or requirements that might help us prepare for our call.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-[#175D8D] to-[#0D4A75] hover:from-[#1A6BA3] hover:to-[#0F568A]"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Icons.send className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Icons.send className="mr-2 h-4 w-4" />
                  Get in Touch
                </>
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
