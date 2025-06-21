import { SignIn as ClerkSignIn } from '@clerk/clerk-react';
import Navbar from '../components/ui/navbar';

const SignIn = () => {
  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      <div className="flex items-center justify-center px-4 py-24">
        <ClerkSignIn path="/signin" signUpUrl="/signup" />
      </div>
    </div>
  );
};

export default SignIn;