
import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { creditFormSchema, CreditFormValues } from './schema';
import { CreditFormFields } from './CreditFormFields';
import { useSubmitCredit } from './useSubmitCredit';

const CreditRecordingForm = () => {
  const { submitCredit, isSubmitting } = useSubmitCredit();
  
  const form = useForm<CreditFormValues>({
    resolver: zodResolver(creditFormSchema),
    defaultValues: {
      customerName: "",
      customerEmail: "",
      amount: "",
      orderId: "",
      creditorName: "",
      creditorContact: "",
      description: "",
    },
  });
  
  const onSubmit = async (data: CreditFormValues) => {
    const result = await submitCredit(data);
    if (result.success) {
      form.reset();
    }
  };
  
  return (
    <FormProvider {...form}>
      <Form>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <CreditFormFields />
          
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Recording Credit...
              </>
            ) : (
              "Record Credit"
            )}
          </Button>
        </form>
      </Form>
    </FormProvider>
  );
};

export default CreditRecordingForm;
