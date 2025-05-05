import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { LockIcon, KeyIcon } from 'lucide-react';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Admin password - in a real application, this would be server-side authenticated
  // and should never be in client-side code
  const ADMIN_PASSWORD = 'sofar2025';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      if (password === ADMIN_PASSWORD) {
        // Store authentication in localStorage
        localStorage.setItem('adminAuthenticated', 'true');
        // Redirect to admin dashboard
        setLocation('/admin/analytics');
      } else {
        toast({
          title: 'Authentication Failed',
          description: 'Incorrect password. Please try again.',
          variant: 'destructive'
        });
      }
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-full bg-blue-100">
              <LockIcon className="h-5 w-5 text-blue-700" />
            </div>
            <CardTitle className="text-2xl font-bold">Admin Access</CardTitle>
          </div>
          <CardDescription>
            Enter your password to access the analytics dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <KeyIcon className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter admin password"
                  className="pl-9"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? 'Authenticating...' : 'Login'}
            </Button>
            <div className="text-center text-xs text-slate-500 mt-4">
              <p>Access restricted to authorized personnel only</p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
