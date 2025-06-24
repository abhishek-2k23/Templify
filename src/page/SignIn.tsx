import { useSignIn } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import {
  Card,
  CardContent,
} from '../components/ui/card';
import { Button } from '../components/ui/button';

const SignIn = () => {
  const { isLoaded, signIn } = useSignIn();

  const signInWithGoogle = () => {
    if (!isLoaded) return;
    return signIn.authenticateWithRedirect({
      strategy: 'oauth_google',
      redirectUrl: '/sso-callback',
      redirectUrlComplete: '/home',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-500"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md space-y-8 animate-slide-up">
          {/* Brand Name */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-2">Templify</h1>
          </div>

          {/* Main Card */}
          <Card className="bg-white/10 border-white/20 shadow-2xl">
            <CardContent className="p-12 text-center space-y-8">
              {/* Header with Emoji */}
              <div className="space-y-4">
                <div className="text-6xl animate-float">👋</div>
                <h2 className="text-3xl font-bold text-white">Welcome Back</h2>
                <p className="text-gray-300 text-lg">Sign in to continue your template journey</p>
              </div>

              {/* Social Login Buttons */}
              <div className="space-y-4">
               

                {/* Google Button */}
                <Button
                  onClick={signInWithGoogle}
                  className="w-full bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-pink-500/25 transition-all duration-300 transform hover:scale-105"
                >
                  <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Sign in with Google
                </Button>
              </div>

            </CardContent>
          </Card>

          {/* Back to Home Link */}
          <div className="text-center">
            <Link to="/" className="text-gray-400 hover:text-white transition-colors text-sm">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;