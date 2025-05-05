
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface EmailUpdateFormProps {
  currentEmail: string | undefined;
}

const emailFormSchema = z.object({
  newEmail: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(1, { message: "Password is required to update email." }),
});

type EmailFormValues = z.infer<typeof emailFormSchema>;

const EmailUpdateForm: React.FC<EmailUpdateFormProps> = ({ currentEmail }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<EmailFormValues>({
    resolver: zodResolver(emailFormSchema),
    defaultValues: {
      newEmail: "",
      password: "",
    },
  });

  const onSubmit = async (data: EmailFormValues) => {
    if (!currentEmail) {
      toast({
        title: "Error",
        description: "Current email is undefined",
        variant: "destructive",
      });
      return;
    }

    if (data.newEmail === currentEmail) {
      toast({
        title: "No change",
        description: "New email is the same as current email",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);

    try {
      // First verify current password by signing in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: currentEmail,
        password: data.password,
      });

      if (signInError) {
        throw new Error("Current password is incorrect");
      }

      // Then update the email
      const { error: updateError } = await supabase.auth.updateUser({
        email: data.newEmail,
      });

      if (updateError) throw updateError;

      toast({
        title: "Verification email sent",
        description: "Please check your new email to confirm the change.",
      });
      
      form.reset();
    } catch (error: any) {
      toast({
        title: "Error updating email",
        description: error.message || "An unexpected error occurred",
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
          name="newEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Email Address</FormLabel>
              <FormControl>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    className="pl-10" 
                    placeholder="Enter your new email address" 
                    {...field} 
                  />
                </div>
              </FormControl>
              <FormDescription>
                Current email: {currentEmail || 'Not available'}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Enter your current password to confirm"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                We need your current password to verify your identity
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating...
            </>
          ) : (
            "Update Email"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default EmailUpdateForm;
