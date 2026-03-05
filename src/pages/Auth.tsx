import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Check, X } from 'lucide-react';
import Header from '@/components/layout/Header';

const PasswordRequirement = ({ met, text }: { met: boolean; text: string }) => (
  <div className={`flex items-center gap-2 text-sm ${met ? 'text-green-600' : 'text-gray-500'}`}>
    {met ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
    <span>{text}</span>
  </div>
);

const Auth = () => {
  const [searchParams] = useSearchParams();
  const [isSignUp, setIsSignUp] = useState(searchParams.get('tab') === 'signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp, signIn, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const passwordChecks = {
    minLength: password.length >= 12,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[^A-Za-z0-9]/.test(password),
  };

  const isPasswordValid = Object.values(passwordChecks).every(Boolean);

  useEffect(() => {
    setIsSignUp(searchParams.get('tab') === 'signup');
  }, [searchParams]);

  useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSignUp && !isPasswordValid) {
      toast({
        title: "Weak password",
        description: "Please ensure your password meets all security requirements.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      let error;
      if (isSignUp) {
        ({ error } = await signUp(email, password, fullName));
        if (!error) {
          toast({
            title: "Account created!",
            description: "Please check your email to verify your account.",
          });
          setTimeout(() => navigate('/'), 2000);
        }
      } else {
        ({ error } = await signIn(email, password));
        if (!error) {
          toast({ title: "Welcome back!", description: "You have successfully signed in." });
        }
      }

      if (error) {
        const errorMessage = error.message;
        if (errorMessage.includes('Too many')) {
          toast({ title: "Too many attempts", description: errorMessage, variant: "destructive" });
        } else if (errorMessage.includes('Invalid login credentials')) {
          toast({ title: "Invalid credentials", description: "Please check your email and password.", variant: "destructive" });
        } else {
          toast({ title: "Error", description: errorMessage, variant: "destructive" });
        }
      }
    } catch {
      toast({ title: "Error", description: "An unexpected error occurred.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <Header />
      <div className="main-content flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              {isSignUp ? 'Create Account' : 'Sign In'}
            </CardTitle>
            <CardDescription className="text-center">
              {isSignUp ? 'Join the CSS Events community' : 'Welcome back to CSS Events'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder={isSignUp ? "Create a strong password" : "Enter your password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={isSignUp ? 12 : 6}
                />
                {isSignUp && password.length > 0 && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-md space-y-2">
                    <p className="text-sm font-medium text-gray-700 mb-2">Password Requirements:</p>
                    <PasswordRequirement met={passwordChecks.minLength} text="At least 12 characters" />
                    <PasswordRequirement met={passwordChecks.hasUppercase} text="One uppercase letter" />
                    <PasswordRequirement met={passwordChecks.hasLowercase} text="One lowercase letter" />
                    <PasswordRequirement met={passwordChecks.hasNumber} text="One number" />
                    <PasswordRequirement met={passwordChecks.hasSpecial} text="One special character (!@#$%^&*)" />
                  </div>
                )}
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Loading...' : (isSignUp ? 'Create Account' : 'Sign In')}
              </Button>
            </form>
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-sm text-primary hover:underline"
              >
                {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
