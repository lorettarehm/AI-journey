import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ForgotPasswordFormProps {
  onBack: () => void;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onBack }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      // Call our Supabase Edge Function
      const response = await supabase.functions.invoke('reset-password', {
        body: { 
          email,
          redirectTo: `${window.location.origin}/reset-password`
        }
      });
      
      if (!response.data?.success) {
        throw new Error(response.data?.error || 'Failed to send reset email');
      }
      
      setSuccess(true);
      toast({
        title: "Reset email sent",
        description: "Check your inbox for the password reset link",
      });
    } catch (err: any) {
      console.error('Error sending reset email:', err);
      setError(err.message || "An error occurred while sending the reset email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Reset Your Password</h2>
      
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4 mr-2" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {success ? (
        <div className="text-center">
          <div className="bg-green-100 text-green-800 p-4 rounded-md mb-4 flex items-center">
            <CheckCircle className="h-5 w-5 mr-2" />
            <span>Password reset email sent! Check your inbox for further instructions.</span>
          </div>
          <Button variant="outline" onClick={onBack} className="mt-2">
            Back to Sign In
          </Button>
        </div>
      ) : (
        <form onSubmit={handleResetPassword} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              required
            />
            <p className="text-xs text-muted-foreground">
              Enter the email address associated with your account, and we'll send you a link to reset your password.
            </p>
          </div>
          
          <div className="flex justify-between">
            <Button type="button" variant="ghost" onClick={onBack}>
              Back
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send Reset Link"
              )}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ForgotPasswordForm;