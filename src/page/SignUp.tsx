import { SignUp as ClerkSignUp } from '@clerk/clerk-react';
import Navbar from '../components/ui/navbar';

const SignUp = () => {
  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      <div className="flex items-center justify-center px-4 pt-24">
        <ClerkSignUp path="/signup" signInUrl="/signin" />
      </div>
    </div>
  );
};

export default SignUp;