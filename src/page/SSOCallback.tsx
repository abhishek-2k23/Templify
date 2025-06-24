import { AuthenticateWithRedirectCallback } from '@clerk/clerk-react';

const SSOCallback = () => {
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center text-white">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500 mb-4"></div>
      <p className="text-xl font-semibold">Please wait while we sign you in...</p>
      <AuthenticateWithRedirectCallback
        continueSignUpUrl="/"
        afterSignUpUrl="/home?status=signed_up"
        afterSignInUrl="/home?status=signed_in"
      />
    </div>
  );
};
export default SSOCallback; 