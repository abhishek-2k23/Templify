import { SignUp as ClerkSignUp } from '@clerk/clerk-react';
import Navbar from '../components/ui/navbar';

const SignUp = () => {
  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      <div className="flex items-center justify-center px-4 pt-24">
        <ClerkSignUp
          path="/signup"
          signInUrl="/signin"
          appearance={{
            elements: {
              rootBox: 'w-full max-w-md',
              card: 'bg-gray-900/50 border border-gray-800 text-white',
              headerTitle: 'text-white',
              headerSubtitle: 'text-gray-400',
              socialButtonsBlockButton:
                'bg-gray-800/50 border-gray-700 text-white hover:bg-gray-700',
              dividerText: 'text-gray-400',
              formFieldLabel: 'text-white',
              formFieldInput:
                'bg-gray-800/50 border-gray-700 text-white',
              formButtonPrimary: 'bg-blue-600 hover:bg-blue-700 h-12',
              footerActionText: 'text-gray-400',
              footerActionLink: 'text-blue-400 hover:text-blue-300',
            },
          }}
        />
      </div>
    </div>
  );
};

export default SignUp;