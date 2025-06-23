import { Routes, Route } from 'react-router-dom';
import Home from './page/Home';
import SignIn from './page/SignIn';
import SignUp from './page/SignUp';
import Hero from './page/Hero';
import FileContextProvider from './context/FileContext';
import { SignedIn, SignedOut, ClerkProvider } from '@clerk/clerk-react';
import { AppLayout } from './components/app-layout';
import History from './page/History';
import { Toaster } from 'react-hot-toast';
import { HistoryProvider } from "./context/HistoryContext";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

function App() {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <HistoryProvider>
        <FileContextProvider>
          <Toaster position="top-center" reverseOrder={false} />
          <Routes>
            <Route path="/" element={<Hero />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route
              path="/home"
              element={
                <>
                  <SignedIn>
                    <AppLayout>
                      <Home />
                    </AppLayout>
                  </SignedIn>
                  <SignedOut>
                    <SignIn />
                  </SignedOut>
                </>
              }
            />
            <Route
              path="/history"
              element={
                <>
                  <SignedIn>
                    <AppLayout>
                      <History />
                    </AppLayout>
                  </SignedIn>
                  <SignedOut>
                    <SignIn />
                  </SignedOut>
                </>
              }
            />
          </Routes>
        </FileContextProvider>
      </HistoryProvider>
    </ClerkProvider>
  );
}

export default App;
