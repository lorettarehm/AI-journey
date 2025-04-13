
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';
import { useState } from 'react';

const AuthContainer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('signin');
  const [signUpEmail, setSignUpEmail] = useState<string>('');

  const handleSignUpSuccess = (email: string) => {
    setSignUpEmail(email);
    setActiveTab('signin');
  };

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold">Welcome to audhd.ai</h2>
        <p className="text-muted-foreground mt-2">Your adaptive neurodiversity companion</p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="signin">Sign In</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
        </TabsList>
        
        <TabsContent value="signin">
          <Card>
            <CardHeader>
              <CardTitle>Sign In</CardTitle>
              <CardDescription>
                Sign in to your audhd.ai account to access your personalized dashboard.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SignInForm defaultEmail={signUpEmail} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="signup">
          <Card>
            <CardHeader>
              <CardTitle>Create an Account</CardTitle>
              <CardDescription>
                Sign up to get access to all features of audhd.ai
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SignUpForm onSuccess={handleSignUpSuccess} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AuthContainer;
