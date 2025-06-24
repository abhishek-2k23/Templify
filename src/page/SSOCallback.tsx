import { AuthenticateWithRedirectCallback } from '@clerk/clerk-react';

const SSOCallback = () => {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <AuthenticateWithRedirectCallback
        continueSignUpUrl="/"
        afterSignUpUrl="/home"
        afterSignInUrl="/home"
      />
    </div>
  );
};
export default SSOCallback; 