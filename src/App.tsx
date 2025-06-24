import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './page/Home';
import SignIn from './page/SignIn';
import Hero from './page/Hero';
import FileContextProvider from './context/FileContext';
import { SignedIn, SignedOut } from '@clerk/clerk-react';
import { AppLayout } from './components/app-layout';
import History from './page/History';
import { Toaster } from 'react-hot-toast';
import { HistoryProvider } from './context/HistoryContext';
import SSOCallback from './page/SSOCallback';

function App() {
  return (
    <HistoryProvider>
      <FileContextProvider>
        <Toaster position="top-center" reverseOrder={false} />
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<Navigate to="/signin" />} />
          <Route path="/sso-callback" element={<SSOCallback />} />
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
  );
}

export default App;
