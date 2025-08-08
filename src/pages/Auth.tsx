
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Salad, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user, signIn, signUp, resetPassword } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check for pending subscription data
  useEffect(() => {
    if (user) {
      const pendingSubscription = localStorage.getItem('pendingSubscription');
      if (pendingSubscription) {
        try {
          const subscriptionData = JSON.parse(pendingSubscription);
          localStorage.removeItem('pendingSubscription');
          
          // Navigate to subscriptions with the stored data
          navigate('/subscriptions', { 
            state: subscriptionData
          });
          return;
        } catch (error) {
          console.error('Error parsing pending subscription:', error);
        }
      }
      
      // Default redirect if no pending subscription
      navigate('/profile');
    }
  }, [user, navigate]);

  // Redirect if already logged in (but not if we have pending subscription)
  if (user && !localStorage.getItem('pendingSubscription')) {
    return <Navigate to="/profile" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let result;
      if (isLogin) {
        result = await signIn(email, password);
      } else {
        result = await signUp(email, password, fullName);
      }

      if (result.error) {
        toast({
          title: "Authentication Error",
          description: result.error.message,
          variant: "destructive"
        });
      } else if (!isLogin) {
        toast({
          title: "Account Created",
          description: "Please check your email to verify your account.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await resetPassword(email);
      if (error) {
        toast({
          title: "Reset Password Error",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Reset Email Sent",
          description: "Please check your email for reset instructions.",
        });
        setShowForgotPassword(false);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Salad className="h-12 w-12 text-orange-500" />
          </div>
          <CardTitle className="text-2xl">
            {showForgotPassword ? 'Reset Password' : (isLogin ? 'Welcome Back' : 'Create Account')}
          </CardTitle>
          <CardDescription>
            {showForgotPassword 
              ? 'Enter your email to receive reset instructions'
              : (isLogin 
                ? 'Sign in to your Madras Salad account' 
                : 'Join Madras Salad for fresh, healthy meals')
            }
            {localStorage.getItem('pendingSubscription') && !showForgotPassword && (
              <span className="block mt-2 text-green-600 font-medium">
                Complete your plan subscription after login
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={showForgotPassword ? handleForgotPassword : handleSubmit} className="space-y-4">
            {!isLogin && !showForgotPassword && (
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required={!isLogin}
                  placeholder="Enter your full name"
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
              />
            </div>
            {!showForgotPassword && (
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter your password"
                    minLength={6}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            )}
            <Button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600"
              disabled={loading}
            >
              {loading ? 'Processing...' : (showForgotPassword ? 'Send Reset Email' : (isLogin ? 'Sign In' : 'Sign Up'))}
            </Button>
          </form>
          <div className="mt-6 text-center space-y-2">
            {!showForgotPassword ? (
              <>
                <p className="text-sm text-muted-foreground">
                  {isLogin ? "Don't have an account?" : "Already have an account?"}
                </p>
                <Button
                  variant="link"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-orange-600 hover:text-orange-700"
                >
                  {isLogin ? 'Sign Up' : 'Sign In'}
                </Button>
                {isLogin && (
                  <div>
                    <Button
                      variant="link"
                      onClick={() => setShowForgotPassword(true)}
                      className="text-orange-600 hover:text-orange-700 text-sm"
                    >
                      Forgot Password?
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <Button
                variant="link"
                onClick={() => {
                  setShowForgotPassword(false);
                  setIsLogin(true);
                }}
                className="text-orange-600 hover:text-orange-700"
              >
                Back to Sign In
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
