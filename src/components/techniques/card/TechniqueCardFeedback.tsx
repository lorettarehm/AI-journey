
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Send } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const formSchema = z.object({
  subject: z.string().min(3, {
    message: 'Subject must be at least 3 characters.',
  }),
  message: z.string().min(10, {
    message: 'Message must be at least 10 characters.',
  }),
});

interface FeedbackFormProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  techniqueId?: string;
  techniqueName?: string;
  type: 'feedback' | 'support';
}

const TechniqueCardFeedback: React.FC<FeedbackFormProps> = ({
  open,
  setOpen,
  techniqueId,
  techniqueName,
  type
}) => {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subject: type === 'feedback' 
        ? techniqueId 
          ? `Feedback on ${techniqueName || 'technique'}`
          : 'General Feedback'
        : techniqueId
          ? `Support Request for ${techniqueName || 'technique'}`
          : 'Support Request',
      message: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const { data, error } = await supabase.functions.invoke('send-feedback', {
        body: {
          subject: values.subject,
          message: values.message,
          techniqueId,
          techniqueName,
          type
        }
      });

      if (error) throw error;

      toast({
        title: 'Success!',
        description: type === 'feedback' 
          ? 'Your feedback has been sent successfully.'
          : 'Your support request has been sent successfully.',
        variant: 'default',
      });
      
      form.reset();
      setOpen(false);
    } catch (error) {
      console.error('Error sending feedback:', error);
      toast({
        title: 'Something went wrong.',
        description: 'Your message could not be sent. Please try again later.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {type === 'feedback' ? 'Provide Feedback' : 'Request Support'}
          </DialogTitle>
          <DialogDescription>
            {type === 'feedback' 
              ? 'Share your thoughts about our service or suggest improvements.'
              : 'Describe the issue you\'re experiencing, and we\'ll get back to you.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject</FormLabel>
                  <FormControl>
                    <Input placeholder="Subject of your message" {...field} />
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
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Write your message here..." 
                      className="min-h-[150px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Please be as detailed as possible.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" className="gap-2">
                <Send className="h-4 w-4" />
                {type === 'feedback' ? 'Send Feedback' : 'Send Request'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default TechniqueCardFeedback;
